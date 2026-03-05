// ============================================================
// routes/payments.js — Stripe (Global) + Paystack (Africa)
// ============================================================
const router  = require('express').Router();
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios   = require('axios');
const db      = require('../db');
const { authenticate } = require('../middleware/auth');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL    = process.env.FRONTEND_URL;

// ── STRIPE CHECKOUT ──────────────────────────────────────
// Creates a Stripe hosted checkout session for a course
router.post('/stripe/checkout', authenticate, async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseResult = await db.query(
      'SELECT id, title, price_usd, thumbnail FROM courses WHERE id = $1 AND is_published = TRUE',
      [courseId]
    );
    if (!courseResult.rows.length)
      return res.status(404).json({ error: 'Course not found.' });

    const course = courseResult.rows[0];

    // Check if already enrolled
    const enrolled = await db.query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.userId, courseId]
    );
    if (enrolled.rows.length)
      return res.status(400).json({ error: 'You are already enrolled in this course.' });

    // Get or create Stripe customer
    const userResult = await db.query(
      'SELECT email, name, stripe_customer_id FROM users WHERE id = $1',
      [req.userId]
    );
    const user = userResult.rows[0];

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: user.name });
      customerId = customer.id;
      await db.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, req.userId]);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            images: course.thumbnail ? [course.thumbnail] : [],
          },
          unit_amount: Math.round(course.price_usd * 100), // cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/courses/${courseId}?enrolled=true`,
      cancel_url:  `${FRONTEND_URL}/courses/${courseId}`,
      metadata: { userId: req.userId, courseId },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Payment session creation failed.' });
  }
});

// ── STRIPE WEBHOOK ───────────────────────────────────────
// Stripe calls this when payment succeeds — enroll the user
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, courseId } = session.metadata;

    try {
      // Record payment
      const payment = await db.query(
        `INSERT INTO payments (user_id, course_id, amount, currency, provider, provider_ref, status)
         VALUES ($1, $2, $3, 'USD', 'stripe', $4, 'success')
         RETURNING id`,
        [userId, courseId, session.amount_total / 100, session.id]
      );

      // Enroll user
      await db.query(
        `INSERT INTO enrollments (user_id, course_id, payment_id)
         VALUES ($1, $2, $3) ON CONFLICT (user_id, course_id) DO NOTHING`,
        [userId, courseId, payment.rows[0].id]
      );
    } catch (err) {
      console.error('Enrollment after payment failed:', err);
    }
  }

  res.json({ received: true });
});

// ── PAYSTACK CHECKOUT ────────────────────────────────────
// Paystack is popular in Nigeria, Ghana, Kenya — supports local payment methods
router.post('/paystack/initialize', authenticate, async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseResult = await db.query(
      'SELECT id, title, price_ngn FROM courses WHERE id = $1 AND is_published = TRUE',
      [courseId]
    );
    if (!courseResult.rows.length)
      return res.status(404).json({ error: 'Course not found.' });

    const course = courseResult.rows[0];
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [req.userId]);
    const user = userResult.rows[0];

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: Math.round(course.price_ngn * 100),  // kobo
        currency: 'NGN',
        callback_url: `${FRONTEND_URL}/courses/${courseId}?enrolled=true`,
        metadata: { userId: req.userId, courseId, custom_fields: [{ display_name: 'Course', value: course.title }] },
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    res.json({
      url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (err) {
    console.error('Paystack init error:', err);
    res.status(500).json({ error: 'Payment initialization failed.' });
  }
});

// ── PAYSTACK WEBHOOK ─────────────────────────────────────
router.post('/paystack/webhook', async (req, res) => {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature'])
    return res.status(400).json({ error: 'Invalid signature.' });

  if (req.body.event === 'charge.success') {
    const { userId, courseId } = req.body.data.metadata;
    const amount = req.body.data.amount / 100;

    try {
      const payment = await db.query(
        `INSERT INTO payments (user_id, course_id, amount, currency, provider, provider_ref, status)
         VALUES ($1, $2, $3, 'NGN', 'paystack', $4, 'success')
         RETURNING id`,
        [userId, courseId, amount, req.body.data.reference]
      );
      await db.query(
        `INSERT INTO enrollments (user_id, course_id, payment_id)
         VALUES ($1, $2, $3) ON CONFLICT (user_id, course_id) DO NOTHING`,
        [userId, courseId, payment.rows[0].id]
      );
    } catch (err) {
      console.error('Paystack enrollment error:', err);
    }
  }

  res.sendStatus(200);
});

// ── GET USER ENROLLMENTS ─────────────────────────────────
router.get('/my-enrollments', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT e.course_id, e.enrolled_at, c.title, c.thumbnail, c.slug
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = $1`,
      [req.userId]
    );
    res.json({ enrollments: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollments.' });
  }
});

module.exports = router;

// routes/admin.js — Admin dashboard endpoints
const router = require('express').Router();
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [users, courses, revenue, enrollments] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM courses WHERE is_published = TRUE'),
      db.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'success'`),
      db.query('SELECT COUNT(*) FROM enrollments'),
    ]);
    res.json({
      totalUsers:       parseInt(users.rows[0].count),
      publishedCourses: parseInt(courses.rows[0].count),
      totalRevenue:     parseFloat(revenue.rows[0].total),
      totalEnrollments: parseInt(enrollments.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// List all users with pagination
router.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  try {
    const result = await db.query(
      `SELECT id, name, email, role, plan, email_verified, last_login, created_at
       FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const total = await db.query('SELECT COUNT(*) FROM users');
    res.json({ users: result.rows, total: parseInt(total.rows[0].count), page, limit });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Create / update course
router.post('/courses', async (req, res) => {
  try {
    const { title, slug, description, price_usd, price_ngn, level, category, thumbnail } = req.body;
    const result = await db.query(
      `INSERT INTO courses (title, slug, description, price_usd, price_ngn, level, category, thumbnail, instructor_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, slug, description, price_usd, price_ngn, level, category, thumbnail, req.userId]
    );
    res.status(201).json({ course: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course.' });
  }
});

// Toggle course publish status
router.patch('/courses/:id/publish', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE courses SET is_published = NOT is_published, updated_at = NOW()
       WHERE id = $1 RETURNING id, title, is_published`,
      [req.params.id]
    );
    res.json({ course: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course.' });
  }
});

// Recent payments
router.get('/payments', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.name AS user_name, u.email, c.title AS course_title
       FROM payments p
       JOIN users u ON u.id = p.user_id
       JOIN courses c ON c.id = p.course_id
       ORDER BY p.created_at DESC LIMIT 50`
    );
    res.json({ payments: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
});

module.exports = router;

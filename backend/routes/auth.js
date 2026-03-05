// ============================================================
// routes/auth.js — Real Authentication with JWT + bcrypt
// ============================================================
const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db       = require('../db');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email');
const { authenticate } = require('../middleware/auth');

const JWT_SECRET  = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// Helper: generate JWT
function signToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// ── REGISTER ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    // Check if email exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const password_hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
       RETURNING id, name, email, role, plan, created_at`,
      [name, email.toLowerCase(), password_hash]
    );
    const user = result.rows[0];

    // Send verification email
    const token = uuidv4();
    await db.query(
      `INSERT INTO auth_tokens (user_id, token, type, expires_at)
       VALUES ($1, $2, 'email_verify', NOW() + INTERVAL '24 hours')`,
      [user.id, token]
    );
    await sendVerificationEmail(user.email, user.name, token);

    const accessToken = signToken(user.id, user.role);
    res.status(201).json({ user, token: accessToken, message: 'Account created! Please verify your email.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── LOGIN ────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const result = await db.query(
      `SELECT id, name, email, password_hash, role, plan, avatar_url, email_verified
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    const user = result.rows[0];
    if (!user || !user.password_hash)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password.' });

    // Update last login
    await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const { password_hash, ...safeUser } = user;
    const token = signToken(user.id, user.role);
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── GET CURRENT USER ─────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, plan, avatar_url, email_verified, last_login, created_at
       FROM users WHERE id = $1`,
      [req.userId]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'User not found.' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// ── VERIFY EMAIL ─────────────────────────────────────────
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    const result = await db.query(
      `SELECT user_id FROM auth_tokens
       WHERE token = $1 AND type = 'email_verify' AND expires_at > NOW() AND used_at IS NULL`,
      [token]
    );
    if (!result.rows.length)
      return res.status(400).json({ error: 'Invalid or expired verification link.' });

    const { user_id } = result.rows[0];
    await db.query('UPDATE users SET email_verified = TRUE WHERE id = $1', [user_id]);
    await db.query('UPDATE auth_tokens SET used_at = NOW() WHERE token = $1', [token]);
    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// ── FORGOT PASSWORD ──────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await db.query('SELECT id, name FROM users WHERE email = $1', [email.toLowerCase()]);
    // Always return success to prevent email enumeration
    if (result.rows.length) {
      const user = result.rows[0];
      const token = uuidv4();
      await db.query(
        `INSERT INTO auth_tokens (user_id, token, type, expires_at)
         VALUES ($1, $2, 'password_reset', NOW() + INTERVAL '1 hour')`,
        [user.id, token]
      );
      await sendPasswordResetEmail(email, user.name, token);
    }
    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Request failed.' });
  }
});

// ── RESET PASSWORD ───────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    const result = await db.query(
      `SELECT user_id FROM auth_tokens
       WHERE token = $1 AND type = 'password_reset' AND expires_at > NOW() AND used_at IS NULL`,
      [token]
    );
    if (!result.rows.length)
      return res.status(400).json({ error: 'Invalid or expired reset link.' });

    const { user_id } = result.rows[0];
    const password_hash = await bcrypt.hash(password, 12);
    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [password_hash, user_id]);
    await db.query('UPDATE auth_tokens SET used_at = NOW() WHERE token = $1', [token]);
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: 'Password reset failed.' });
  }
});

module.exports = router;

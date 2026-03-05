// routes/ai.js — AI Tutor, Code Review, Project Generator
const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.use(authenticate);

// ── AI TUTOR CHAT ─────────────────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, courseContext } = req.body;

    // Load or create chat session
    let session;
    if (sessionId) {
      const result = await db.query(
        'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
        [sessionId, req.userId]
      );
      session = result.rows[0];
    }

    const history = session?.messages || [];
    history.push({ role: 'user', content: message });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are an expert full stack development AI tutor for StackAI platform.
${courseContext ? `The student is currently studying: ${courseContext}` : ''}
Be concise, encouraging, and use code examples when helpful. Keep responses under 200 words.`,
      messages: history,
    });

    const reply = response.content[0].text;
    history.push({ role: 'assistant', content: reply });

    // Save/update session
    if (session) {
      await db.query(
        'UPDATE chat_sessions SET messages = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(history), session.id]
      );
    } else {
      const newSession = await db.query(
        'INSERT INTO chat_sessions (user_id, messages) VALUES ($1, $2) RETURNING id',
        [req.userId, JSON.stringify(history)]
      );
      session = { id: newSession.rows[0].id };
    }

    res.json({ reply, sessionId: session.id });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI tutor unavailable. Please try again.' });
  }
});

// ── CODE REVIEW ───────────────────────────────────────────
router.post('/review', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required.' });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'You are a senior full stack developer doing educational code review. Give a score (1-10), list 2-3 issues with line numbers where possible, suggest improvements, and show a corrected snippet. Be encouraging and educational.',
      messages: [{ role: 'user', content: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`` }],
    });

    const review = response.content[0].text;

    // Save review history
    await db.query(
      'INSERT INTO code_reviews (user_id, code, language, review) VALUES ($1, $2, $3, $4)',
      [req.userId, code, language, review]
    );

    res.json({ review });
  } catch (err) {
    console.error('Code review error:', err);
    res.status(500).json({ error: 'Code review unavailable.' });
  }
});

// ── PROJECT GENERATOR ─────────────────────────────────────
router.post('/generate-project', async (req, res) => {
  try {
    const { stack, level, domain } = req.body;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'Generate a detailed, portfolio-worthy project idea for a full stack developer student. Include: project name, 2-sentence description, 5 key features, tech stack breakdown, estimated build time, 3 learning outcomes. Be specific, practical and inspiring.',
      messages: [{ role: 'user', content: `${level} ${domain} project using ${stack}` }],
    });

    res.json({ project: response.content[0].text });
  } catch (err) {
    console.error('Project gen error:', err);
    res.status(500).json({ error: 'Project generator unavailable.' });
  }
});

module.exports = router;

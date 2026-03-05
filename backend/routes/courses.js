// routes/courses.js — Course catalog, lessons, progress
const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET all published courses
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = `SELECT c.*, u.name AS instructor_name,
      COUNT(DISTINCT e.id) AS student_count
      FROM courses c
      LEFT JOIN users u ON u.id = c.instructor_id
      LEFT JOIN enrollments e ON e.course_id = c.id
      WHERE c.is_published = TRUE`;
    const params = [];
    if (category) { params.push(category); query += ` AND c.category = $${params.length}`; }
    if (level)    { params.push(level);    query += ` AND c.level = $${params.length}`; }
    if (search)   { params.push(`%${search}%`); query += ` AND c.title ILIKE $${params.length}`; }
    query += ' GROUP BY c.id, u.name ORDER BY c.is_featured DESC, student_count DESC';
    const result = await db.query(query, params);
    res.json({ courses: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
});

// GET single course with sections & lessons
router.get('/:slug', async (req, res) => {
  try {
    const course = await db.query(
      `SELECT c.*, u.name AS instructor_name, u.avatar_url AS instructor_avatar
       FROM courses c LEFT JOIN users u ON u.id = c.instructor_id
       WHERE c.slug = $1 AND c.is_published = TRUE`,
      [req.params.slug]
    );
    if (!course.rows.length) return res.status(404).json({ error: 'Course not found.' });

    const sections = await db.query(
      `SELECT s.*, json_agg(l.* ORDER BY l.position) AS lessons
       FROM sections s LEFT JOIN lessons l ON l.section_id = s.id
       WHERE s.course_id = $1 GROUP BY s.id ORDER BY s.position`,
      [course.rows[0].id]
    );
    res.json({ course: course.rows[0], sections: sections.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course.' });
  }
});

// GET progress for enrolled user
router.get('/:courseId/progress', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT lp.lesson_id, lp.completed, lp.watch_time_sec
       FROM lesson_progress lp
       WHERE lp.user_id = $1 AND lp.course_id = $2`,
      [req.userId, req.params.courseId]
    );
    res.json({ progress: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
});

// POST mark lesson complete
router.post('/:courseId/lessons/:lessonId/complete', authenticate, async (req, res) => {
  try {
    // Check enrollment
    const enrolled = await db.query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.userId, req.params.courseId]
    );
    if (!enrolled.rows.length)
      return res.status(403).json({ error: 'You are not enrolled in this course.' });

    await db.query(
      `INSERT INTO lesson_progress (user_id, lesson_id, course_id, completed, completed_at)
       VALUES ($1, $2, $3, TRUE, NOW())
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = TRUE, completed_at = NOW()`,
      [req.userId, req.params.lessonId, req.params.courseId]
    );

    // Check if course is now 100% complete
    const totalLessons = await db.query(
      'SELECT COUNT(*) FROM lessons WHERE course_id = $1', [req.params.courseId]
    );
    const completedLessons = await db.query(
      `SELECT COUNT(*) FROM lesson_progress
       WHERE user_id = $1 AND course_id = $2 AND completed = TRUE`,
      [req.userId, req.params.courseId]
    );
    const isComplete = parseInt(completedLessons.rows[0].count) >= parseInt(totalLessons.rows[0].count);
    if (isComplete) {
      await db.query(
        `UPDATE enrollments SET completed_at = NOW()
         WHERE user_id = $1 AND course_id = $2 AND completed_at IS NULL`,
        [req.userId, req.params.courseId]
      );
    }
    res.json({ success: true, courseCompleted: isComplete });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress.' });
  }
});

module.exports = router;

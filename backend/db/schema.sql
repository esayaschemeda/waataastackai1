-- ============================================================
-- StackAI — Complete Database Schema
-- Run this in your PostgreSQL database to set up all tables
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),                    -- NULL for OAuth users
  avatar_url    TEXT,
  role          VARCHAR(20) DEFAULT 'student',   -- student | instructor | admin
  plan          VARCHAR(20) DEFAULT 'free',       -- free | pro | enterprise
  stripe_customer_id  VARCHAR(100),
  paystack_customer_id VARCHAR(100),
  email_verified BOOLEAN DEFAULT FALSE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth accounts (Google, GitHub)
CREATE TABLE oauth_accounts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(20) NOT NULL,   -- google | github
  provider_id VARCHAR(255) NOT NULL,
  UNIQUE(provider, provider_id)
);

-- Email verification & password reset tokens
CREATE TABLE auth_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) UNIQUE NOT NULL,
  type       VARCHAR(30) NOT NULL,   -- email_verify | password_reset
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── COURSES ──────────────────────────────────────────────
CREATE TABLE courses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         VARCHAR(100) UNIQUE NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  thumbnail    TEXT,
  price_usd    DECIMAL(10,2) DEFAULT 0,
  price_ngn    DECIMAL(12,2) DEFAULT 0,          -- Naira for Paystack
  level        VARCHAR(20) DEFAULT 'beginner',   -- beginner | intermediate | advanced
  category     VARCHAR(50),
  instructor_id UUID REFERENCES users(id),
  is_published  BOOLEAN DEFAULT FALSE,
  is_featured   BOOLEAN DEFAULT FALSE,
  total_lessons INTEGER DEFAULT 0,
  total_hours   DECIMAL(5,1) DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Course sections (chapters)
CREATE TABLE sections (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  UUID REFERENCES courses(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  position   INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual lessons
CREATE TABLE lessons (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id   UUID REFERENCES sections(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  video_url    TEXT,
  duration_sec INTEGER DEFAULT 0,
  content      TEXT,          -- markdown content
  position     INTEGER NOT NULL,
  is_free      BOOLEAN DEFAULT FALSE,   -- preview lesson
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── ENROLLMENTS & PROGRESS ───────────────────────────────
CREATE TABLE enrollments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  payment_id   UUID,                     -- references payments table
  enrolled_at  TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE TABLE lesson_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed    BOOLEAN DEFAULT FALSE,
  watch_time_sec INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- ── PAYMENTS ─────────────────────────────────────────────
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id),
  course_id       UUID REFERENCES courses(id),
  amount          DECIMAL(12,2) NOT NULL,
  currency        VARCHAR(5) NOT NULL,    -- USD | NGN | KES etc
  provider        VARCHAR(20) NOT NULL,   -- stripe | paystack
  provider_ref    VARCHAR(255) UNIQUE,    -- Stripe/Paystack transaction ID
  status          VARCHAR(20) DEFAULT 'pending',  -- pending | success | failed | refunded
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE subscriptions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  plan              VARCHAR(20) NOT NULL,       -- pro | enterprise
  provider          VARCHAR(20) NOT NULL,
  provider_sub_id   VARCHAR(255) UNIQUE,
  status            VARCHAR(20) DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── AI FEATURES ──────────────────────────────────────────
-- Tutor chat history
CREATE TABLE chat_sessions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id  UUID REFERENCES courses(id),
  messages   JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Code review history
CREATE TABLE code_reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  code        TEXT NOT NULL,
  language    VARCHAR(30),
  review      TEXT NOT NULL,
  score       INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────
CREATE INDEX idx_users_email          ON users(email);
CREATE INDEX idx_courses_slug         ON courses(slug);
CREATE INDEX idx_courses_published    ON courses(is_published);
CREATE INDEX idx_enrollments_user     ON enrollments(user_id);
CREATE INDEX idx_enrollments_course   ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id, course_id);
CREATE INDEX idx_payments_user        ON payments(user_id);
CREATE INDEX idx_payments_ref         ON payments(provider_ref);

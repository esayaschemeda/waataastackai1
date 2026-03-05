// frontend/src/api.js
// ============================================================
// Replace all demo/hardcoded data in App.jsx with these calls
// Set VITE_API_URL in your frontend .env file
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ── Token management ─────────────────────────────────────
export const getToken = ()        => localStorage.getItem('stackai_token');
export const setToken = (token)   => localStorage.setItem('stackai_token', token);
export const clearToken = ()      => localStorage.removeItem('stackai_token');

// ── Base fetch helper ─────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── AUTH ─────────────────────────────────────────────────
export const auth = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: async (email, password) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(data.token);
    return data;
  },

  me: () => request('/auth/me'),

  logout: () => { clearToken(); window.location.href = '/'; },

  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token, password) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};

// ── COURSES ──────────────────────────────────────────────
export const courses = {
  list:       (filters = {}) => request('/courses?' + new URLSearchParams(filters)),
  get:        (slug)         => request(`/courses/${slug}`),
  getProgress: (courseId)   => request(`/courses/${courseId}/progress`),
  completeLesson: (courseId, lessonId) =>
    request(`/courses/${courseId}/lessons/${lessonId}/complete`, { method: 'POST' }),
};

// ── PAYMENTS ─────────────────────────────────────────────
export const payments = {
  stripeCheckout: (courseId) =>
    request('/payments/stripe/checkout', { method: 'POST', body: JSON.stringify({ courseId }) }),

  paystackCheckout: (courseId) =>
    request('/payments/paystack/initialize', { method: 'POST', body: JSON.stringify({ courseId }) }),

  myEnrollments: () => request('/payments/my-enrollments'),
};

// ── AI FEATURES ──────────────────────────────────────────
export const ai = {
  chat: (message, sessionId, courseContext) =>
    request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, sessionId, courseContext }) }),

  reviewCode: (code, language) =>
    request('/ai/review', { method: 'POST', body: JSON.stringify({ code, language }) }),

  generateProject: (stack, level, domain) =>
    request('/ai/generate-project', { method: 'POST', body: JSON.stringify({ stack, level, domain }) }),
};

// ── ADMIN ────────────────────────────────────────────────
export const admin = {
  stats:          ()       => request('/admin/stats'),
  users:          (page)   => request(`/admin/users?page=${page}`),
  payments:       ()       => request('/admin/payments'),
  createCourse:   (data)   => request('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
  togglePublish:  (id)     => request(`/admin/courses/${id}/publish`, { method: 'PATCH' }),
};

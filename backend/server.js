const express  = require("express");
const cors     = require("cors");
const helmet   = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(helmet());

// CORS setup for Netlify frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://waataastackai1.netlify.app",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/courses",  require("./routes/courses"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/ai",       require("./routes/ai"));
app.use("/api/admin",    require("./routes/admin"));

app.get("/health", (_, res) => res.json({ status: "ok", ts: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 StackAI API on port ${PORT}`));
module.exports = app;
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Require JWT for generating signed embedding URL
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const errorMiddleware = require("./middleware/errorMiddleware");

// Import routes
const blogRoutes = require("./routes/blogs");
const userRoutes = require("./routes/user");
const testRoutes = require("./routes/test");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to set cookies with appropriate SameSite attribute
app.use((req, res, next) => {
  res.cookie("myCookie", "cookieValue", {
    sameSite: "none",
    secure: true, // Required if your site is served over HTTPS
  });
  next();
});

// Log requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Set CSP header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' http://localhost:3000"
  );
  next();
});

// Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tests", testRoutes);

// Proxy requests to generate signed embedding URL for Metabase dashboard
app.get("/generate-embed-url", (req, res) => {
  const METABASE_SITE_URL = "http://localhost:3000";
  const METABASE_SECRET_KEY =
    "c067e0fb5e14a4bc5d619ce24e579cc59b2f1a87c0282c33c348cd5e75ea5541";
  const payload = {
    resource: { dashboard: "1-mindwave" }, // Replace '1' with your actual dashboard ID
    params: {},
    exp: Math.round(Date.now() / 1000) + 600, // 10 minute expiration
  };
  const token = jwt.sign(payload, METABASE_SECRET_KEY);
  const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
  res.json({ iframeUrl });
});

// Proxy requests to Metabase Docker through Node.js server
app.use(
  "/metabase",
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
  })
);

// Default route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Error middleware
app.use(errorMiddleware);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Start listening for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to MongoDB & Listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

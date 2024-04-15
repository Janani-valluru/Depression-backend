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
const dashboardRoutes = require("./routes/dashboard");

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
app.use("/api/dashboard", dashboardRoutes);

// Proxy requests to Metabase Docker through Node.js server

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

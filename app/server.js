// server.js
const express = require('express');
const cors = require('cors');
const { createMiddlewareClient } = require('@supabase/auth-helpers-nextjs');

const app = express();
const port = process.env.PORT || 3000;

// Custom CORS middleware function
function enableCors(req, res, next) {
  // Set up CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (adjust as needed)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  // Continue to the next middleware/route
  next();
}

// Use the custom CORS middleware for all routes
app.use(enableCors);

// Your API route handlers here

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

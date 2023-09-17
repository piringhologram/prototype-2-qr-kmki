import express from 'express';
import cors from 'cors';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Your API route handlers here
// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

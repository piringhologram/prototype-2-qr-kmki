import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const express = require('express');
  const cors = require('cors');
  const app = express();

  // Enable CORS for all routes
  app.use(cors());

  // Your other route handlers here
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  return res
}


// cors-middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  // Set CORS headers to allow all origins and headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  };

  // Add the CORS headers to the response
  return NextResponse.next({
    ...req,
    headers: {
      ...req.headers,
      ...headers,
    },
  });
}

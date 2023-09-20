import { NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { corsHeaders } from "@/app/_shared/cors"

export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch('http://localhost:4000/events', {
    headers: corsHeaders
  })

  const events = await res.json()

  return NextResponse.json(events, {
    status: 200
  })
}

export async function POST(request) {
  const event = await request.json()
  
   // get supabase instance
  const supabase = createRouteHandlerClient({ cookies })

  // get current user session
  const { data: { session } } = await supabase.auth.getSession()

  // insert the data
  const { data, error } = await supabase.from('events')
    .insert({
      ...event
    })
    .select()
    .single()
    .headers(corsHeaders)

  return NextResponse.json({ data, error })
  }
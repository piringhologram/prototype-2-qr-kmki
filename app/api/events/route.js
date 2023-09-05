import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch('http://localhost:4000/events')

  const events = await res.json()

  return NextResponse.json(events, {
    status: 200
  })
}

export async function POST(request) {
    const event = await request.json()
  
    const res = await fetch('http://localhost:4000/events', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(event)
    })
  
    const newEvent = await res.json()
  
    return NextResponse.json(newEvent, {
      status: 201
    })
  }
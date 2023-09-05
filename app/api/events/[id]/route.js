import { NextResponse } from "next/server"

export async function GET(_, { params }) {
  const id = params.id

  const res = await fetch(`http://localhost:4000/events/${id}`)
  const event = await res.json()

  if (!res.ok) {
    return NextResponse.json({error: 'Cannot find the event'}, {
      status: 404
    })
  }

  return NextResponse.json(event, {
    status: 200
  })
}

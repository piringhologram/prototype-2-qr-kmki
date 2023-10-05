import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const id = params.id

  const res = await fetch(`/events/${id}`)
  //const res = await fetch(`https://prototype-2-qr-kmki.vercel.app/api/${id}`)
  
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

export async function DELETE(_, { params }) {
  const id = params.id

  const supabase = createRouteHandlerClient({ cookies })

  const { error } = await supabase.from('events')
    .delete()
    .eq('id', id)

  return NextResponse.json({ error })
}

import Link from "next/link"
import { notFound } from "next/navigation"  
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

//components
import DeleteButton from './DeleteButton'

export async function generateMetadata({params}) {
    const supabase = createServerComponentClient({ cookies })

    const { data: event } = await supabase.from('Events')
    .select()
    .eq('id', params.id)
    .single()
 
    return {
        title: `KMKI Bayern | ${event?.title || 'Event not Found'}`
    }
}

async function getEvents(id) {
    const supabase = createServerComponentClient({ cookies })

    const { data } = await supabase.from('Events')
    .select()
    .eq('id', id)
    .single()

    if (!data) {
      notFound()
    }
  
    return data
}
export default async function EventDetails({params}) {
  
    const event = await getEvents(params.id)

  return (
    <main>
        <nav className="mb-0">
          <h2>Event Details</h2>
          <div className="ml-auto">
            <DeleteButton id={event.id} />
          </div>
        </nav>

        <div key = {event.id} className="card my-5">
                <h3>{event.title}</h3>
                <h4>{event.dateandtime}</h4>
                <h5 className='mb-4 font-italic'>{event.location}</h5>

                <p>{event.body}</p>

                <div className={`pill ${event.rsvp}`}>
                    RSVP {event.rsvp}
                </div>

            <div className="flex justify-left mb-2">
            <Link href="">
                <button className="btn-primary">Scan QR Code</button>
            </Link>
            </div>
            </div>
    </main>
  )
}

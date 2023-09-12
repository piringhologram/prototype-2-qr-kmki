import Link from "next/link"
import { notFound } from "next/navigation"  
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

//components
import DeleteButton from './DeleteButton'

export async function generateMetadata({params}) {
    const supabase = createServerComponentClient({ cookies })

    const { data: event } = await supabase.from('events')
    .select()
    .eq('id', params.id)
    .single()
 
    return {
        title: `KMKI Bayern | ${event?.title || 'Event not Found'}`
    }
}

async function getEvents(id) {
    const supabase = createServerComponentClient({ cookies })

    const { data } = await supabase.from('events')
    .select()
    .eq('id', id)
    .single()

    if (!data) {
      notFound()
    }
  
    return data
}

function getDateFormat(timestamp) {
  function addZero(i) {
      if (i < 10) {i = "0" + i}
      return i;
  }
  function month(i) {
      switch (i){
          case 0 : return "Januari"
          case 1 : return "Februari"
          case 2 : return "Maret"
          case 3 : return "April"
          case 4 : return "Mei"
          case 5 : return "Juni"
          case 6 : return "Juli"
          case 7 : return "Agustus"
          case 8 : return "September"
          case 9 : return "Oktober"
          case 10 : return "November"
          case 11 : return "Desember"
          default : return i
      }
  }

  return timestamp.getDate() + " " + month(timestamp.getMonth()) + " " + timestamp.getFullYear() + ", "
   + addZero(timestamp.getHours() - 2) + ":" + addZero(timestamp.getMinutes());
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

        <div key = {event.id} className="card now my-5">
                <h3>{event.title}</h3>
                <h4>{getDateFormat(new Date(event.dateandtime)) }</h4>
                <h5 className='mb-4 font-italic'>{event.location}</h5>

                <p className=""><pre className="flex-auto overflow-auto m-auto">{event.body}</pre></p>

                <div className={`pill ${event.rsvp}`}>
                    RSVP {event.rsvp}
                </div>

            <div className="flex justify-left mb-2">
            <Link href = { event.id + "/qrscanner/"}>
                <button className="btn-primary">Scan QR Code</button>
            </Link>
            </div>
            </div>
    </main>
  )
}

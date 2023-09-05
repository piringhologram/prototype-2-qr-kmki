import Link from "next/link"
import { notFound } from "next/navigation"

async function getEvents(id) {
    const res = await fetch('http://localhost:4000/events/' + id , {
        next: {
            revalidate: 60
        }
    })

    if (!res.ok) {
        notFound()
    }
    return res.json()
}
export default async function EventDetails({params}) {
  const event = await getEvents(params.id)

  return (
    <main>
        <div>
          <h2>Event Details</h2>
        </div>

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

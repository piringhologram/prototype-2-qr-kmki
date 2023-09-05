import Link from "next/link"
async function getEvents() {

    // //imitate delay
    // await new Promise(resolve => setTimeout(resolve, 3000))

    const res = await fetch('http://localhost:4000/events', {
        next: {
            revalidate: 0 //use 0 to opt out using cache.
        }
    })

    return res.json()
}

export default async function EventList() {
  const events = await getEvents()

  return (
    <>
        {events.map((event) => (
            <div key = {event.id} className="card my-5">
                <Link href= {`events/${event.id}`}>
                <h3>{event.title}</h3>
                <h4>{event.dateandtime}</h4>
                <h5 className='mb-4 font-italic'>{event.location}</h5>

                <p>{event.body.slice(0,200)}...</p>

                <div className={`pill ${event.rsvp}`}>
                    RSVP {event.rsvp}
                </div>

                <div className="flex justify-left mb-2">
                <Link href="">
                    <button className="btn-primary">Scan QR Code</button>
                </Link>
                </div>
            </Link>
            </div>
        ))}
        {events.length === 0 && (
            <p className="text-center">There are no events.</p>
        )}
    </>
  )
}

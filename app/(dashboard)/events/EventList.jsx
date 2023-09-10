import Link from "next/link"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

async function getEvents() {
    // //imitate delay
    // await new Promise(resolve => setTimeout(resolve, 3000))

    const supabase = createServerComponentClient({ cookies })

    const { data, error } = await supabase.from('Events')
    .select()

    if (error) {
        console.log(error.message)
    }

    return data
}

export default async function EventList() {
  const events = await getEvents()

  function getTimeDifference(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return Math.abs(date1 - date2);
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

  const currentTime = new Date();
  //definition past event : Hari H + 1
  currentTime.setDate(currentTime.getDate() - 1)

  const pastevents = events.filter(a => new Date(a.dateandtime) < currentTime)
  const upcomingevents = events.filter(a => new Date(a.dateandtime) > currentTime)

  return (
    <>  
        {upcomingevents.sort((a,b) => getTimeDifference(a.dateandtime,currentTime) > getTimeDifference(b.dateandtime,currentTime) ? 1 : -1)
        .map((event) => (
            <div key = {event.id} className="card now my-5">
                <Link href= {`events/${event.id}`}>
                <h3>{event.title}</h3>
                <h4>{getDateFormat(new Date(event.dateandtime)) }</h4>
                <h5 className='mb-4 font-italic'>{event.location}</h5>

                <pre >{event.body.slice(0,200)}...</pre>

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

        {pastevents.sort((a,b) => a.dateandtime < b.dateandtime ? 1 : -1)
        .map((event) => (
            <div key = {event.id} className="card past my-5">
                <Link href= {`events/${event.id}`}>
                <h3>{event.title}</h3>
                <h4>{getDateFormat(new Date(event.dateandtime))}</h4>
                <h5 className='mb-4 font-italic'>{event.location}</h5>

                <pre >{event.body.slice(0,200)}...</pre>

                <div className={`pill ${event.rsvp}`}>
                    RSVP {event.rsvp}
                </div>

                <div className="flex justify-left mb-2">
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

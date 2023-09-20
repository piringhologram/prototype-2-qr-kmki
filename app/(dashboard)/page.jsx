import Link from "next/link"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

async function getEvents() {
  // //imitate delay
  // await new Promise(resolve => setTimeout(resolve, 3000))

  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from('events')
  .select()

  if (error) {
      console.log(error.message)
  }

  return data
}

export async function LatestEvent() {
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

  function getFirstUpcomingEvents (events) {
    if (!events) {return null}

    const filtered = events.filter(a => new Date(a.dateandtime) > currentTime).
    sort((a,b) => getTimeDifference(a.dateandtime,currentTime) > getTimeDifference(b.dateandtime,currentTime) ? 1 : -1)
    return filtered.length > 0 ? filtered[0] : null;
  }

  let event = getFirstUpcomingEvents(events)

  function checktrue(a){
    if (a === true) {
        return "Enabled"
    } else {
        return "Disabled"
    }
  }

  return (

    <>  
            {event != null && (<div key = {event.id} className="card now my-5">
                <Link href= {`events/${event.id}`}>
                <h3>{event.title}</h3>
                <h4>{getDateFormat(new Date(event.dateandtime)) }</h4>
                <h5 className='mb-4 font-italic'>{event.location}</h5>

                <pre >{event.body.slice(0,200)}...</pre>

                <div className={`pill ${event.rsvp}`}>
                    RSVP {checktrue(event.rsvp)}
                </div>

                <div className="flex justify-left mb-2">
                <Link href = {"events/" + event.id + "/qrscanner/"}>
                    <button className="btn-primary">Scan QR Code</button>
                </Link>
                </div>
            </Link>
            </div>)}
        
        {event === null && (
            <p className="text-center">There are no upcoming events.</p>
        )}
    </>
  )
}



export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()

  return (
    <main>
      
      <h2>{data.session.user && <span> Hello, {data.session.user.email}</span>}</h2>
      <p className="mb-5">Welcome back to your Dashboard!</p>

      <h2>Upcoming Event</h2>
      <LatestEvent/>

    </main>
  )
}

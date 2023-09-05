import React, { Suspense } from 'react'
import Link from 'next/link'
import EventList from './EventList'
import Loading from '../loading'

export default function page() {
  return (
    <main>
        <div>
          <h2>Events</h2>
          <p>List of all events from KMKI Bayern</p>
        </div>

        <nav className='mt-4 mb-0'>
          <Link href="/events/create" className="flex justify-left">
            <button className="btn-primary">+ New Event</button>
          </Link>

          <button className="btn-secondary">Filters</button>
        </nav>

        <Suspense fallback={<Loading/>}>
          <EventList />
        </Suspense>
        
    </main>
  )
}

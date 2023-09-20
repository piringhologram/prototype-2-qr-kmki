"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { corsHeaders } from "@/app/_shared/cors"

export default function CreateForm() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [dateandtime, setDateandtime] = useState('')
  const [location, setLocation] = useState('')
  const [body, setBody] = useState('')
  const [rsvp, setRsvp] = useState('false')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e)  => {
    e.preventDefault()
    setIsLoading(true)

    const newEvent = { title, dateandtime, location, body, rsvp }

    const res = await fetch('http://localhost:3000/api/events', {
      method: "POST",
      headers: {"Content-Type": "application/json",
                corsHeaders},
      body: JSON.stringify(newEvent)
    })

    const json = await res.json()

    if (json.error) {
      console.log(error.message)
    }
    if (json.data) {
      router.refresh()
      router.push('/events')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-1/2">
      <label>
        <span>Event Name:</span>
        <input
          required 
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </label>
      <label>
        <span>Date and Time:</span>
        <input
          required 
          type="datetime-local" 
          onChange={(e) => setDateandtime(e.target.value)}
          value={dateandtime}
        />
      </label>

      <label>
        <span>Location:</span>
        <input
          required 
          type="text"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
        />
      </label>
      
      <label>
        <span>RSVP:</span>
        <select 
          onChange={(e) => setRsvp(e.target.value)}
          value={rsvp}
        >
          <option value="TRUE">Enable</option>
          <option value="FALSE">Disable</option>
        </select>
      </label>

      <label>
        <span>Description:</span>
        <textarea
          onChange={(e) => setBody(e.target.value)}
          value={body}
        />
      </label>

      <button 
        className="btn-primary" 
        disabled={isLoading}
      >
      {isLoading && <span>Adding...</span>}
      {!isLoading && <span>Add Event</span>}
    </button>
    </form>
  )
}

"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { corsHeaders } from '@/app/_shared/cors'

// icons & UI
import { TiDelete } from 'react-icons/ti'

export default function DeleteIcon({ id }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setIsLoading(true)
    
    const res = await fetch(`http://localhost:3000/api/events/${id}`, {
      method: 'DELETE',
      headers: corsHeaders
    })
    const json = await res.json()

    if (json.error) {
      console.log(error)
      setIsLoading(false)
    }
    if (!json.error) {
      router.refresh()
      router.push('/events')
    }
  }

  return (
    <button 
      className="btn-secondary" 
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading && (
        <>
          <TiDelete />
          Deleting....
        </>
      )}
      {!isLoading && (
        <>
          <TiDelete />
          Delete Event
        </>
      )}
    </button>
  )
}
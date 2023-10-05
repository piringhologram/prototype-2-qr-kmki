"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// icons & UI
import { TiDelete } from 'react-icons/ti'

export default function DeleteIcon({ id }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setIsLoading(true)
    
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE'
    })
    const json = await res.json()

    if (json.error) {
      console.log(json.error)
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
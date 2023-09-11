import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h2>Hi, Christian Devin</h2>
      <p className="mb-5">Welcome back to your Dashboard!</p>

      <h2>Upcoming Event</h2>

      <div className="card">
        <h3>Semestereröffnungsparty</h3>
        <h4>4 November 2023, 16:00</h4>
        <h5 className='mb-4 font-italic'>KHG LMU</h5>

        <div className="flex justify-left mb-2">
        <Link href="">
          <button className="btn-primary">Scan QR Code</button>
        </Link>
        </div>
      
      </div>

    </main>
  )
}

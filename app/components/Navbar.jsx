import Link from "next/link"
import Image from "next/image"
import Logo from "./logo-kmki-bayern.png"

export default function Navbar() {
  return (
    <nav>
      <Image
        src={Logo}
        alt='Logo KMKI Bayern'
        width={70}
        placeholder='blur'
        quality={100}
      />
        <h1>Project QR</h1>
        <Link href= "/">Dashboard</Link>
        <Link href= "/events">Events</Link>

    </nav>
  )
}

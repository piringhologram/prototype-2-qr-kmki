import React from 'react'
import Image from 'next/image'
import Logo from "../components/logo-kmki-bayern.png"
import Link from 'next/link'


export default function AuthLayout({children}) {
  return (
    <>
        <nav>
        <Image
        src={Logo}
        alt='Logo KMKI Bayern'
        width={70}
        placeholder='blur'
        quality={100}
        />
        <h1>Project QR</h1>
        <Link href= "/login">Login</Link>
    </nav>
    {children}
    </>
  )
}

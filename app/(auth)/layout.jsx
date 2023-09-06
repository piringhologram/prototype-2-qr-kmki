import React from 'react'
import Image from 'next/image'
import Logo from "../components/logo-kmki-bayern.png"
import Link from 'next/link'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function AuthLayout({children}) {

  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    redirect('/')
  }

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
        <Link href= "/signup">Signup</Link>
    </nav>
    {children}
    </>
  )
}

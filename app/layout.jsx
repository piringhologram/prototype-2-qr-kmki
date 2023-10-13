import './globals.css'
import { Montserrat } from 'next/font/google'

export const dynamic = 'force-dynamic'

//components
import Navbar from './components/Navbar'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'KMKI Bayern',
  description: 'QR Code Attendance System for KMKI Bayern',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        </body>
    </html>
  )
}

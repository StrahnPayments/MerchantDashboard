import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Merchant Dashboard - Payment Analytics',
  description: 'Professional payment processing dashboard with real-time analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-slate-950 text-slate-100 antialiased`}>
        <div className="min-h-screen gradient-bg">
          {children}
        </div>
      </body>
    </html>
  )
}
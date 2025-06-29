import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PaymentIntent } from '../../lib/types'
import DashboardClient from './components/DashboardClient'

export default async function DashboardPage() {
  const supabase = createServerClient("https://pobwvgqdqslozqaedryy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYnd2Z3FkcXNsb3pxYWVkcnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDcwNzk2NSwiZXhwIjoyMDY2MjgzOTY1fQ.sA4ydqtRQndgj-AFbm_Imel8ZcfTRuXkoa3hxdu0KCo", { cookies: cookies })

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  
  // if (!session) {
  //   redirect('/login')
  // }

  // Fetch payment intents data
  const { data: paymentIntents, error } = await supabase
    .from('payment_intents')
    .select('*')
    .order('created', { ascending: false })
  console.log(paymentIntents, error);

  if (error) {
    console.error('Error fetching payment intents:', error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Merchant Dashboard</h1>
          <p className="text-gray-400 mt-2">Monitor your payment processing metrics and recent transactions</p>
        </div>
        
        <DashboardClient paymentIntents={paymentIntents} />
      </div>
    </div>
  )
}
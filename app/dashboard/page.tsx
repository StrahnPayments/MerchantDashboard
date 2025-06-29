import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PaymentIntent } from '../../lib/types'
import DashboardClient from './components/DashboardClient'
import { BarChart3, TrendingUp, Shield, Zap } from 'lucide-react'

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

  if (error) {
    console.error('Error fetching payment intents:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Dashboard</h1>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PaymentPro</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Live Data</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">M</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Analytics
              </h1>
              <p className="text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Real-time insights into your payment processing
              </p>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Auto-refresh enabled</span>
              </div>
            </div>
          </div>
        </div>
        
        <DashboardClient paymentIntents={paymentIntents} />
      </main>
    </div>
  )
}
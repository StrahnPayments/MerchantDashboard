'use client'

import { useState } from 'react'
import { PaymentIntent } from '../../../lib/types'
import StatCards from './StatCards'
import RecentPaymentsTable from './RecentPaymentsTable'
import IntentDetails from './IntentDetails'

interface DashboardClientProps {
  paymentIntents: PaymentIntent[]
}

export default function DashboardClient({ paymentIntents }: DashboardClientProps) {
  const [selectedIntent, setSelectedIntent] = useState<PaymentIntent | null>(null)

  return (
    <div className="space-y-8">
      <StatCards paymentIntents={paymentIntents} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <RecentPaymentsTable 
            paymentIntents={paymentIntents} 
            setSelectedIntent={setSelectedIntent}
          />
        </div>
        
        <div className="xl:col-span-1">
          <IntentDetails selectedIntent={selectedIntent} />
        </div>
      </div>
    </div>
  )
}
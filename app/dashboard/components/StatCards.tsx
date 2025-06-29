'use client'

import { PaymentIntent } from '../../../lib/types'
import { DollarSign, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface StatCardsProps {
  paymentIntents: PaymentIntent[]
}

export default function StatCards({ paymentIntents }: StatCardsProps) {
  // Calculate metrics
  const succeededIntents = paymentIntents.filter(intent => intent.status === 'succeeded')
  
  // Total Volume: Sum of amounts for succeeded payments
  const totalVolume = succeededIntents.reduce((sum, intent) => sum + intent.amount, 0)
  const formattedTotalVolume = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalVolume / 100) // Convert from cents to dollars

  // Today's Successful Payments: Count of succeeded payments in last 24 hours
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const todaysSuccessfulPayments = succeededIntents.filter(intent => 
    new Date(intent.created_at) >= twentyFourHoursAgo
  ).length

  // Active Intents: Count of processing or requires_action status
  const activeIntents = paymentIntents.filter(intent => 
    intent.status === 'processing' || intent.status === 'requires_action'
  ).length

  // Total Successful Payments: Count of all succeeded payments
  const totalSuccessfulPayments = succeededIntents.length
  console.log(totalSuccessfulPayments);
  console.log(paymentIntents);
  const stats = [
    {
      title: 'Total Volume',
      value: formattedTotalVolume,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      border: 'border-green-800'
    },
    {
      title: "Today's Successful Payments",
      value: todaysSuccessfulPayments.toString(),
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-800'
    },
    {
      title: 'Active Intents',
      value: activeIntents.toString(),
      icon: <Clock className="h-6 w-6" />,
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-800'
    },
    {
      title: 'Total Successful Payments',
      value: totalSuccessfulPayments.toString(),
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
      border: 'border-emerald-800'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bg} ${stat.border} border rounded-lg p-6 transition-transform duration-200 hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
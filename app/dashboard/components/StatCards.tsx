'use client'

import { PaymentIntent } from '../../../lib/types'
import { DollarSign, CheckCircle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

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
  }).format(totalVolume / 100)

  // Today's Successful Payments
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const todaysSuccessfulPayments = succeededIntents.filter(intent => 
    new Date(intent.created) >= twentyFourHoursAgo
  ).length

  // Active Intents
  const activeIntents = paymentIntents.filter(intent => 
    intent.status === 'processing' || intent.status === 'requires_action'
  ).length

  // Total Successful Payments
  const totalSuccessfulPayments = succeededIntents.length

  // Calculate growth percentages (mock data for demo)
  const mockGrowthData = [
    { value: '+12.5%', isPositive: true },
    { value: '+8.2%', isPositive: true },
    { value: '-2.1%', isPositive: false },
    { value: '+15.7%', isPositive: true },
  ]

  const stats = [
    {
      title: 'Total Revenue',
      value: formattedTotalVolume,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      growth: mockGrowthData[0]
    },
    {
      title: "Today's Payments",
      value: todaysSuccessfulPayments.toString(),
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      growth: mockGrowthData[1]
    },
    {
      title: 'Pending Transactions',
      value: activeIntents.toString(),
      icon: <Clock className="h-6 w-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      growth: mockGrowthData[2]
    },
    {
      title: 'Successful Payments',
      value: totalSuccessfulPayments.toString(),
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      growth: mockGrowthData[3]
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className={`card p-6 hover:shadow-lg transition-all duration-300 ${stat.borderColor} border group`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              stat.growth.isPositive 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {stat.growth.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{stat.growth.value}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">vs last period</p>
          </div>
        </div>
      ))}
    </div>
  )
}
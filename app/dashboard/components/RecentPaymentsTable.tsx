'use client'

import { PaymentIntent } from '../../../lib/types'
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'

interface RecentPaymentsTableProps {
  paymentIntents: PaymentIntent[]
  setSelectedIntent: (intent: PaymentIntent) => void
}

export default function RecentPaymentsTable({ paymentIntents, setSelectedIntent }: RecentPaymentsTableProps) {
  // Filter and get 10 most recent succeeded payments
  const recentSucceededPayments = paymentIntents
    .filter(intent => intent.status === 'succeeded')
    .slice(0, 10)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: {
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'bg-green-900/20 text-green-400 border-green-800',
        label: 'Succeeded'
      },
      processing: {
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-yellow-900/20 text-yellow-400 border-yellow-800',
        label: 'Processing'
      },
      requires_action: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-orange-900/20 text-orange-400 border-orange-800',
        label: 'Requires Action'
      },
      requires_payment_method: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-red-900/20 text-red-400 border-red-800',
        label: 'Requires Payment'
      },
      canceled: {
        icon: <XCircle className="h-4 w-4" />,
        color: 'bg-gray-900/20 text-gray-400 border-gray-800',
        label: 'Canceled'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.canceled

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </span>
    )
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Recent Payments</h2>
      
      {recentSucceededPayments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No successful payments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSucceededPayments.map((intent) => (
                <tr 
                  key={intent.id}
                  className="table-row"
                  onClick={() => setSelectedIntent(intent)}
                >
                  <td className="py-3 px-4">
                    {getStatusBadge(intent.status)}
                  </td>
                  <td className="py-3 px-4 text-sm text-white">
                    {intent.customer_email}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-white">
                    {formatAmount(intent.amount, intent.currency)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {formatDate(intent.created)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
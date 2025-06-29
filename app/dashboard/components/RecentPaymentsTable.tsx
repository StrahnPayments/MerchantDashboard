'use client'

import { PaymentIntent } from '../../../lib/types'
import { CheckCircle, Clock, AlertCircle, XCircle, Search, Filter, Download } from 'lucide-react'
import { useState } from 'react'

interface RecentPaymentsTableProps {
  paymentIntents: PaymentIntent[]
  setSelectedIntent: (intent: PaymentIntent) => void
}

export default function RecentPaymentsTable({ paymentIntents, setSelectedIntent }: RecentPaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter payments based on search and status
  const filteredPayments = paymentIntents
    .filter(intent => {
      const email = intent.receipt_email || 'N/A'
      const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           intent.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || intent.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .slice(0, 10)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: {
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'bg-green-50 text-green-700 border-green-200',
        label: 'Succeeded'
      },
      processing: {
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        label: 'Processing'
      },
      requires_action: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'Action Required'
      },
      requires_payment_method: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-red-50 text-red-700 border-red-200',
        label: 'Payment Required'
      },
      canceled: {
        icon: <XCircle className="h-4 w-4" />,
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        label: 'Canceled'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.canceled

    return (
      <span className={`status-badge ${config.color}`}>
        {config.icon}
        <span className="ml-1.5">{config.label}</span>
      </span>
    )
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (created: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(created))
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Recent Transactions</h2>
          <p className="text-sm text-gray-600">Latest payment activities</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-all duration-200"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="processing">Processing</option>
            <option value="requires_action">Action Required</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">No transactions found</p>
          <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((intent) => {
                const customerEmail = intent.receipt_email || 'N/A'
                return (
                  <tr 
                    key={intent.id}
                    className="table-row group"
                    onClick={() => setSelectedIntent(intent)}
                  >
                    <td className="py-4 px-4">
                      {getStatusBadge(intent.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-white">
                            {customerEmail.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                            {customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatAmount(intent.amount, intent.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(intent.created)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {intent.id.slice(-8)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
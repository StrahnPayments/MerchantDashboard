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
        color: 'bg-green-500/10 text-green-400 border-green-500/20',
        label: 'Succeeded'
      },
      processing: {
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        label: 'Processing'
      },
      requires_action: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        label: 'Action Required'
      },
      requires_payment_method: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        label: 'Payment Required'
      },
      canceled: {
        icon: <XCircle className="h-4 w-4" />,
        color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
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

  const formatDate = (created: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(created * 1000)) // Convert Unix timestamp to milliseconds
  }

  return (
    <div className="card-dark p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Recent Transactions</h2>
          <p className="text-sm text-slate-400">Latest payment activities</p>
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 appearance-none cursor-pointer"
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
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-400 mb-2">No transactions found</p>
          <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">ID</th>
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
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-white">
                            {customerEmail.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                            {customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-white">
                        {formatAmount(intent.amount, intent.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-400">
                        {formatDate(intent.created)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
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
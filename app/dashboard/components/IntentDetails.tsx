'use client'

import { PaymentIntent } from '../../../lib/types'
import { FileText, Copy, Check, ExternalLink, Calendar, CreditCard, Mail, Hash } from 'lucide-react'
import { useState } from 'react'

interface IntentDetailsProps {
  selectedIntent: PaymentIntent | null
}

export default function IntentDetails({ selectedIntent }: IntentDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (!selectedIntent) {
    return (
      <div className="card-dark p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Transaction Details</h2>
            <p className="text-sm text-slate-400">Select a transaction to view details</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-400 mb-2">No transaction selected</p>
          <p className="text-sm text-slate-500">Click on any transaction from the table to view its details</p>
        </div>
      </div>
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(new Date(created * 1000)) // Convert Unix timestamp to milliseconds
  }

  const getStatusColor = (status: string) => {
    const colors = {
      succeeded: 'text-green-400 bg-green-500/10 border-green-500/20',
      processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      requires_action: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      requires_payment_method: 'text-red-400 bg-red-500/10 border-red-500/20',
      canceled: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
    return colors[status as keyof typeof colors] || colors.canceled
  }

  const DetailRow = ({ 
    icon, 
    label, 
    value, 
    copyable = false 
  }: { 
    icon: React.ReactNode
    label: string
    value: string
    copyable?: boolean 
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-slate-800 last:border-b-0 group">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 max-w-xs">
        <span className="text-sm text-white text-right truncate font-mono">
          {value}
        </span>
        {copyable && (
          <button
            onClick={() => copyToClipboard(value, label)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-700 rounded-lg transition-all duration-200"
            title="Copy to clipboard"
          >
            {copiedField === label ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-slate-400" />
            )}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="card-dark p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Transaction Details</h2>
            <p className="text-sm text-slate-400">Complete transaction information</p>
          </div>
        </div>
        
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(selectedIntent.status)}`}>
          {selectedIntent.status.charAt(0).toUpperCase() + selectedIntent.status.slice(1)}
        </div>
      </div>
      
      {/* Details */}
      <div className="space-y-0">
        <DetailRow 
          icon={<Hash className="w-4 h-4" />}
          label="Transaction ID" 
          value={selectedIntent.id} 
          copyable={true}
        />
        
        <DetailRow 
          icon={<Mail className="w-4 h-4" />}
          label="Receipt Email" 
          value={selectedIntent.receipt_email || 'N/A'} 
          copyable={!!selectedIntent.receipt_email}
        />
        
        <DetailRow 
          icon={<CreditCard className="w-4 h-4" />}
          label="Amount" 
          value={formatAmount(selectedIntent.amount, selectedIntent.currency)} 
        />
        
        <DetailRow 
          icon={<CreditCard className="w-4 h-4" />}
          label="Currency" 
          value={selectedIntent.currency.toUpperCase()} 
        />
        
        {selectedIntent.latest_charge && (
          <DetailRow 
            icon={<ExternalLink className="w-4 h-4" />}
            label="Latest Charge" 
            value={selectedIntent.latest_charge} 
            copyable={true}
          />
        )}
        
        <DetailRow 
          icon={<Calendar className="w-4 h-4" />}
          label="Created At" 
          value={formatDate(selectedIntent.created)} 
        />
      </div>
      
      {/* Metadata */}
      {selectedIntent.metadata && Object.keys(selectedIntent.metadata).length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
            <div className="w-4 h-4 bg-slate-700 rounded mr-2 flex items-center justify-center">
              <span className="text-xs">{ }</span>
            </div>
            Metadata
          </h3>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {JSON.stringify(selectedIntent.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
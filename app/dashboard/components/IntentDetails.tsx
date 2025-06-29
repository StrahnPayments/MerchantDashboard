'use client'

import { PaymentIntent } from '../.../lib/types'
import { FileText, Copy, Check } from 'lucide-react'
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
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">Intent Details</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Select a payment from the table to view details</p>
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

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(new Date(dateString))
  }

  const DetailRow = ({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
      <span className="text-sm font-medium text-gray-400">{label}:</span>
      <div className="flex items-center">
        <span className="text-sm text-white text-right max-w-xs truncate">{value}</span>
        {copyable && (
          <button
            onClick={() => copyToClipboard(value, label)}
            className="ml-2 p-1 hover:bg-gray-700 rounded transition-colors duration-200"
            title="Copy to clipboard"
          >
            {copiedField === label ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="card p-6">
      <div className="flex items-center mb-6">
        <FileText className="h-5 w-5 text-blue-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Intent Details</h2>
      </div>
      
      <div className="space-y-0">
        <DetailRow 
          label="Intent ID" 
          value={selectedIntent.id} 
          copyable={true}
        />
        <DetailRow 
          label="Status" 
          value={selectedIntent.status.charAt(0).toUpperCase() + selectedIntent.status.slice(1)} 
        />
        <DetailRow 
          label="Customer Email" 
          value={selectedIntent.customer_email} 
          copyable={true}
        />
        <DetailRow 
          label="Amount" 
          value={formatAmount(selectedIntent.amount, selectedIntent.currency)} 
        />
        <DetailRow 
          label="Currency" 
          value={selectedIntent.currency.toUpperCase()} 
        />
        <DetailRow 
          label="Latest Charge" 
          value={selectedIntent.latest_charge_id || 'N/A'} 
          copyable={!!selectedIntent.latest_charge_id}
        />
        <DetailRow 
          label="Created At" 
          value={formatDate(selectedIntent.created)} 
        />
        
        {selectedIntent.metadata && Object.keys(selectedIntent.metadata).length > 0 && (
          <div className="pt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Metadata:</h3>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(selectedIntent.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
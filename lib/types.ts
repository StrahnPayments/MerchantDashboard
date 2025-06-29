export interface PaymentIntent {
  id: string
  created: string
  amount: number
  currency: string
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'requires_action' | 'canceled'
  customer_email: string
  metadata: Record<string, any>
  latest_charge_id: string | null
}

export interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string
}
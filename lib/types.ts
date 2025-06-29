export interface PaymentIntent {
  id: string
  created: number // Stripe uses Unix timestamp
  amount: number
  currency: string
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'requires_action' | 'canceled'
  customer?: string | null // Stripe customer ID, not email
  receipt_email?: string | null // This is where email might be stored
  metadata: Record<string, any>
  latest_charge?: string | null // Stripe uses latest_charge, not latest_charge_id
}

export interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string
}
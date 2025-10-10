export const PAYMENT_TYPES = ['sbp', 'bankcard'] as const

export type PaymentFormValues = {
  amount: number | undefined
  type: PaymentType | undefined
  note: string | undefined
}

export type PaymentType = (typeof PAYMENT_TYPES)[number]

export type PaymentMethod = {
  type: PaymentType
  name: string
  icon: string
}

export type PaymentAmount = {
  value: number
  label: string
}

import { PAYMENT_TYPE_VALUES } from './config'

export type PaymentType = (typeof PAYMENT_TYPE_VALUES)[number]

export type Payment = {
  type: PaymentType
  name: string
  icon: string
}

export type PaySchema = {
  amount: number | undefined
  type: PaymentType | undefined
  note?: string | undefined
}

export type PaymentAmount = {
  value: number
  label: string
}

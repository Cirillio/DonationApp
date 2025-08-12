import { PaySchema } from '@/domain/payment/schema'

const DEFAULT_PAY_FORM: Partial<PaySchema> = {
  payAmount: 0,
  payPaymentType: undefined,
}

export { DEFAULT_PAY_FORM }

export interface PaymentAmount {
  value: number
  label: string
}

export const PAYMENT_AMOUNTS = [
  {
    value: 100,
    label: '100,00',
  },
  {
    value: 500,
    label: '500,00',
  },
  {
    value: 1000,
    label: '1 000,00',
  },
  {
    value: 2500,
    label: '2 500,00',
  },
  {
    value: 5000,
    label: '5 000,00',
  },
  {
    value: 10000,
    label: '10 000,00',
  },
] as const satisfies readonly {
  value: number
  label: string
}[]

export type PaymentAmounts = typeof PAYMENT_AMOUNTS

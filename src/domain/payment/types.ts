import sbp_icon from '@/assets/icons/payment/SBP.svg'
import bankcard_icon from '@/assets/icons/payment/bankcard.svg'

export const PAYMENT_TYPE_VALUES = ['sbp', 'bankcard'] as const

export type PaymentType = (typeof PAYMENT_TYPE_VALUES)[number]

export type Payment = {
  type: PaymentType
  name: string
  icon: string
}

export const PAYMENT_TYPES: Payment[] = [
  {
    type: 'sbp',
    name: 'СБП',
    icon: sbp_icon,
  },
  {
    type: 'bankcard',
    name: 'Картой онлайн',
    icon: bankcard_icon,
  },
]

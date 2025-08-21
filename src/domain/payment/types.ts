import sbp_icon from '@/shared/assets/icons/payment/SBP.svg'
import bankcard_icon from '@/shared/assets/icons/payment/bankcard.svg'
import { z, ZodObject } from 'zod'

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
export type paySchema = ZodObject<
  {
    amount: z.ZodNumber
    type: z.ZodEnum<{
      sbp: 'sbp'
      bankcard: 'bankcard'
    }>
    note: z.ZodOptional<z.ZodString>
  },
  z.core.$strip
>

export type PaySchema = z.output<paySchema>

import { PaymentMethod, PaymentAmount, PaymentFormValues } from '@/lib/types'
import sbp_icon from '@/assets/icons/payment/SBP.svg'
import bankcard_icon from '@/assets/icons/payment/bankcard.svg'

const DEFAULT_PAY_FORM: PaymentFormValues = {
  amount: undefined,
  type: undefined,
  note: undefined,
}

const PAYMENT_METHODS: PaymentMethod[] = [
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

const PAYMENT_AMOUNTS: PaymentAmount[] = [
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
] as const satisfies PaymentAmount[]

const PAYMENT_AMOUNTS_MIN = PAYMENT_AMOUNTS[0]

export { DEFAULT_PAY_FORM, PAYMENT_METHODS, PAYMENT_AMOUNTS, PAYMENT_AMOUNTS_MIN }

import { DonationStatus } from '../types/donate'

export const DONATE_STEPS: {
  step: number
  title: string
  status: DonationStatus
  icon: string
}[] = [
  {
    step: 1,
    title: 'Анкета',
    status: 'blank',
    icon: 'f7--person',
  },
  {
    step: 2,
    title: 'Оплата',
    status: 'payment',
    icon: 'f7--creditcard',
  },
  {
    step: 3,
    title: 'Результат',
    status: 'result',
    icon: 'f7--checkmark-circle',
  },
] as const

export const MAX_STEPS = DONATE_STEPS.length

export const STEP_TO_STATUS: Record<number, DonationStatus> = {
  1: 'blank',
  2: 'payment',
  3: 'result',
} as const

export const STATUS_TO_STEP: Record<DonationStatus, number> = {
  blank: 1,
  payment: 2,
  result: 3,
} as const

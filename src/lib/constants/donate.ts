import { DonationStatus } from '../types/donate'

export const DONATE_STEPS: {
  step: number
  title: string
  desc?: string
  status: DonationStatus
  icon: string
}[] = [
  {
    step: 1,
    title: 'Анкета',
    desc: 'Укажите информацию о себе',
    status: 'blank',
    icon: 'f7--person',
  },
  {
    step: 2,
    title: 'Оплата',
    desc: 'Выберите способ оплаты и введите сумму',
    status: 'payment',
    icon: 'f7--creditcard',
  },
  {
    step: 3,
    title: 'Подтверждение',
    desc: 'Проверьте и подтвердите детали формы',
    status: 'confirm',
    icon: 'f7--doc-text',
  },
  {
    step: 4,
    title: 'Результат',
    desc: 'Посмотрите результаты вашего пожертвования',
    status: 'result',
    icon: 'f7--checkmark-circle',
  },
] as const

export const MAX_STEPS = DONATE_STEPS.length

export const STEP_TO_STATUS: Record<number, DonationStatus> = {
  1: 'blank',
  2: 'payment',
  3: 'confirm',
  4: 'result',
} as const

export const STATUS_TO_STEP: Record<DonationStatus, number> = {
  blank: 1,
  payment: 2,
  confirm: 3,
  result: 4,
} as const

import { z } from 'zod'
import { PAYMENT_TYPE_VALUES } from '@/domain/payment/types'

const paySchema = z.object({
  payAmount: z
    .number('Пожалуйста, укажите сумму пожертвования.')
    .min(100, 'Указанная сумма меньше минимальной.'),

  payPaymentType: z.enum(PAYMENT_TYPE_VALUES, 'Пожалуйста, укажите способ оплаты.'),
})

export default paySchema
export type PaySchema = z.infer<typeof paySchema>

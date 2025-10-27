import { z } from 'zod'
import { PAYMENT_TYPES } from '@/lib/types'

const amountSchema = z
  .number('Пожалуйста, укажите сумму пожертвования.')
  .min(100, 'Указанная сумма меньше минимальной.')

const typeSchema = z.enum(PAYMENT_TYPES, 'Пожалуйста, укажите способ оплаты.')

const noteSchema = z.string().trim().max(200, 'Максимум 200 символов.').optional()

const paymentFormSchema = z.object({
  amount: amountSchema,
  type: typeSchema,
  note: noteSchema,
})

export { amountSchema, typeSchema, noteSchema, paymentFormSchema }

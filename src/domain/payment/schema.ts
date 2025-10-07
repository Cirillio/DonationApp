import { z } from 'zod'
import { PAYMENT_TYPE_VALUES } from './config'

const amountSchema = z
  .number('Пожалуйста, укажите сумму пожертвования.')
  .min(100, 'Указанная сумма меньше минимальной.')

const typeSchema = z.enum(PAYMENT_TYPE_VALUES, 'Пожалуйста, укажите способ оплаты.')

const noteSchema = z.string().trim().max(200, 'Максимум 200 символов.').optional()

export { amountSchema, typeSchema, noteSchema }

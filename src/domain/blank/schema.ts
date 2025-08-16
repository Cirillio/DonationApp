import { z, ZodObject } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'
const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/

type blankSchema = ZodObject<
  {
    phone: z.ZodString
    name: z.ZodOptional<z.ZodString>
    birth: z.ZodString
    isGroup: z.ZodOptional<z.ZodBoolean>
  },
  z.core.$strip
>

const makeBlankSchema = (getPhoneCode: () => string): blankSchema =>
  z.object({
    phone: z
      .string('Пожалуйста, укажите номер телефона.')
      .nonempty('Телефон обязателен для заполнения.')
      .refine((value) => {
        return isValidPhoneNumber(getPhoneCode() + ' ' + value)
      }, 'Номер указан неверно.'),

    name: z
      .string()
      .refine(
        (value) => value.trim().length === 0 || value.trim().length >= 3,
        'Хотя бы 3 символа.'
      )
      .max(50, 'Имя должно быть не длиннее 50 символов.')
      .regex(/^[\p{L}\s-]*$/u, 'Имя может содержать только буквы, пробелы и тире.')
      .optional(),

    birth: z
      .string()
      .nonempty('Пожалуйста, заполните дату рождения.')
      .regex(dateRegex, 'Неверный формат даты.')
      .refine((val) => {
        const [day, month, year] = val.split('.').map(Number)
        const date = new Date(year, month - 1, day)
        // Проверка что дата валидна и соответствует введённой
        return (
          date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
        )
      }, 'Такой даты не существует.')
      .refine((val) => {
        const [day, month, year] = val.split('.').map(Number)
        const date = new Date(year, month - 1, day)
        const today = new Date()
        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        )
        return date <= eighteenYearsAgo
      }, 'Вам должно быть не менее 18 лет.')
      .refine((val) => {
        const [day, month, year] = val.split('.').map(Number)
        const date = new Date(year, month - 1, day)
        const today = new Date()
        const hundredYearsAgo = new Date(
          today.getFullYear() - 100,
          today.getMonth(),
          today.getDate()
        )
        return date >= hundredYearsAgo
      }, 'Возраст не может быть больше 100 лет.'),

    isGroup: z.boolean().optional(),
  })

export default makeBlankSchema
export type BlankSchema = z.output<blankSchema>

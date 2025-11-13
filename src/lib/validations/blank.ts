import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

const phoneSchema = (getPhoneCode: () => string) =>
  z
    .string('Пожалуйста, укажите номер телефона.')
    .nonempty('Телефон обязателен для заполнения.')
    .refine(value => {
      return isValidPhoneNumber(getPhoneCode() + ' ' + value)
    }, 'Номер указан неверно.')

const nameSchema = (isAnonymous: () => boolean) =>
  z
    .string('Пожалуйста, укажите имя.')
    .refine(value => {
      if (isAnonymous()) {
        return true
      }
      return value.trim().length >= 3
    }, 'Имя должно быть не короче 3 символов.')
    .max(50, 'Имя должно быть не длиннее 50 символов.')
    .regex(/^[\p{L}\s-]*$/u, 'Имя может содержать только буквы, пробелы и дефис.')

const birthSchema = z.preprocess(
  val => {
    // Если null/undefined, возвращаем undefined для ошибки required
    if (val === null || val === undefined) return undefined
    // Если уже Date объект, возвращаем как есть
    if (val instanceof Date) return val
    // Если строка в формате YYYY-MM-DD, преобразуем в Date
    if (typeof val === 'string' && val) return new Date(val)
    return undefined
  },
  z
    .date({
      message: 'Пожалуйста, заполните дату рождения.',
    })
    .refine(date => {
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      const monthDiff = today.getMonth() - date.getMonth()
      const dayDiff = today.getDate() - date.getDate()

      // Если месяц рождения ещё не наступил или наступил, но день рождения ещё не был
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

      return actualAge >= 18
    }, 'Вам должно быть не менее 18 лет.')
    .refine(date => {
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      const monthDiff = today.getMonth() - date.getMonth()
      const dayDiff = today.getDate() - date.getDate()

      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

      return actualAge <= 100
    }, 'Возраст не может быть больше 100 лет.')
)

const isGroupSchema = z.boolean()

const blankFormSchema = (config: { getPhone: () => string; isAnonymous: () => boolean }) =>
  z.object({
    phone: phoneSchema(config.getPhone),
    phoneCountry: z.string(),
    name: nameSchema(config.isAnonymous),
    birth: birthSchema,
    isGroup: isGroupSchema,
  })

export { phoneSchema, nameSchema, birthSchema, isGroupSchema, blankFormSchema }

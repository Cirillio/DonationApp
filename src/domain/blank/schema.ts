import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

const parseBirthDate = (val: string): Date | null => {
  const [day, month, year] = val.split('.').map(Number)
  const date = new Date(year, month - 1, day)

  // Проверка что дата валидна
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/

const phoneSchema = (getPhoneCode: () => string) =>
  z
    .string('Пожалуйста, укажите номер телефона.')
    .nonempty('Телефон обязателен для заполнения.')
    .refine((value) => {
      return isValidPhoneNumber(getPhoneCode() + ' ' + value)
    }, 'Номер указан неверно.')

const nameSchema = z
  .string()
  .refine((value) => value.trim().length === 0 || value.trim().length >= 3, 'Хотя бы 3 символа.')
  .max(50, 'Имя должно быть не длиннее 50 символов.')
  .regex(/^[\p{L}\s-]*$/u, 'Имя может содержать только буквы, пробелы и тире.')
  .optional()

const birthSchema = z
  .string()
  .nonempty('Пожалуйста, заполните дату рождения.')
  .regex(dateRegex, 'Неверный формат даты (дд.мм.гггг)')
  .refine((val) => parseBirthDate(val) !== null, 'Такой даты не существует.')
  .refine((val) => {
    const date = parseBirthDate(val)!
    const eighteenYearsAgo = new Date()
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
    return date <= eighteenYearsAgo
  }, 'Вам должно быть не менее 18 лет.')
  .refine((val) => {
    const date = parseBirthDate(val)!
    const hundredYearsAgo = new Date()
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100)
    return date >= hundredYearsAgo
  }, 'Возраст не может быть больше 100 лет.')

const isGroupSchema = z.boolean().optional()

export { phoneSchema, nameSchema, birthSchema, isGroupSchema }

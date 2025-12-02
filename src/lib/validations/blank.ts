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

const birthSchema = z
  .string('Пожалуйста, укажите дату рождения.')
  // 1. Проверка на пустоту (Maska возвращает "", если пусто)
  .min(1, { message: 'Пожалуйста, заполните дату рождения.' })

  // 2. Проверка формата маски
  .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Введите дату полностью (ДД.ММ.ГГГГ)')

  // 3. Трансформация строки в Date + Валидация существования даты
  .transform((val, ctx) => {
    const [dayStr, monthStr, yearStr] = val.split('.')
    const day = Number(dayStr)
    const month = Number(monthStr)
    const year = Number(yearStr)

    // Месяцы в JS начинаются с 0
    const date = new Date(year, month - 1, day)

    // Проверка на календарную корректность (защита от 31.02.2000)
    const isValidDate =
      date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

    if (!isValidDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Такой даты не существует',
      })
      return z.NEVER
    }

    return date
  })

  // 4. Проверка возраста (>= 18 лет)
  .refine(date => {
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const m = today.getMonth() - date.getMonth()

    // Если день рождения в этом году еще не наступил
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--
    }

    return age >= 18
  }, 'Вам должно быть не менее 18 лет.')

  // 5. Проверка возраста (<= 100 лет)
  .refine(date => {
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const m = today.getMonth() - date.getMonth() // Используем ту же логику для точности
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--
    }
    return age <= 100
  }, 'Возраст не может быть больше 100 лет.')
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

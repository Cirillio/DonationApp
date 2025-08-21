import { z, ZodObject } from 'zod'

export type blankSchema = ZodObject<
  {
    phone: z.ZodString
    name: z.ZodOptional<z.ZodString>
    birth: z.ZodString
    isGroup: z.ZodOptional<z.ZodBoolean>
  },
  z.core.$strip
>

export type BlankSchema = z.output<blankSchema>

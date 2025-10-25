import type { PhoneSpecId } from './phone'

export type BlankFormValues = {
  phone: string | undefined
  phoneCountry: PhoneSpecId
  birth: Date | null
  name: string | undefined
  isGroup: boolean
}
export type BlankFormField = keyof BlankFormValues

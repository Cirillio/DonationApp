import type { PhoneSpecId } from './phone'

export type BlankFormValues = {
  phone: string | undefined
  phoneCountry: PhoneSpecId
  birth: string | undefined
  name: string | undefined
  isGroup: boolean
}

import { DEFAULT_PHONE_SPEC, PHONE_SPECS } from '../constants'
import { PhoneSpecId } from '../types'

export function getPhoneSpec(id: PhoneSpecId) {
  return PHONE_SPECS.find((spec) => spec.id === id) ?? DEFAULT_PHONE_SPEC
}

export function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return phone
  // Remove all non-digit characters (spaces, dashes, parentheses, etc)
  return phone.replace(/\D/g, '')
}

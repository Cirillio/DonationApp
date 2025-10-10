import { DEFAULT_PHONE_SPEC, PHONE_SPECS } from './config'
import { PhoneSpecId } from './types'

export function getPhoneSpec(id: PhoneSpecId) {
  return PHONE_SPECS.find((spec) => spec.id === id) ?? DEFAULT_PHONE_SPEC
}

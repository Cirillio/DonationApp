import type { PhoneSpec, PhoneSpecId } from '../model/types'

export const PHONE_SPECS = [
  { id: 'RU', icon: '🇷🇺', name: 'Россия', code: '+7', mask: '(###) ###-##-##' },
  { id: 'TJ', icon: '🇹🇯', name: 'Таджикистан', code: '+992', mask: '## ### ## ##' },
] as const satisfies readonly PhoneSpec[]

export type PhoneSpecs = typeof PHONE_SPECS

export const DEFAULT_PHONE_SPEC = PHONE_SPECS[0]

export function getPhoneSpec(id: PhoneSpecId) {
  return PHONE_SPECS.find((spec) => spec.id === id) ?? DEFAULT_PHONE_SPEC
}

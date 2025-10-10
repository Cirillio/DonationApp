import { PhoneSpec } from './types'

export const PHONE_SPECS = [
  { id: 'RU', icon: '🇷🇺', name: 'Россия', code: '+7', mask: '(###) ###-##-##' },
  { id: 'TJ', icon: '🇹🇯', name: 'Таджикистан', code: '+992', mask: '## ### ## ##' },
] as const satisfies readonly PhoneSpec[]

export const DEFAULT_PHONE_SPEC = PHONE_SPECS[0]

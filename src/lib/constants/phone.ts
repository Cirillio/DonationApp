import { PhoneSpec } from '../types'

export const PHONE_SPECS = [
  {
    id: 'RU',
    icon: '🇷🇺',
    name: 'Россия',
    code: '+7',
    mask: '(###) ###-##-##',
    maskString: '(999) 123 45-67 ',
  },
  {
    id: 'TJ',
    icon: '🇹🇯',
    name: 'Таджикистан',
    code: '+992',
    mask: '## ### ## ##',
    maskString: '99 123 45 67',
  },
] as const satisfies readonly PhoneSpec[]

export const DEFAULT_PHONE_SPEC = PHONE_SPECS[0]

export type CodeSelectorParams = {
  defaultId: PhoneSpec['id']
  phoneSpecs: readonly PhoneSpec[]
}

export type PhoneSpecId = 'RU' | 'TJ'

export type PhoneSpec = {
  id: PhoneSpecId
  icon: string
  name: string
  code: `+${number}`
  mask: string
}

const placeholders = new Map<boolean, string>()
placeholders.set(true, 'Укажите список участников')
placeholders.set(false, 'Можете указать пожелания')

export { placeholders as const }

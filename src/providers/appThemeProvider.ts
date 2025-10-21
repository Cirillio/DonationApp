import { useAppThemeStore } from '@/stores/theme'

export const appThemeProvider = () => {
  const { mode } = useAppThemeStore()
  return { mode }
}

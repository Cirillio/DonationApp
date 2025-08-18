import { useAppThemeStore } from '@/features/app-theme/model/app-theme-store'

export const appThemeProvider = () => {
  const { mode } = useAppThemeStore()
  return { mode }
}

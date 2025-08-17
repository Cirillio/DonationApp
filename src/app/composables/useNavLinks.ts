import type { NavLink } from '@/domain/app/navigation/types'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useNavLinks(navLinks: NavLink[]) {
  const route = useRoute()

  const activeLink = ref<NavLink>()

  watch(
    () => route.name,
    (newName) => {
      activeLink.value = navLinks.find((link) => link.name === newName)
    }
  )

  const links = computed(() => {
    return navLinks.map((link) => {
      return {
        ...link,
        active: link.name === activeLink.value?.name,
      }
    })
  })

  return {
    links,
    activeLink,
  }
}

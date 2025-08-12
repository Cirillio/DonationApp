import type { NavLink } from '@/domain/app/navigation/types'
import { headerLinks } from '@/app/shared/config/navigation'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useNavLinks() {
  const route = useRoute()

  const activeLink = ref<NavLink>()

  watch(
    () => route.name,
    (newName) => {
      activeLink.value = headerLinks.value.find((link) => link.name === newName)
    }
  )

  const links = computed(() => {
    return headerLinks.value.map((link) => {
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

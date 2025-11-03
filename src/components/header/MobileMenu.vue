<template>
  <div
    v-if="isOpen"
    class="border-t border-border bg-background/25 backdrop-blur-sm py-4 space-y-4 md:hidden"
  >
    <nav class="container mx-auto items-center w-full flex flex-col gap-4 px-4">
      <RouterLink
        v-for="link in mainRoutes"
        :key="link.name"
        :to="link.path"
        @click="handleLinkClick"
        :class="[
          'text-lg font-medium flex items-center justify-center gap-2 transition-colors hover:text-primary bg-card w-full text-center py-2 rounded-md active:text-primary active:bg-primary/20',
          route.path === link.path ? 'text-primary bg-primary/10' : 'text-muted-foreground',
        ]"
      >
        <Icon :class="[link.meta?.icon]" class="size-5" />
        {{ link.meta?.title }}
      </RouterLink>
    </nav>
    <Separator />
    <div class="px-4">
      <HeaderActions variant="mobile" @click="handleLinkClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { Icon } from '@/components/ui/icon'
import { useRoute } from 'vue-router'
import { mainRoutes } from '@/router'
import HeaderActions from './HeaderActions.vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const route = useRoute()

const handleLinkClick = () => {
  emit('close')
}
</script>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useNavLinks } from '../composables/useNavLinks'
const { links, activeLink } = useNavLinks()
const router = useRouter()
</script>

<template>
  <nav
    class="z-10 flex items-center max-md:w-full max-md:bg-card max-md:border-t border-border max-md:shadow-sm"
  >
    <ul
      class="flex max-md:w-full max-md:justify-evenly max-md:py-2 x-pad md:!px-0 gap-2 items-center md:w-fit"
    >
      <li v-for="link in links" :key="link.name" class="w-fit flex items-center max-md:w-full">
        <Button
          @click="router.push(link.url)"
          class="max-md:w-full max-md:py-6"
          :variant="link.name === activeLink?.name ? 'default' : 'text'"
          size="sm"
        >
          <span class="iconify max-md:size-6 size-5" :class="link.icon"></span>
          <span class="max-md:hidden">{{ link.title }}</span>
        </Button>
      </li>
    </ul>
  </nav>
</template>

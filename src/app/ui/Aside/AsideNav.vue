<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useNavLinks } from '../../composables/useNavLinks'
const { links, activeLink } = useNavLinks()
const router = useRouter()
</script>

<template>
  <nav class="z-10 flex w-full items-center">
    <ul class="flex w-full flex-col gap-2">
      <li v-for="link in links" :key="link.name" class="w-full flex">
        <Button
          @click="router.push(link.url)"
          class="w-full gap-2 justify-start"
          :variant="link.name !== activeLink?.name ? 'outline' : 'secondary'"
          size="sm"
        >
          <Icon :class="[link.icon, 'size-5']" />
          <span class="">{{ link.title }}</span>
        </Button>
      </li>
    </ul>
  </nav>
</template>

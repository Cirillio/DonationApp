<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import NavigationButton from './NavigationButton.vue'
import { useMainNavigationStore } from '@/features/main-navigation'

const router = useRouter()
const mainNavigationStore = useMainNavigationStore()
const { links, activeLink } = storeToRefs(mainNavigationStore)
</script>

<template>
  <nav class="z-10 flex lg:w-full items-center">
    <ul class="flex w-full max-lg:items-center max-lg:justify-center flex-col gap-2">
      <li v-for="link in links" :key="link.name" class="w-full flex">
        <NavigationButton :active="link.name === activeLink?.name" @click="router.push(link.url)">
          <template v-slot:leading>
            <Icon :class="[link.icon, 'size-6']" />
          </template>

          <template v-slot:label>
            <span>
              {{ link.title }}
            </span>
          </template>
        </NavigationButton>
      </li>
    </ul>
  </nav>
</template>

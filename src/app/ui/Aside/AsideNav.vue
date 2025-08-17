<script lang="ts" setup>
import { useRouter } from 'vue-router'
import AsideNavButton from './AsideNavButton.vue'
import { navLinks } from '@/app/shared/config/navigation'

import { useNavLinks } from '../../composables/useNavLinks'
const { links, activeLink } = useNavLinks(navLinks)
const router = useRouter()
</script>

<template>
  <nav class="z-10 flex lg:w-full items-center">
    <ul class="flex w-full max-lg:items-center max-lg:justify-center flex-col gap-2">
      <li v-for="link in links" :key="link.name" class="w-full flex">
        <AsideNavButton :active="link.name === activeLink?.name" @click="router.push(link.url)">
          <template v-slot:leading>
            <Icon :class="[link.icon, 'size-5']" />
          </template>

          <template v-slot:label>
            <span>
              {{ link.title }}
            </span>
          </template>
        </AsideNavButton>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import Aside from '../ui/Aside/Aside.vue'
import { useRoute } from 'vue-router'
import { useMainNavigationStore } from '@/features/main-navigation'
import MainNavigationSliderButton from '../ui/MainNavigationSliderButton.vue'

const mainNavigationStore = useMainNavigationStore()
const route = useRoute()
</script>

<template>
  <div
    class="h-dvh min-h-0 duration-150 bg-background w-screen flex md:grid grid-cols-[auto_1fr] overflow-hidden"
  >
    <Aside class="max-md:hidden" />
    <main class="relative flex overflow-hidden overscroll-contain min-h-full w-full min-w-0">
      <MainNavigationSliderButton
        class="absolute z-10 left-1/2 -translate-x-1/2 top-0"
        :icon="'f7--chevron-up'"
        :label="mainNavigationStore.prevLink?.title"
        :visible="mainNavigationStore.canGoPrev"
        :navigate="mainNavigationStore.goPrev"
        direction="up"
      />

      <Transition :name="mainNavigationStore.transitionDirection" mode="out-in">
        <router-view :key="route.path"></router-view>
      </Transition>

      <MainNavigationSliderButton
        class="absolute z-10 left-1/2 -translate-x-1/2 bottom-0"
        :icon="'f7--chevron-down'"
        :label="mainNavigationStore.nextLink?.title"
        :visible="mainNavigationStore.canGoNext"
        :navigate="mainNavigationStore.goNext"
        direction="down"
      />
    </main>
  </div>
</template>

<style>
@import '@/shared/styles/page-slider.css';
</style>

<script lang="ts" setup>
import { PageSliderSlide, pageSliderObj } from '@/domain/app/page-slider/types'
import Aside from '../ui/Aside/Aside.vue'
import { computed, ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainNavigationStore } from '@/features/main-navigation'
import MainNavigationSliderButton from '../ui/MainNavigationSliderButton.vue'

const mainNavigationStore = useMainNavigationStore()

const route = useRoute()
const router = useRouter()

const goNext = () => {
  if (mainNavigationStore.nextLink && mainNavigationStore.canGoNext)
    router.push(mainNavigationStore.nextLink?.url)
}

const goPrev = () => {
  if (mainNavigationStore.prevLink && mainNavigationStore.canGoPrev)
    router.push(mainNavigationStore.prevLink.url)
}

const transitionName: ComputedRef<PageSliderSlide> = computed(() => {
  const direction = route.meta.transitionDirection as string | undefined
  if (direction === pageSliderObj['slide-initial']) return 'slide-initial'
  return direction === pageSliderObj['slide-up'] ? 'slide-up' : 'slide-down'
})
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
        :navigate="goPrev"
        direction="up"
      />
      <Transition :name="transitionName" mode="out-in">
        <router-view :key="route.path"></router-view>
      </Transition>

      <MainNavigationSliderButton
        class="absolute z-10 left-1/2 -translate-x-1/2 bottom-0"
        :icon="'f7--chevron-down'"
        :label="mainNavigationStore.nextLink?.title"
        :visible="mainNavigationStore.canGoNext"
        :navigate="goNext"
        direction="down"
      />
    </main>
  </div>
</template>

<style scoped>
/* ОБЩИЕ СТИЛИ ДЛЯ ПЕРЕХОДОВ */
.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s cubic-bezier(0.3, 0, 0.2, 1), opacity 0.15s ease-in-out;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

/* НОВАЯ СТРАНИЦА ПРИХОДИТ СНИЗУ, ПРОШЛАЯ УХОДИТ ВВЕРХ */
.slide-down-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* НОВАЯ СТРАНИЦА ПРИХОДИТ СВЕРХУ, ПРОШЛАЯ УХОДИТ ВНИЗ */
.slide-up-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* НАЧАЛЬНАЯ ЗАГРУЗКА: ПЛАВНОЕ ПОЯВЛЕНИЕ СПРАВА */
.slide-initial-enter-active {
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease-out;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-initial-leave-active {
  transition: none;
}

.slide-initial-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.slide-initial-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-initial-leave-from,
.slide-initial-leave-to {
  opacity: 0;
}
</style>

<script lang="ts" setup>
import Aside from '../ui/Aside/Aside.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Получаем направление перехода из meta
const transitionName = computed(() => {
  const direction = route.meta.transitionDirection as string | undefined
  return direction === 'up' ? 'slide-up' : 'slide-down'
})

const beforeEnter = () => {
  console.log('transition page before enter, direction:', route.meta.transitionDirection)
}

const afterEnter = () => {
  console.log('transition page after enter')
}
</script>

<template>
  <div
    class="h-dvh min-h-0 duration-150 bg-background w-screen flex md:grid grid-cols-[auto_1fr] overflow-hidden"
  >
    <Aside class="max-md:hidden" />
    <main class="flex flex-col min-h-0 w-full min-w-0 overflow-hidden">
      <div class="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain relative">
        <Transition
          :name="transitionName"
          mode="out-in"
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
        >
          <router-view :key="route.path"></router-view>
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Анимация вниз: новая страница приходит снизу, старая уходит вверх */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

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

/* Анимация вверх: новая страница приходит сверху, старая уходит вниз */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

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
</style>

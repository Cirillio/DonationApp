<script lang="ts" setup>
defineProps<{
  visible: boolean
  label: string | undefined
  icon: string
  direction: 'up' | 'down'
  navigate: () => void
}>()
</script>

<template>
  <Transition name="fade-slide">
    <div v-if="visible" :class="['nav-button-wrapper', direction === 'up' ? 'pt-2' : 'pb-2']">
      <Button
        :key="label"
        @click="navigate"
        variant="outline"
        size="lg"
        :class="['nav-button', direction === 'up' ? 'nav-button-up' : 'nav-button-down']"
      >
        <Icon :class="['size-6', icon]" />
        <div v-if="label">
          {{ label }}
        </div>
      </Button>
    </div>
  </Transition>
</template>

<style scoped>
.nav-button-wrapper {
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button {
  opacity: 0.75;
  color: var(--accent);
  gap: 0.5rem;
  background-color: var(--card);
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  transition: all 0.15s ease-in-out;
}

.nav-button-up {
  transform: translateY(-2rem);
}

.nav-button-down {
  transform: translateY(2rem);
}

.nav-button-wrapper:hover .nav-button-up,
.nav-button-wrapper:hover .nav-button-down {
  transform: translateY(0);
}

.nav-button:hover {
  box-shadow: 0 25px 50px -12px hsl(var(--accent) / 0.5);
  opacity: 1;
  background-color: var(--card);

  color: var(--accent);
}

.nav-button-up:active {
  transform: translateY(-0.25rem);
  opacity: 0.8;
  scale: 0.98;
}

.nav-button-down:active {
  transform: translateY(0.25rem);
  opacity: 0.8;
  scale: 0.98;
}

/* Fade-slide transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: scale(1);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: scale(1);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

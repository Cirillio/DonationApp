<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  valid: {
    type: Boolean,
    required: false,
  },
})
</script>

<template>
  <div class="relative aspect-square grid rounded-full place-items-center overflow-hidden">
    <Transition name="check-swap" mode="out-in">
      <Icon
        :key="valid"
        :variant="valid ? 'secondary' : 'outline'"
        class="md:size-6 size-7"
        :class="[valid ? 'f7--checkmark-alt' : icon]"
      />
    </Transition>
  </div>

  <div class="max-md:text-center">
    <CardTitle class="text-2xl md:text-xl md:w-full">{{ title }}</CardTitle>
    <CardDescription v-if="description" class="md:text-xs">{{ description }}</CardDescription>
  </div>
</template>

<style scoped>
.check-swap-enter-active,
.check-swap-leave-active {
  transition: opacity 75ms ease-in-out, transform 75ms ease-in-out;
  transform-origin: center;
}

/* новый чек плавно появляется */
.check-swap-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.check-swap-enter-to {
  opacity: 1;
  transform: scale(1);
}

/* старый икончик исчезает */
.check-swap-leave-from {
  opacity: 1;
  transform: scale(1);
}
.check-swap-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>

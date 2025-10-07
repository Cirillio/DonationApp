<template>
  <Card class="flex flex-col gap-4 !py-4 flex-1 *:max-md:px-8 shadow-xs">
    <CardHeader
      class="flex gap-2 md:gap-3 max-md:my-4 items-center max-md:flex-col max-md:justify-center"
    >
      <div class="relative aspect-square grid rounded-full place-items-center overflow-hidden">
        <Transition name="check-swap" mode="out-in">
          <Icon
            :key="valid"
            :variant="valid ? 'secondary' : 'outline'"
            class="md:size-8 size-7"
            :class="[valid ? 'f7--checkmark-alt' : icon]"
          />
        </Transition>
      </div>

      <div class="max-md:text-center">
        <CardTitle class="text-2xl md:w-full">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="">{{ description }}</CardDescription>
      </div>
    </CardHeader>

    <Separator />

    <CardContent class="">
      <slot name="content" />
    </CardContent>

    <Separator class="mt-auto" />

    <CardFooter class="text-xs sm:text-base text-pretty">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>

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

<style scoped>
.check-swap-enter-active,
.check-swap-leave-active {
  transition: opacity 100ms ease-in, transform 100ms ease-out;
  transform-origin: center;
}

.check-swap-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.check-swap-enter-to {
  opacity: 1;
  transform: scale(1);
}

.check-swap-leave-from {
  opacity: 1;
  transform: scale(1);
}
.check-swap-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

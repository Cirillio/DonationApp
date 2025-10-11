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
  <div
    :class="['w-fit flex items-center justify-center group', direction === 'up' ? 'pt-2' : 'pb-2']"
  >
    <Button
      v-show="visible"
      :key="label"
      @click="navigate"
      variant="outline"
      size="lg"
      :class="[
        ' opacity-75 text-accent bg-card hover:bg-card hover:text-accent font-semibold hover:shadow-sm hover:opacity-100 left-0 right-0 w-fit cursor-pointer',
        direction === 'up'
          ? '-translate-y-8 group-hover:translate-y-0'
          : 'translate-y-8 group-hover:translate-y-0',
      ]"
    >
      <Icon :class="['size-6', icon]" />
      <div v-if="label">
        {{ label }}
      </div>
    </Button>
  </div>
</template>

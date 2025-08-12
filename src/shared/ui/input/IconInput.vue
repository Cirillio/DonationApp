<script lang="ts" setup>
type InputProps = {
  placeholder?: string
  name: string
  type?: string
  icon?: boolean
}

defineProps<InputProps>()
</script>

<template>
  <div class="flex flex-col !flex-1 !duration-150">
    <div class="relative flex gap-2">
      <Input
        :class="{ 'pl-9 md:pl-10': icon }"
        :type="type"
        :id="name"
        :name="name"
        :placeholder="placeholder"
        v-bind="$attrs"
      />
      <span
        v-if="icon"
        class="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <slot name="icon"></slot>
      </span>

      <slot name="actionButton" />
    </div>
  </div>
</template>

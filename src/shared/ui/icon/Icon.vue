<script lang="ts" setup>
type IconProps = {
  variant?: 'default' | 'fill' | 'outline' | 'ghost' | 'secondary' | 'primary'
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IconProps>(), {
  variant: 'default',
})
</script>

<template>
  <div
    class="w-fit h-fit rounded-full transition-colors duration-150"
    :class="{
      'p-0': props.variant === 'default',
      'p-3 bg-card text-card-foreground': props.variant === 'fill',
      'p-3 border border-border text-muted-foreground': props.variant === 'outline',
      'p-3 bg-primary text-primary-foreground': props.variant === 'primary',
      'p-3 bg-secondary text-secondary-foreground': props.variant === 'secondary',
      'p-3 bg-card/25 text-card-foreground': props.variant === 'ghost',
    }"
  >
    <span v-bind="$attrs" class="iconify flex items-center justify-center" />
  </div>
</template>

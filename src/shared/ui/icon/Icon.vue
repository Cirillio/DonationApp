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
      'p-2 shadow-xs border border-transparent bg-card text-card-foreground':
        props.variant === 'fill',
      'p-2 shadow-xs border border-border text-muted-foreground': props.variant === 'outline',
      'p-2 shadow-xs border border-transparent bg-primary text-primary-foreground':
        props.variant === 'primary',
      'p-2 shadow-xs border border-transparent bg-secondary text-secondary-foreground':
        props.variant === 'secondary',
      'p-2 shadow-xs border border-transparent bg-border/25 text-card-foreground':
        props.variant === 'ghost',
    }"
  >
    <span v-bind="$attrs" class="iconify flex items-center justify-center" />
  </div>
</template>

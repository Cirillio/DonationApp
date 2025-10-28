<script lang="ts" setup>
type IconProps = {
  variant?: 'default' | 'fill' | 'outline' | 'outline-primary' | 'ghost' | 'secondary' | 'primary'
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
    class="w-fit h-fit rounded-full transition-all duration-150"
    :class="{
      'p-0': props.variant === 'default',
      'p-2 shadow-xs border border-transparent bg-card text-card-foreground':
        props.variant === 'fill',
      'p-2 shadow-xs border border-border bg-input/25 text-foreground': props.variant === 'outline',
      'p-2 shadow-xs border border-primary bg-primary/10 text-primary':
        props.variant === 'outline-primary',
      'p-2 shadow-xs border border-transparent bg-primary text-primary-foreground':
        props.variant === 'primary',
      'p-2 shadow-xs border border-transparent bg-secondary text-secondary-foreground':
        props.variant === 'secondary',
      'p-2 shadow-xs border border-transparent bg-muted/50 light:bg-muted/5 text-muted-foreground':
        props.variant === 'ghost',
    }"
  >
    <span v-bind="$attrs" class="iconify flex items-center justify-center" />
  </div>
</template>

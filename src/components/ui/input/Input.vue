<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
  leadingIcon?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <div class="relative w-full z-0">
    <input
      v-bind="$attrs"
      v-model="modelValue"
      id="floating_input"
      :class="
        cn(
          'block py-2.5 px-0 w-full text-base text-fore ground placeholder:opacity-0 bg-transparent border-0 border-b-2 border-primary/50 aria-invalid:border-destructive  transition-all duration-150 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/25 disabled:text-muted-foreground',
          leadingIcon ? 'pl-8' : 'px-2',
          props.class
        )
      "
    />
    <label
      for="floating_input"
      :class="[leadingIcon ? 'pl-8' : 'pl-2']"
      class="absolute text-lg font-medium text-muted-foreground duration-300 transform scale-85 -translate-y-7 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-7 peer-disabled:text-muted-foreground"
    >
      {{ $attrs.placeholder }}
    </label>
    <span
      v-if="leadingIcon"
      :class="`iconify ${leadingIcon} size-6`"
      class="absolute left-1 top-1/2 transform -translate-y-1/2 text-muted-foreground peer-focus:text-primary peer-disabled:opacity-50"
    />
  </div>
</template>

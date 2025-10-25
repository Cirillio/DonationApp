<template>
  <Card class="flex flex-col gap-6 border-0 !py-6 shadow-lg">
    <CardHeader
      class="flex gap-2 md:gap-3 max-md:my-4 items-center max-md:flex-col max-md:justify-center"
    >
      <div class="max-md:text-center">
        <CardTitle class="text-2xl md:w-full">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="">{{ description }}</CardDescription>
      </div>
    </CardHeader>

    <Separator class="bg-foreground/50" />

    <CardContent class="px-6">
      <slot name="content" />
    </CardContent>

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
})
</script>

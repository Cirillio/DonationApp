<template>
  <Card class="flex flex-col gap-5 py-6 flex-1 light:border-none transition-all duration-150">
    <CardHeader class="flex gap-4 items-center max-md:px-6">
      <slot name="header" />
    </CardHeader>
    <CardContent class="max-md:px-6">
      <slot name="content" />
    </CardContent>

    <Separator class="mt-auto" />

    <CardFooter class="max-md:px-6 text-xs sm:text-sm text-pretty">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>

<template>
  <Card
    class="flex flex-col gap-4 !py-4 flex-1 *:max-md:px-8 light:border-none transition-all duration-150"
  >
    <CardHeader
      class="flex gap-2 md:gap-3 max-md:my-4 items-center max-md:flex-col max-md:justify-center"
    >
      <slot name="header" />
    </CardHeader>

    <Separator />

    <CardContent class="">
      <slot name="content" />
    </CardContent>

    <Separator class="mt-auto" />

    <CardFooter class="text-xs sm:text-sm text-pretty">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>

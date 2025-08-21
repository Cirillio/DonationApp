<template>
  <div
    class="flex w-full h-fit justify-center items-center max-[459px]:w-full min-[460px]:max-w-[446px] md:max-w-[760px] lg:max-w-[868px] mx-auto"
  >
    <div class="flex flex-col md:gap-4 px-4">
      <slot name="body" />
    </div>
  </div>
</template>

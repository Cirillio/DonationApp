<script lang="ts" setup>
export type DonationStat = {
  label: string
  img: string
  quantity: number
}

defineProps<DonationStat>()
</script>

<template>
  <Card class="h-fit">
    <CardHeader>
      <CardTitle>
        {{ label }}
      </CardTitle>
    </CardHeader>

    <CardContent>
      <picture class="w-full items-center justify-center flex max-h-80 rounded-md overflow-hidden">
        <img :src="img" :alt="label" class="object-center object-cover w-full h-full" />
      </picture>
    </CardContent>

    <CardFooter>
      <CardDescription>
        {{ quantity }}
      </CardDescription>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => router.back()
</script>

<template>
  <div class="flex w-full h-full border items-center justify-center">
    <Card class="shadow-xl light:border-none">
      <CardHeader class="flex gap-2 items-center text-destructive">
        <Icon class="f7--exclamationmark-circle size-7"></Icon>
        <CardTitle class="font-semibold">ERROR 404</CardTitle>
      </CardHeader>

      <CardContent class="flex flex-col items-center">
        <p class="text-muted-foreground">Страницы по адресу не существует</p>
      </CardContent>

      <CardFooter class="flex items-center">
        <Button size="sm" @click="goBack" variant="destructive">
          <Icon class="f7--arrow-turn-up-left size-5" />
          Вернуться</Button
        >
      </CardFooter>
    </Card>
  </div>
</template>

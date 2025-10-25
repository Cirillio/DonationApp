<script lang="ts" setup>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <Toaster />
  <div class="h-screen flex flex-col overflow-y-auto">
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer class="mt-auto" />
  </div>
</template>

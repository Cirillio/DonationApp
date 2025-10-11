<script lang="ts" setup>
import { TEST_DATA } from '@/domain/statistic/config'
import StatisticCard from '@/features/statistic/StatisticCard.vue'
</script>

<template>
  <div class="w-full min-h-full grid grid-cols-3 gap-4 px-20 py-12">
    <statistic-card
      v-for="stat in TEST_DATA"
      :key="stat.label"
      :label="stat.label"
      :img="stat.img"
      :quantity="stat.quantity"
    />
  </div>
</template>

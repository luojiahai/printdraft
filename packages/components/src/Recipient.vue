<template>
  <div class="pd-recipient">
    <div class="pd-recipient-name">{{ name }}</div>
    <div v-if="company">{{ company }}</div>
    <div v-if="address">{{ address }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  company?: string
  address?: string
}>()
</script>

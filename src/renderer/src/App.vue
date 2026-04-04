<template>
  <NaiveProvider>
    <div class="flex flex-col items-center justify-center mb-80px">
      <Demo />
    </div>
  </NaiveProvider>
</template>

<script setup lang="ts">
import NaiveProvider from './components/NaiveProvider.vue';
import Demo from './Demo.vue';
</script>

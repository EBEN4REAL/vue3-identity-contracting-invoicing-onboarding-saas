<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div class="counter">
    <span>Count is: {{ count }}</span>
    <m-m-button @click="count++">+</m-m-button>
  </div>
</template>

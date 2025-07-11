<script setup lang="ts">
import { ref } from "vue";

const steps = ref([
  { index: 0, title: "Step 1", active: false, completed: true },
  { index: 1, title: "Step 2", active: true, completed: false },
  { index: 2, title: "Step 3", active: false, completed: false },
  { index: 3, title: "Step 4", active: false, completed: false },
]);

const activeStep = ref(1);
</script>

<template>
  <m-m-stepper :active-step="activeStep" :steps="steps" />
</template>

<style scoped lang="scss"></style>

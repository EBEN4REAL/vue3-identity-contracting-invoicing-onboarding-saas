<script setup lang="ts">
import { authService } from "~/auth/auth.service";

authService.logout();
</script>

<template>
  <m-m-progress-circular :size="128" :width="12" class="loader-centered" />
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import MMAuthView from "~/layouts/auth/MMAuthView.vue";
</script>

<template>
  <div class="auth-layout">
    <m-m-auth-view />
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;
  justify-content: center;
}
</style>

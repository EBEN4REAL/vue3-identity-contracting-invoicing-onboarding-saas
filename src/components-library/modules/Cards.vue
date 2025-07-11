<script setup lang="ts"></script>

<template>
  <div class="mm-flex mm-flex-column mm-flex-gap-4">
    <m-m-card>
      <div class="mm-pa-8">Card content</div>
    </m-m-card>

    <m-m-card>
      <template #header> Card With Header </template>

      <div class="mm-pa-8">Card with header content</div>
    </m-m-card>
  </div>
</template>

<style scoped lang="scss"></style>

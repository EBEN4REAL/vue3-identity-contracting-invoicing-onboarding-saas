<template>
  <v-app class="mm-app" data-cy="app">
    <component :is="$route.meta.layout || 'div'"></component>
    <m-m-toast />
  </v-app>
</template>

<style scoped lang="scss">
.mm-app {
  background-color: rgb(255, 255, 255);
  width: 100%;
}
/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-app {
    overflow: hidden;
  }
}
</style>

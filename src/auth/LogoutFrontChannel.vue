<script setup lang="ts">
import config from "~/mm.config.json";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const clientIdQ = route.query.client_id || [];
const clientIdA = clientIdQ instanceof Array ? clientIdQ : [clientIdQ];
const clientIds = clientIdA.map((clientId) => clientId?.toString());
const targetUrl =
  route.query.post_logout_redirect_uri?.toString() || config.app.url;

const redirectToTarget = () => {
  window.location.href = targetUrl;
};

onMounted(() => {
  setInterval(redirectToTarget, 1000);
});
</script>

<template>
  <m-m-progress-circular :size="128" :width="12" class="loader-centered" />
  <iframe
    v-for="clientId in clientIds"
    :key="clientId"
    height="0"
    width="0"
    style="visibility: hidden"
    :src="`${config.idp.url}/oauth2/logout/frontchannel?client_id=${clientId}`"
  />
</template>

<style scoped lang="scss"></style>

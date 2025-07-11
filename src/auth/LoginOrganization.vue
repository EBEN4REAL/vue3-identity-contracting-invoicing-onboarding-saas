<script setup lang="ts">
import { authService } from "~/auth/auth.service";
import { useRoute } from "vue-router";

const route = useRoute();
const organization_id = route.query.organization_id;

if (organization_id) {
  authService.loginToOrganization(organization_id.toString());
} else {
  authService.login();
}
</script>

<template>
  <m-m-progress-circular :size="128" :width="12" class="loader-centered" />
</template>

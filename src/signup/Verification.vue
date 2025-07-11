<script setup lang="ts">
import { ref, Ref } from "vue";
import { useRoute } from "vue-router";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { ERRORS_SIGNUP } from "~/auth/constants";

const route = useRoute();
const status = route.query.status;
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);
const errorDescription = route.query.error
  ? ERRORS_SIGNUP[route.query.error.toString() as keyof typeof ERRORS_SIGNUP]
  : "Something went wrong. Please try again.";

if (status !== "ERROR") {
  window.location.href = "/signup";
}

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <m-m-alert
    v-if="isAlertVisible"
    :status="AlertTypes.Error"
    cy="signup-form-alert"
    class="mm-mb-12"
    @close="onAlertClose"
  >
    {{ errorDescription }}
  </m-m-alert>
  <div class="mm-auth-view-content-title">Signup verification</div>
</template>

<style scoped></style>

<script setup lang="ts">
import { authService } from "~/auth/auth.service";
import { onMounted } from "vue";

const NO_MATCHING_STATE_ERROR: string = "No matching state found in storage";

onMounted(async () => {
  authService
    .handleLoginRedirect()
    .then((user) => {
      if (user.url_state) {
        window.location.href = user.url_state;
      } else {
        authService.isUserOrgViewer().then((isOrgViewer: boolean) => {
          if (isOrgViewer) {
            window.location.href = "/sc/getting-started";
          } else {
            window.location.href = "/user/profile";
          }
        });
      }
    })
    .catch((err: Error) => {
      console.error(err);
      if (err.message === NO_MATCHING_STATE_ERROR) {
        authService.login();
      } else {
        const error = new URLSearchParams(window.location.search).get("error");
        if (error === "SignupRequired" || error === "external_access_denied") {
          window.location.href = `/signup?error=${error}`;
        } else {
          window.location.href = "/error-page";
        }
      }
    });
});
</script>

<template>
  <m-m-progress-circular :size="128" :width="12" class="loader-centered" />
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { SVG_DIMENSIONS } from "~/mm_ui_kit/src/helpers/utils";
import MMSquareSVG from "~/assets/images/mm-square.svg";
import { OAuthManager } from "~/common/services/oauth.client.service";
import { useRoute } from "vue-router";
import { authService } from "~/auth/auth.service";
import { AuthStorageKeys } from "~/auth/auth.types";
import { getSpBranding } from "~/auth/cookies";

const route = useRoute();
const nextUrl = route.query.next_url?.toString();
const svgWidth: Ref<string> = ref(SVG_DIMENSIONS.WIDTH);
const svgHeight: Ref<string> = ref(SVG_DIMENSIONS.HEIGHT);
const isError: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(true);
const spUrl: Ref<string> = ref("");
const spName: Ref<string> = ref("this application");
const messages: Ref<string[]> = ref([]);

const logout = () => {
  if (nextUrl) {
    authService.logoutWithNextUrl(nextUrl);
  } else {
    authService.logout();
  }
};

const loadServiceProvider = async () => {
  try {
    const sp = getSpBranding();
    if (sp) {
      messages.value = sp?.return_values ?? [];
      spName.value = sp?.name ?? spName.value;
    }
    const oAuthManager = new OAuthManager(
      route.query.code?.toString() || "",
      nextUrl || "",
      AuthStorageKeys.ACCESS_DENIED,
    );
    await oAuthManager.init();
    spUrl.value = oAuthManager.getServiceProviderUrl() || spUrl.value;
  } catch (error) {
    console.error(error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadServiceProvider();
});
</script>

<template>
  <m-m-progress-circular
    v-if="isLoading"
    :size="128"
    :width="12"
    class="loader-centered"
  />
  <template v-else>
    <m-m-button
      variant="outlined"
      min-width="160px"
      class="button-logout"
      @click="logout"
    >
      Logout
    </m-m-button>
    <PageNotFound
      error-type="No Access"
      :message="`You don't have the correct permissions to login to ${spName}`"
      :messages="messages"
      :back-to-link="spUrl"
      :back-to-label="spName"
      :show-back-button="!isError"
    />
    <component
      :is="MMSquareSVG"
      :width="svgWidth"
      :height="svgHeight"
      data-cy="left-square-element"
      class="mm-auth-view-left-square-element"
    />
    <component
      :is="MMSquareSVG"
      :width="svgWidth"
      :height="svgHeight"
      data-cy="right-square-element"
      class="mm-auth-view-right-square-element"
    />
  </template>
</template>

<style scoped lang="scss">
.button-logout {
  position: absolute;
  right: 20px;
  top: 40px;
  z-index: 101;
}
</style>

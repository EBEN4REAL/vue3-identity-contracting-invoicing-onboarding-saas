<script setup lang="ts">
import { computed, ref, Ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import SmallLogoSVG from "~/assets/images/small_veriam_logo.svg";
import MMSquareSVG from "~/assets/images/mm-square.svg";
import { handleResize, SVG_DIMENSIONS } from "~/mm_ui_kit/src/helpers/utils";
import config from "~/mm.config.json";
import { jwtDecode } from "jwt-decode";
import { useFlag } from "@unleash/proxy-client-vue";
import { Auth } from "~/auth/auth.types";
import CredentialResponse = google.accounts.id.CredentialResponse;
import { getUserEmail } from "~/auth/cookies";

const route = useRoute();
const stage = route.query.stage?.toString() || Auth.Email;
const nextUrl = encodeURIComponent(route.query.next_url?.toString() || "");
const backTo = `/login?stage=${Auth.Email}&next_url=${nextUrl}`;
const forgotPasswordUrl = `/forgotten-password?next_url=${nextUrl}`;
const svgWidth: Ref<string> = ref(SVG_DIMENSIONS.WIDTH);
const svgHeight: Ref<string> = ref(SVG_DIMENSIONS.HEIGHT);
const isGoogleOneTapEnabled = useFlag("google_one_tap");

const handleCredentialResponse = (response: CredentialResponse) => {
  const googleUserId = jwtDecode(response.credential).sub;
  window.location.href = `${config.idp.url}/login-google?next_url=${nextUrl}&login_hint=${googleUserId}`;
};

if (isGoogleOneTapEnabled.value) {
  try {
    google.accounts.id.initialize({
      client_id: config.idp.google.clientId,
      callback: handleCredentialResponse,
      use_fedcm_for_prompt: true,
    });
  } catch (error) {
    console.error(error);
  }
}

const authViewContentClassList = computed(() => [
  "mm-auth-view-content",
  {
    "mm-auth-view-content--2fa mm-auth-view-content--auto-width":
      route.meta.layoutContentAutoWidth,
  },
]);

// Watch for window resize and update dimensions
watchEffect((onInvalidate) => {
  window.addEventListener("resize", () => handleResize(svgWidth, svgHeight));
  onInvalidate(() => {
    window.removeEventListener("resize", () =>
      handleResize(svgWidth, svgHeight),
    );
  });
});

const displayBackTo = ref(
  getUserEmail() ||
    (stage !== Auth.Email && stage !== Auth.MFA) ||
    forgotPasswordUrl,
);
</script>

<template>
  <div class="mm-auth-view" data-cy="auth-view">
    <m-m-teleport to="onboarding-back">
      <m-m-link
        v-if="displayBackTo"
        prepend-icon="arrow-small-left"
        :href="backTo"
        class="mm-auth-view-back-link"
        data-cy="back-to"
      >
        <m-m-icon icon="arrow-small-left" class="mm-mr-4" />
      </m-m-link>
    </m-m-teleport>
    <div :class="authViewContentClassList">
      <router-view />
    </div>
    <div class="mm-mt-auto mm-mb-16 mm-auth-view-footer mm-pt-10">
      <span class="mm-page-option mm-pt-6">Powered by</span>
      <component :is="SmallLogoSVG" />
    </div>
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
  </div>
</template>

<style lang="scss">
.mm-auth-view {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(7, 46, 81, 0.1);

  &-footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  &-logo {
    max-width: 190px;
    max-height: 55px;
  }

  &-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 360px;
    margin-top: auto;
    z-index: 101;

    &--auto-width {
      width: auto;
    }

    &-alert {
      position: absolute;
      top: -24px;
      right: 0;
      left: 0;
      transform: translateY(-100%);
    }

    &--2fa {
      display: flex;
      align-self: center;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 58px;
      box-shadow: 0px 15px 35px 0px #3c425714;
      background-color: #ffffff;
      max-width: 695px;
      gap: 30px;
      margin-top: 70px;
      border-radius: 12px;
    }
  }

  .mm-auth-view-content-title {
    color: #101828;
    font-size: 30px;
    line-height: 38px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .mm-auth-view-content-subtitle {
    color: #475467;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin-bottom: 20px;
  }

  .mm-auth-view-separator {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: rgba(71, 84, 103, 1);
    font-size: 14px;
    line-height: 20px;
    margin: 24px 0;
    text-align: center;
    font-weight: 500;
  }

  .mm-auth-white-box-for-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background-color: #fff;
    border: 1px solid #eaecf0;
    border-radius: 12px;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
  }

  .mm-auth-view-link-signup {
    color: #475467;
    align-self: center;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;

    &-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      text-align: left;
    }

    &.underline {
      text-decoration: underline;
    }
  }

  &-left-square-element {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 100;
  }

  &-right-square-element {
    position: absolute;
    right: 0;
    top: 0;
    transform: rotate(0.5turn);
    z-index: 100;
  }

  &-back-link {
    position: fixed;
    top: 32px;
    left: 32px;
  }
}

/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-auth-view {
    background-color: transparent;

    &-content {
      width: 100vw;

      &--2fa {
        padding: 0;
        border-radius: 0;
        background: none;
        box-shadow: none;
        margin-top: 20px;
      }
    }

    &-right-square-element {
      top: -10px;
    }

    &-left-square-element {
      bottom: -10px;
    }

    &-back-link {
      left: 10px;
    }
  }
}
</style>

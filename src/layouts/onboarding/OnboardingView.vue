<script setup lang="ts">
import { authService } from "~/auth/auth.service";
import { useRoute } from "vue-router";
import MMSquareSVG from "~/assets/images/mm-square.svg";
import SmallLogoSVG from "~/assets/images/small_veriam_logo.svg";
import { Ref, ref, watchEffect } from "vue";
import { SVG_DIMENSIONS, handleResize } from "~/mm_ui_kit/src/helpers/utils";

const route = useRoute();
const nextUrl: string | undefined = route.query.next_url?.toString();
const svgWidth: Ref<string> = ref(SVG_DIMENSIONS.WIDTH);
const svgHeight: Ref<string> = ref(SVG_DIMENSIONS.HEIGHT);

const logout = () => {
  if (nextUrl) {
    authService.logoutWithNextUrl(nextUrl);
  } else {
    authService.logout();
  }
};

// Watch for window resize and update dimensions
watchEffect((onInvalidate) => {
  window.addEventListener("resize", () => handleResize(svgWidth, svgHeight));
  onInvalidate(() => {
    window.removeEventListener("resize", () =>
      handleResize(svgWidth, svgHeight),
    );
  });
});
</script>

<template>
  <div class="onboarding-view">
    <div>
      <div
        class="onboarding-view-back mm-mt-16 mm-mr-auto"
        data-teleport="onboarding-previous-button"
      />
    </div>
    <m-m-button
      class="onboarding-view-logout-button"
      variant="text"
      @click="logout"
      >Logout
    </m-m-button>
    <div class="onboarding-view-content mm-mx-auto">
      <div
        class="onboarding-view-title mm-mb-8"
        data-teleport="onboarding-title"
      />
      <div
        class="onboarding-view-subtitle"
        data-teleport="onboarding-subtitle"
      />
      <div class="onboarding-view-body mm-mb-auto">
        <router-view />
      </div>
      <div class="onboarding-view-footer" data-teleport="onboarding-footer">
        <div
          class="onboarding-view-footer-next mm-ml-auto"
          data-teleport="onboarding-footer-next"
        />
      </div>
    </div>
    <div class="mm-mb-16 mm-auth-view-footer">
      <span class="mm-page-option mm-pt-6">Powered by</span>
      <component :is="SmallLogoSVG" />
    </div>
    <component
      :is="MMSquareSVG"
      :width="svgWidth"
      :height="svgHeight"
      class="mm-auth-view-left-square-element"
    />
    <component
      :is="MMSquareSVG"
      :width="svgWidth"
      :height="svgHeight"
      class="mm-auth-view-right-square-element"
    />
  </div>
</template>

<style scoped lang="scss">
.onboarding-view {
  flex: 1;
  padding: 94px 80px 0;
  background-color: rgba(#072e51, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  &-content {
    text-align: center;
    width: 495px;
    border-radius: 12px;
    padding: 32px 68px;
    background: white;
    box-shadow: 0px 5px 15px 0px #0000001f;
    margin-bottom: 30px;
  }

  &-back {
    position: absolute;
    left: 25px;
    margin-top: 32px;
    top: 0;
  }

  &-title {
    color: #101828;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px;
  }

  &-subtitle {
    color: #475467;
    font-size: 16px;
    font-style: normal;
    line-height: 24px;
  }

  &-body {
    margin-top: 20px;
    text-align: center;
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;

    &-next {
      width: 100%;
    }
  }

  &-logout-button {
    position: absolute;
    right: 20px;
    top: 40px;
    background-color: white;
    border: 1px solid #e6e8ec;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 16px;
    width: 130px;
    height: 44px;
    z-index: 101;

    &:hover,
    &:focus,
    &:active {
      background-color: #e7eaed;
      border-color: #e7eaed;
      outline: none;
      box-shadow: 0px 5px 15px 0px #0000001f;
    }
  }
}
/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .onboarding-view {
    background: transparent;
    padding: 0;
    &-content {
      padding: 0;
      background: transparent;
      width: calc(100vw - 30px);
      box-shadow: none;
      position: relative;
      margin-top: 75px;
      left: auto;
      top: auto;
      transform: none;
      text-align: left;
      height: 100vh;
    }
    &-footer-next {
      width: 100%;
      margin-top: 40px;
    }
    &-logout-button {
      max-width: 90px;
      top: 20px;
    }
    &-back {
      left: 0;
      margin-top: 15px;
    }
  }
}
</style>

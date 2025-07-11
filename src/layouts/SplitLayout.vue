<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, Ref } from "vue";
import { SVG_DIMENSIONS } from "~/mm_ui_kit/src/helpers/utils";
import MMSquareSVG from "~/assets/images/mm-square.svg";
import SmallLogoSVG from "~/assets/images/small_veriam_logo.svg";

const svgWidth: Ref<string> = ref(SVG_DIMENSIONS.WIDTH);
const svgHeight: Ref<string> = ref(SVG_DIMENSIONS.HEIGHT);

const router = useRouter();
const route = useRoute();
const code = route.query.code?.toString() || "";
const nextUrl = route.query.next_url?.toString() || "";

const goBack = () => {
  if (route.query.isPlanPage === "true") {
    router.push({
      path: "/sp-plan-page",
      query: {
        code,
        next_url: encodeURIComponent(nextUrl),
      },
    });
  } else if (route.meta.previousRoute) {
    router.push(route.meta.previousRoute);
  } else {
    router.push("/");
  }
};
</script>

<template>
  <main class="split-page-layout">
    <div class="split-page-layout--side">
      <m-m-link
        class="back-to-link mm-mb-12"
        data-cy="back-link"
        @click.prevent="goBack"
      >
        <m-m-icon icon="arrow-left" width="24px" class="mm-mr-1" />
      </m-m-link>
      <div
        class="split-page-layout--side--content"
        data-teleport="split-page-layout-side-content"
      />

      <div class="split-page-layout--side--footer">
        <div class="logo-holder">
          <span>Powered by</span>
          <component :is="SmallLogoSVG" />
        </div>
        <div
          class="split-page-layout--side--footer--text"
          data-teleport="split-page-layout-side-footer-text"
        />
      </div>
    </div>
    <div class="split-page-layout--main">
      <router-view />
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
  </main>
</template>

<style scoped lang="scss">
.split-page-layout {
  background-color: rgba(7, 46, 81, 0.1);
  min-height: 100%;
  display: flex;
  align-items: stretch;

  &--side {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-basis: 680px;
    padding: 32px 64px;
    background: #fff;
    z-index: 101;

    &--content {
      padding-top: 48px;
      width: 100%;
    }

    &--footer {
      text-align: center;
      margin-top: auto;
      width: 100%;
      font-size: 14px;

      &--text {
        color: #9ea5af;
        font-size: 12px;
        margin-top: 8px;
      }
    }
  }

  &--main {
    flex-grow: 1;
    padding: 24px;
  }

  @media screen and (max-width: 1024px) {
    &--side {
      flex-basis: 50%;
      padding: 32px;

      &--content {
        padding-top: 24px;
      }
    }
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding-bottom: 100px;

    &--side--footer {
      position: absolute;
      bottom: 15px;
      left: 0;
    }
  }
}
</style>

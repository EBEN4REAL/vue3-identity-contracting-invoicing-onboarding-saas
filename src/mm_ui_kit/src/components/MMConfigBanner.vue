<script setup lang="ts">
import { useFlag } from "@unleash/proxy-client-vue";
import { onMounted, onUnmounted, Ref, ref } from "vue";
import BannerLogo from "~/mm_ui_kit/src/assets/images/banner-logo.svg";

// feature flags
const configBannerEnabled = useFlag("product_banners");

const contactUsRedirect = () => {
  window.open("https://getveriam.com/contact", "_blank");
};
const scheduleCallRedirect = () => {
  window.open("https://getveriam.com/meet/support-call", "_blank");
};
const isMobile: Ref<boolean> = ref(window.innerWidth < 550);

const handleResize = () => {
  isMobile.value = window.innerWidth < 550;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div v-if="configBannerEnabled" class="banner-container">
    <div v-if="!isMobile" class="banner-container-need-help">
      <BannerLogo data-cy="config-banner-logo" width="116px" height="116px" />
      <div class="banner-container-need-help-text-group">
        <span class="banner-container-need-help-heading"
          >Need help setting up?</span
        >
        <div class="banner-container-need-help-subheading-group">
          <span class="banner-container-need-help-subheading">
            An improved process to configure your apps is coming very soon.
          </span>
          <span class="banner-container-need-help-subheading">
            In the meantime, please get in touch with our team for questions and
            additional help.
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile view -->
    <div v-else class="banner-container-need-help">
      <div class="logo-header-group">
        <BannerLogo
          data-cy="config-banner-logo"
          class="banner-logo"
          width="80px"
          height="80px"
        />
        <span class="banner-container-need-help-heading"
          >Need help setting up?</span
        >
      </div>
      <div class="banner-container-need-help-subheading-group">
        <span class="banner-container-need-help-subheading">
          An improved process to configure your apps is coming very soon. In the
          meantime, please get in touch with our team for questions and
          additional help.
        </span>
      </div>
    </div>

    <div class="banner-container-need-help-button-group">
      <m-m-button
        variant="outlined"
        size="small"
        min-width="130px"
        @click="contactUsRedirect"
      >
        Contact Us
      </m-m-button>
      <m-m-button variant="outlined" size="small" @click="scheduleCallRedirect">
        Schedule a Call
      </m-m-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
$text-color: #384250;
$border-color: #e6e8ec;
$bg-color: #f6f8f9;

%flex {
  display: flex;
  align-items: center;
}

%flex-column {
  @extend %flex;
  flex-direction: column;
}

.banner-container {
  @extend %flex;
  justify-content: space-between;
  margin-top: 32px;
  border-radius: 16px;
  border: 1px solid $border-color;
  padding: 6px;
  background-color: $bg-color;

  &-need-help {
    @extend %flex;
    gap: 24px;
    justify-content: center;

    &-text-group {
      @extend %flex-column;
      align-items: flex-start;
      gap: 10px;
    }

    &-heading {
      color: $text-color;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }

    &-subheading {
      color: $text-color;
      font-size: 13px;
      font-weight: 400;
      line-height: 24px;
      &-group {
        @extend %flex-column;
        align-items: flex-start;
      }
    }

    &-button-group {
      @extend %flex-column;
      justify-content: center;
      gap: 7px;
    }
  }

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    gap: 10px;

    &-need-help {
      flex-direction: column;
      gap: 0px;

      &-text-group,
      &-subheading-group {
        align-items: center;
      }

      &-heading {
        text-align: center;
      }

      &-button-group {
        flex-direction: row;
      }
    }
  }
}
.logo-header-group {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 4%;
}
</style>

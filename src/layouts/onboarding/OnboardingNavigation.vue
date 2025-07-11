<script setup lang="ts">
// import config from "~/mm.config.json";
import { onboardingService } from "~/onboarding/onboarding.service";
import LogoSVG from "../../assets/images/veriam-logo.svg";
</script>

<template>
  <div class="onboarding-navigation">
    <div class="onboarding-navigation-header">
      <LogoSVG class="onboarding-navigation-logo" />
    </div>
    <m-m-stepper
      :active-step="onboardingService.state.stageActive?.index"
      :steps="onboardingService.getFlowStages"
    />
    <!-- <div class="onboarding-navigation-footer">
      Powered by <span class="font-weight-700">{{ config.app.name }}</span>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.onboarding-navigation {
  padding: 48px 72px 13px;

  &-header {
    display: flex;
    align-items: center;
    max-width: 150px;
    margin-bottom: 128px;
    margin-left: 20px;
  }

  &-logo {
    width: 100%;
    display: block;
  }

  &-footer {
    margin-top: auto;
    font-size: 14px;
    text-align: center;
  }
}
</style>

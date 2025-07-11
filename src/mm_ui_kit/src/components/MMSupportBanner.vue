<script setup lang="ts">
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const props = defineProps({
  ownOrg: {
    type: String,
    required: true,
  },
});

const loginToOwnOrg = async () => {
  try {
    await authService.loginToOrganization(props.ownOrg);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error logging in to your organization",
      status: "error",
    });
  }
};
</script>

<template>
  <div class="mm-support-banner" data-cy="support-banner">
    <m-m-badge :status="BadgeTypes['Warning']" text="Support" />
    <p>
      <span class="mm-support-banner--full-text">
        You are currently logged in for an organization you are not affiliated
        with, solely for providing support.
      </span>
      To return to your own organization,
      <m-m-link color="warning" underline @click.prevent="loginToOwnOrg"
        >click here</m-m-link
      >
    </p>
  </div>
</template>

<style lang="scss" scoped>
.mm-support-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
  background-color: #fffcf5;
  color: #b54708;
  border-bottom: 1px solid #fec84b;
  line-height: 12px;
  font-size: 14px;

  @media (max-width: $breakpoint-sm) {
    &--full-text {
      display: none;
    }
  }
}
</style>

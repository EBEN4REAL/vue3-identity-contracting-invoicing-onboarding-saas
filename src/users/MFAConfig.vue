<script setup lang="ts">
import { computed, ComputedRef, PropType } from "vue";
import { usersService } from "~/users/users.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { UserRead } from "~/iam/iam.types";

const props = defineProps({
  user: {
    type: Object as PropType<UserRead | null>,
    default: null,
  },
});

const mfaConfigTooltipText: ComputedRef<string> = computed(
  () => "Require MFA to be used on all logins with your account",
);

const isMFARequired: ComputedRef<boolean> = computed(
  () => props.user?.mfa_required ?? false,
);

const showToast = (message: string, status: "info" | "error" | "success") => {
  eventBus.$emit("onShowToast", {
    text: message,
    status: status,
  });
};

const handleToggle = async (isMFARequired: boolean) => {
  try {
    const payload = { mfa_required: isMFARequired };
    await usersService.updateMFARequiredSetting(payload);
    const toastMessage = isMFARequired
      ? "MFA is now required on all logins"
      : "MFA is now optional on all logins";

    showToast(toastMessage, "success");
  } catch (error) {
    const errorMessage = "An unexpected error occurred.";
    showToast(errorMessage, "error");
  }
};
</script>

<template>
  <div class="mm-flex mm-flex-justify-between mm-flex-align-center mm-mb-10">
    <div class="mm-flex mm-flex-gap-5 mm-flex-align-center">
      <m-m-icon icon="finger-print" width="22.5px" height="22.5px" />
      <span>Require MFA on all logins</span>
      <div>
        <m-m-icon icon="info" width="18px" height="18px" />
        <m-m-tooltip display-position="toRight">
          {{ mfaConfigTooltipText }}
        </m-m-tooltip>
      </div>
    </div>
    <div>
      <m-m-toggle-button
        v-model="isMFARequired"
        cy="mm-toggle-button-email-otp"
        @toggled="handleToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, PropType } from "vue";
import { usersService } from "~/users/users.service";
import { UserRead } from "~/iam/iam.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const props = defineProps({
  hasPassword: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object as PropType<UserRead | null>,
    default: null,
  },
});

const emit = defineEmits(["get-user-mfa"]);

const emailOTPTooltipText: ComputedRef<string> = computed(
  () => "Use your email address to receive a 6 digit security code",
);

const isEmailOTPToggled: ComputedRef<boolean> = computed(
  () => props.user?.email_otp_enabled ?? false,
);

const showToast = (message: string, status: "info" | "error") => {
  eventBus.$emit("onShowToast", {
    text: message,
    status: status,
  });
};

const handleToggle = async (emailOTPToggled: boolean) => {
  try {
    const payload = { enabled: emailOTPToggled };
    await usersService.updateEmailOTPSetting(payload);
    const toastMessage = emailOTPToggled
      ? "Email OTP enabled Successfully"
      : "Email OTP disabled Successfully";

    showToast(toastMessage, "info");
  } catch (error) {
    const errorMessage = "An unexpected error occurred.";
    showToast(errorMessage, "error");
  } finally {
    emit("get-user-mfa");
  }
};
</script>

<template>
  <div
    class="mm-flex mm-flex-justify-between mm-flex-align-center mm-mb-10"
    data-cy="email-otp-setting"
  >
    <div class="mm-flex mm-flex-gap-5 mm-flex-align-center">
      <m-m-icon icon="email-top" width="22.5px" height="22.5px" />
      <span>Email OTP</span>
      <div>
        <m-m-icon icon="info" width="18px" height="18px" />
        <m-m-tooltip display-position="toRight">
          {{ emailOTPTooltipText }}
        </m-m-tooltip>
      </div>
    </div>
    <div>
      <m-m-toggle-button
        v-model="isEmailOTPToggled"
        cy="mm-toggle-button-email-otp"
        @toggled="handleToggle"
      />
    </div>
  </div>
</template>

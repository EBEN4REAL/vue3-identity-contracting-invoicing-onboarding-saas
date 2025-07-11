<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import { usersService } from "~/users/users.service";
import DialogSetupTwoFactorAuthentication from "./Dialogs/DialogSetupTwoFactorAuthentication.vue";
import DialogBackupCodes from "./Dialogs/DialogBackupCodes.vue";
import DialogConfirmResetAuthentication from "./Dialogs/DialogConfirmResetAuthentication.vue";
import {
  TOTPConfirmationRead,
  TOTPRead,
  TOTPVerificationRead,
} from "~/iam/iam.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

defineProps({
  hasPassword: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["get-user-mfa"]);

const qrUrl: Ref<string> = ref("");
const backupCodes: Ref<string[]> = ref([]);
const is2FAReady: Ref<boolean> = ref(false);
const is2FAConfirmed: Ref<boolean> = ref(false);
const isDialogVerificationRequiredOpen: Ref<boolean> = ref(false);
const isDialogSetupTwoFactorAuthenticationOpen: Ref<boolean> = ref(false);
const isDialogBackupCodesOpen: Ref<boolean> = ref(false);
const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isDialogConfirmResetAuthenticationOpen: Ref<boolean> = ref(false);

const TOTPTooltipText: ComputedRef<string> = computed(
  () => "Use an authenticator app to generate a 6 digit security code.",
);

const isButtonSetupTOTPDisabled: ComputedRef<boolean> = computed(
  () => isButtonSubmitDisabled.value || isButtonSubmitLoading.value,
);

const getMeUserTOTP = async () => {
  try {
    const totp: TOTPRead = await usersService.getUserMeTOTP();
    is2FAConfirmed.value = totp.confirmed;
  } catch (err) {
    if (err.response.status === 404) {
      is2FAConfirmed.value = false;
    }
  } finally {
    is2FAReady.value = true;
  }
};

const closeDialogVerificationRequired = () => {
  isDialogVerificationRequiredOpen.value = false;
};

const openDialogSetupTwoFactorAuthentication = () => {
  isDialogSetupTwoFactorAuthenticationOpen.value = true;
};

const closeDialogSetupTwoFactorAuthentication = () => {
  isDialogSetupTwoFactorAuthenticationOpen.value = false;
};

const openDialogBackupCodes = () => {
  isDialogBackupCodesOpen.value = true;
  emit("get-user-mfa");
};

const closeDialogBackupCodes = () => {
  isDialogBackupCodesOpen.value = false;
};

const openDialogConfirmResetAuthentication = () => {
  isDialogConfirmResetAuthenticationOpen.value = true;
};

const closeDialogConfirmResetAuthentication = () => {
  isDialogConfirmResetAuthenticationOpen.value = false;
  emit("get-user-mfa");
};

const submitVerificationRequired = (qr_url: string) => {
  closeDialogVerificationRequired();
  qrUrl.value = qr_url;
  openDialogSetupTwoFactorAuthentication();
};

const submitSetupTwoFactorAuthentication = (
  userMeUpdatedTOTP: TOTPVerificationRead,
) => {
  closeDialogSetupTwoFactorAuthentication();
  is2FAConfirmed.value = userMeUpdatedTOTP.confirmed;
  backupCodes.value = userMeUpdatedTOTP.backup_codes;
  openDialogBackupCodes();
};

const submitConfirmResetAuthentication = () => {
  is2FAConfirmed.value = false;
};

const onSubmit = async () => {
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;

    const userMeGeneratedTOTP: TOTPConfirmationRead =
      await usersService.postUserMeTOTP();

    submitVerificationRequired(userMeGeneratedTOTP.qr_url);
  } catch (error) {
    let text = "Failed to setup TOTP";

    if (error.response?.status === 409)
      text = "Your TOTP is already confirmed!";

    eventBus.$emit("onShowToast", {
      text,
      status: "error",
    });
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};

const onResetAuthentication = () => {
  openDialogConfirmResetAuthentication();
};

onMounted(async () => {
  await getMeUserTOTP();
});
</script>

<template>
  <div
    class="mm-flex mm-flex-justify-between mm-flex-align-center mm-mb-10"
    data-cy="email-otp-setting"
  >
    <div class="mm-flex mm-flex-gap-5 mm-flex-align-center">
      <m-m-icon icon="totp" class="mm-mt-2" />
      <span>TOTP</span>
      <div>
        <m-m-icon icon="info" width="18px" height="18px" />
        <m-m-tooltip display-position="toRight">
          {{ TOTPTooltipText }}
        </m-m-tooltip>
      </div>
    </div>
    <div>
      <m-m-button
        v-if="!is2FAConfirmed"
        :loading="isButtonSubmitLoading"
        :is-disabled="isButtonSetupTOTPDisabled"
        variant="outlined"
        prepend-icon="shield-check-outline"
        cy="button-setup-authentication"
        @click="onSubmit"
      >
        Setup TOTP
      </m-m-button>
      <m-m-button
        v-if="is2FAConfirmed"
        variant="text-danger"
        prepend-icon="trash"
        cy="button-reset-authentication"
        @click="onResetAuthentication"
      >
        Reset authentication
      </m-m-button>
    </div>
  </div>

  <dialog-setup-two-factor-authentication
    :is-open="isDialogSetupTwoFactorAuthenticationOpen"
    :qr-url="qrUrl"
    cy="dialog-setup-two-factor-authentication"
    @submit="submitSetupTwoFactorAuthentication"
    @close="closeDialogSetupTwoFactorAuthentication"
  />

  <dialog-backup-codes
    :is-open="isDialogBackupCodesOpen"
    :backup-codes="backupCodes"
    cy="dialog-backup-codes"
    @close="closeDialogBackupCodes"
  />

  <dialog-confirm-reset-authentication
    :is-open="isDialogConfirmResetAuthenticationOpen"
    cy="dialog-confirm-reset-authentication"
    @submit="submitConfirmResetAuthentication"
    @close="closeDialogConfirmResetAuthentication"
  />
</template>

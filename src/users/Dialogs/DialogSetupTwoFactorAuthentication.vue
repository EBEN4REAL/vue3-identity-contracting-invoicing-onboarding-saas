<script setup lang="ts">
import { ref, Ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { TOTPVerificationRead } from "~/iam/iam.types";
import { usersService } from "~/users/users.service";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  qrUrl: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);

const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const twoFactorAuthenticationRef: Ref<{ code: string }> = ref({
  code: "",
});

const onSubmit = async () => {
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;

    const userMeUpdatedTOTP: TOTPVerificationRead =
      await usersService.updateUserMeTOTP({
        code: twoFactorAuthenticationRef.value.code,
      });

    emit("submit", userMeUpdatedTOTP);
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to update TOTP setting",
      status: "error",
    });
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="shield-check-outline"
    title="Setup Two-Factor Authentication"
    size="medium"
    @close="emit('close')"
  >
    <m-m-two-factor-authentication
      ref="twoFactorAuthenticationRef"
      :qr-url="qrUrl"
      input-code-width="290px"
      @submit="onSubmit"
    />

    <template #footer>
      <div class="mm-flex mm-flex-justify-end mm-flex-gap-6">
        <m-m-button variant="outlined" @click="emit('close')">
          Cancel
        </m-m-button>
        <m-m-button
          :is-disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          cy="button-submit"
          @click="onSubmit"
        >
          Verify and complete setup
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

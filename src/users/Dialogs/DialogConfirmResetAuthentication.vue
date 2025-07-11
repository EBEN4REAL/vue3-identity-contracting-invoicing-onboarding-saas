<script setup lang="ts">
import { usersService } from "~/users/users.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { ref, Ref } from "vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const isSubmitButtonLoading: Ref<boolean> = ref(false);
const isSubmitButtonDisabled: Ref<boolean> = ref(false);

const onSubmit = async () => {
  try {
    isSubmitButtonDisabled.value = true;
    isSubmitButtonLoading.value = true;
    await usersService.deleteUserMeTOTP();
    eventBus.$emit("onShowToast", {
      text: "Two-factor authentication has been reset.",
      status: "info",
    });
    emit("submit");
    emit("close");
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to reset TOTP",
      status: "error",
    });
  } finally {
    isSubmitButtonDisabled.value = false;
    isSubmitButtonLoading.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="warning"
    icon-color="error"
    title="Delete Authentication"
    subtitle="Are you sure you want to reset the authentication? You’ll have to setup the authentication all over again."
    cy="dialog-confirm-reset-authentication"
    @close="emit('close')"
  >
    <template #footer>
      <m-m-button variant="outlined" @click="emit('close')">
        Cancel
      </m-m-button>
      <m-m-button variant="danger" cy="button-submit" @click="onSubmit">
        Yes, delete
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

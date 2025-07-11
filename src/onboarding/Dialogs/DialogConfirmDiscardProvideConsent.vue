<script setup lang="ts">
import { ref, Ref } from "vue";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

defineProps({
  isOpen: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits(["close"]);

const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);

const onSubmit = () => {
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;
    authService.logout();
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to logout successfuly",
      status: "error",
    });
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="warning"
    icon-color="error"
    title="Cancel login"
    subtitle="Are you sure you want to cancel? You cannot login without providing the required consents."
    @close="emit('close')"
  >
    <template #footer>
      <m-m-button variant="outlined" @click="emit('close')">
        Continue with login
      </m-m-button>
      <m-m-button
        variant="danger"
        cy="button-submit"
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        @click="onSubmit"
      >
        Yes, cancel login
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

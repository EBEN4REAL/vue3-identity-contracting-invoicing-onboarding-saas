<script lang="ts" setup>
import { ref, reactive, Ref } from "vue";
import { TypeChangeEmailForm } from "~/users/users.types";
import { usersService } from "~/users/users.service";

const props = defineProps<{
  isOpen: {
    type: boolean;
    default: false;
  };
  username: {
    type: string;
    default: "";
  };
}>();

const changeEmailForm = reactive<TypeChangeEmailForm>({
  password: "",
  newEmail: "",
});
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const emit = defineEmits(["close", "submit"]);
const submitForm = async () => {
  try {
    isButtonSubmitLoading.value = true;
    isButtonSubmitDisabled.value = true;
    await usersService.changeUserMeEmail(
      changeEmailForm.password,
      changeEmailForm.newEmail,
    );

    emit("submit");
    closeModal();
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value = error.response.data;
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};
const resetForm = () => {
  changeEmailForm.password = "";
  changeEmailForm.newEmail = "";
  isAlertVisible.value = false;
  alertText.value = "";
};
const closeModal = () => {
  resetForm();
  emit("close");
};
const closeAlert = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <m-m-dialog
    :is-open="props.isOpen"
    title="Change email address"
    subtitle="Set new email"
    icon="key-filled"
    @close="closeModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="change-email-form-alert"
        class="mm-mb-12"
        @close="closeAlert"
      >
        {{ alertText }}
      </m-m-alert>
      <form
        v-mm-focus-first
        class="mm-page-dialog-form"
        data-cy="change-email-form"
      >
        <div>
          <m-m-password
            v-model="changeEmailForm.password"
            label="Verify with current password"
            cy="current-password"
          />
        </div>
        <div>
          <m-m-input
            v-model="changeEmailForm.newEmail"
            inputmode="email"
            label="New email address"
            cy="new-email"
          />
        </div>
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal"> Dismiss </m-m-button>
      <m-m-button
        :loading="isButtonSubmitLoading"
        :is-disabled="isButtonSubmitDisabled"
        variant="elevated"
        data-cy="change-email-form-submit-button"
        @click="submitForm"
      >
        Save
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

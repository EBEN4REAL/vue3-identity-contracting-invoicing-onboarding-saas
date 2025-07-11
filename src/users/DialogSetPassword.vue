<script lang="ts" setup>
import { ref, reactive, Ref, computed, ComputedRef } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  TypeValidatorChangePassword,
  TypeSetPasswordForm,
  TypeSetPasswordFormRules,
} from "~/users/users.types";
import { usersService } from "~/users/users.service";
import { usePasswordRequirements } from "~/mm_ui_kit/src/composables/usePasswordRequirements";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import DialogPasswordSecurityBreach from "~/auth/DialogPasswordSecurityBreach.vue";

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

const setPasswordForm = reactive<TypeSetPasswordForm>({
  new: "",
});
const loading: Ref<boolean> = ref(false);
const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const { passwordRules, passwordRequirements } = usePasswordRequirements(
  props.username,
);
const formRules: ComputedRef<TypeSetPasswordFormRules> = computed(() => ({
  new: passwordRules.value,
}));
const v$: TypeValidatorChangePassword = useVuelidate(
  formRules.value,
  setPasswordForm,
);
const isDialogPasswordSecurityBreachOpen: Ref<boolean> = ref(false);
const isOverridePwned: Ref<boolean> = ref(false);

const emit = defineEmits(["close", "submit"]);

const onDialogPasswordSecurityBreachClose = () => {
  isDialogPasswordSecurityBreachOpen.value = false;
};

const onDialogPasswordSecurityBreachSubmit = () => {
  isDialogPasswordSecurityBreachOpen.value = false;
  isOverridePwned.value = true;
};

const submitForm = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    loading.value = true;
    await usersService.setUserMePassword(
      setPasswordForm.new,
      isOverridePwned.value,
    );
    emit("submit");
    closeModal();
    loading.value = false;
    eventBus.$emit("onShowToast", {
      text: "Your password was set successfully",
      status: "info",
    });
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value = error.response.data;
    loading.value = false;
    if (error.response.status === 406) {
      isDialogPasswordSecurityBreachOpen.value = true;
    }
  }
};

const resetForm = () => {
  setTimeout(() => {
    setPasswordForm.new = "";
    isAlertVisible.value = false;
    alertText.value = "";
  }, 100);
  v$.value.$reset();
};

const closeModal = () => {
  resetForm();
  emit("close");
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Set password"
    subtitle="Set new password"
    icon="key-filled"
    cy="dialog-set-password"
    @close="closeModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="change-password-form-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ alertText }}
      </m-m-alert>
      <form
        v-mm-focus-first
        class="mm-page-dialog-form"
        data-cy="change-password-form"
      >
        <m-m-password
          v-model="setPasswordForm.new"
          :requirements="passwordRequirements"
          label="New password"
          :errors="v$.new.$errors"
          cy="new-password"
          @input="v$.new.$touch"
          @submit="submitForm"
        />
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal"> Dismiss </m-m-button>
      <m-m-button
        :is-disabled="v$.$invalid"
        :loading="loading"
        variant="elevated"
        data-cy="button-submit"
        @click="submitForm"
      >
        Set Password
      </m-m-button>
    </template>
  </m-m-dialog>

  <dialog-password-security-breach
    :is-open="isDialogPasswordSecurityBreachOpen"
    @submit="onDialogPasswordSecurityBreachSubmit"
    @close="onDialogPasswordSecurityBreachClose"
  />
</template>

<style scoped lang="scss"></style>

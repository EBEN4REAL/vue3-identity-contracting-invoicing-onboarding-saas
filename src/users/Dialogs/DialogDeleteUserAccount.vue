<script setup lang="ts">
import { computed, reactive, ref, Ref, ComputedRef } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { usersService } from "~/users/users.service";
import { email, helpers, required } from "@vuelidate/validators";

import useVuelidate from "@vuelidate/core";
import {
  TypeDeleteAccountForm,
  TypeDeleteAccountFormRules,
  TypeValidatorSignupTOTPVerification,
} from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "submit"]);

const isDeletingAccount: Ref<boolean> = ref(false);

const form: TypeDeleteAccountForm = reactive({
  email: "",
  confirmText: "",
});
const formRules: TypeDeleteAccountFormRules = {
  email: {
    required: helpers.withMessage("Email address is required", required),
    email: helpers.withMessage("Please enter a valid email address", email),
  },
  confirmText: {
    required: helpers.withMessage("Please enter the 'DELETE' text", required),
  },
};

const v$: TypeValidatorSignupTOTPVerification = useVuelidate(formRules, form);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(() => {
  return form.confirmText !== "DELETE" || form.email !== props.username;
});

const onSubmit = async () => {
  const result = await v$.value.$validate();
  const deletionConfirmed = form.confirmText === "DELETE";

  if (form.email !== props.username) {
    eventBus.$emit("onShowToast", {
      text: "Email provided does not match the email for your account",
      status: "error",
    });
    return;
  }

  if (!deletionConfirmed) {
    eventBus.$emit("onShowToast", {
      text: `Enter "DELETE" to continue operation`,
      status: "error",
    });
    return;
  }

  if (!result) {
    return;
  }
  isDeletingAccount.value = true;
  try {
    await usersService.deleteUserMeAccount();
    eventBus.$emit("onShowToast", {
      text: "Account deleted successfuly",
      status: "info",
    });
    emit("submit");
    emit("close");
    form.email = "";
    form.confirmText = "";
    authService.logout();
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Error Deleting Account",
      status: "error",
    });
  } finally {
    isDeletingAccount.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon-color="error"
    icon="trash"
    title="Delete account"
    subtitle="To delete your account please provide the details below."
    size="small"
    cy="dialog-delete-account"
    @close="emit('close')"
  >
    <m-m-input
      v-model="form.email"
      :errors="v$.email.$errors"
      name="email"
      label="Email"
      placeholder="Enter your email"
      class="mm-mb-8"
      cy="account-delete-email"
      @input="v$.email.$touch"
    />

    <m-m-input
      v-model="form.confirmText"
      :errors="v$.confirmText.$errors"
      name="email"
      label="To confirm, type DELETE in the box below"
      class="mm-mb-8"
      cy="input-account-delete-confirmation-text"
      @input="v$.confirmText.$touch"
    />

    <template #footer>
      <div class="mm-flex mm-flex-justify-end mm-flex-gap-6">
        <m-m-button variant="outlined" @click="emit('close')">
          Cancel
        </m-m-button>
        <m-m-button
          :is-disabled="isButtonSubmitDisabled"
          :loading="isDeletingAccount"
          cy="button-delete-account"
          variant="danger"
          @click="onSubmit"
        >
          Yes, delete
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

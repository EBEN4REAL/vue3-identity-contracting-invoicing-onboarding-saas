<script setup lang="ts">
import { computed, ComputedRef, reactive, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import config from "~/mm.config.json";
import {
  TypeSignupTOTPVerificationForm,
  TypeSignupTOTPVerificationFormRules,
  TypeValidatorSignupTOTPVerification,
} from "~/auth/auth.types";
import { helpers, minLength, required } from "@vuelidate/validators";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { ERRORS_LOGIN } from "~/auth/constants";
import { getUserEmail } from "~/auth/cookies";
import { interpolateString } from "~/common/helpers/interpolateString";

const route = useRoute();

const emit = defineEmits(["setState"]);

const form: TypeSignupTOTPVerificationForm = reactive({
  code: "",
});
const formRules: TypeSignupTOTPVerificationFormRules = {
  code: {
    required: helpers.withMessage("Code is required", required),
    minLength: helpers.withMessage("Backup code is required", minLength(1)),
  },
};
const v$: TypeValidatorSignupTOTPVerification = useVuelidate(formRules, form);
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);

const error: ComputedRef<string> = computed(
  () => (route.query?.error as string) || "",
);

const errorDescription: ComputedRef<string> = computed(() => {
  const defaultErrorDescription = "Something went wrong. Please try again.";
  if (!error.value) return defaultErrorDescription;
  const stringToInterpolate =
    ERRORS_LOGIN[error.value as keyof typeof ERRORS_LOGIN];

  const valueToInterpolate = {
    soft_lock_duration: Number(route.query?.soft_lock_duration),
  };

  const interpolatedError = interpolateString(
    stringToInterpolate,
    valueToInterpolate,
  );
  return interpolatedError || defaultErrorDescription;
});

const csrf_token: ComputedRef<string> = computed(
  () => route.query.csrf_token?.toString() || "",
);

const formUrl: ComputedRef<string> = computed(
  () =>
    `${config.idp.url}/login-backup-code?next_url=${encodeURIComponent(`${route.query.next_url}`)}`,
);

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <div class="mm-auth-view-totp">
    <div class="mm-auth-view-content-title mm-mb-6">
      Verify with backup code
    </div>
    <div class="mm-auth-view-content-subtitle mm-mb-16">
      Enter one of your unused backup codes
    </div>
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      cy="login-form-alert"
      class="mm-mb-12"
      @close="onAlertClose"
    >
      {{ errorDescription }}
    </m-m-alert>
    <form v-mm-focus-first :action="formUrl" method="post" class="mm-w-10">
      <m-m-input
        v-model="form.code"
        :errors="v$.code.$errors"
        name="code"
        label="Enter backup code"
        class="mm-mb-8"
        @input="v$.code.$touch"
      />
      <input type="hidden" name="csrf_token" :value="csrf_token" />
      <input type="hidden" name="username" :value="getUserEmail()" />
      <m-m-button
        :is-disabled="v$.$invalid"
        class="mm-mb-8 verify-login-button"
        is-full-width
        type="submit"
      >
        Verify and login
      </m-m-button>
      <div class="mm-flex mm-flex-column mm-flex-align-center">
        <m-m-button
          variant="transparent"
          cy="button-show-verification-required"
          prepend-icon="arrow-left"
          @click="emit('setState', 'code')"
        >
          Back
        </m-m-button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.verify-login-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
</style>

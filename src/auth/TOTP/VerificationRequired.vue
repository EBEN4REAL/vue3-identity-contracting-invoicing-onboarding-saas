<script setup lang="ts">
import { computed, ComputedRef, reactive, ref, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import config from "~/mm.config.json";
import {
  TypeSignupTOTPVerificationForm,
  TypeSignupTOTPVerificationFormRules,
  TypeValidatorSignupTOTPVerification,
} from "~/auth/auth.types";
import { ERRORS_LOGIN } from "~/auth/constants";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { getUserEmail } from "~/auth/cookies";
import { interpolateString } from "~/common/helpers/interpolateString";

const route = useRoute();
const router = useRouter();

const emit = defineEmits(["setState"]);

const remember_totp: Ref<boolean> = ref(false);
const rememberFor = encodeURIComponent(
  route.query.remember_totp?.toString() || "30",
);
const username = getUserEmail();

const form: TypeSignupTOTPVerificationForm = reactive({
  code: "",
});
const formRules: TypeSignupTOTPVerificationFormRules = {
  code: {
    required: helpers.withMessage("Code is required", required),
    minLength: helpers.withMessage(
      "Code has to be 6-digits long",
      minLength(6),
    ),
    maxLength: helpers.withMessage(
      "Code has to be 6-digits long",
      maxLength(6),
    ),
  },
};
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);

const csrf_token: ComputedRef<string> = computed(
  () => route.query.csrf_token?.toString() || "",
);

const mfa_methods: ComputedRef<string> = computed(
  () => route.query.mfa_methods?.toString() || "",
);

const next_url: ComputedRef<string> = computed(
  () => route.query.next_url?.toString() || "",
);

const mfa_required: ComputedRef<string> = computed(
  (): string => route.query.mfa_required?.toString() || "",
);

const formUrl: ComputedRef<string> = computed(
  () =>
    `${config.idp.url}/login-totp?next_url=${encodeURIComponent(`${route.query.next_url}`)}`,
);

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

const v$: TypeValidatorSignupTOTPVerification = useVuelidate(formRules, form);

const isChooseDifferentMFAMethod: ComputedRef<boolean> = computed(() =>
  Boolean(mfa_methods.value.split(",").length > 1),
);

const chooseDifferentMFAMethod = () => {
  router.push({
    path: "/login-mfa",
    query: {
      next_url: next_url.value,
      mfa_methods: mfa_methods.value,
      username,
      csrf_token: csrf_token.value,
      mfa_required: mfa_required.value,
    },
  });
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <div class="mm-auth-view-totp">
    <div class="mm-auth-view-content-title mm-mb-6">Verification required</div>
    <div class="mm-auth-view-content-subtitle mm-mb-16">
      Enter the code shown in your authenticator app
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
    <form v-mm-focus-first :action="formUrl" method="post">
      <m-m-input
        v-model="form.code"
        :errors="v$.code.$errors"
        name="code"
        label="Enter 6 digit code"
        placeholder="123456"
        class="mm-mb-8"
        @blur="v$.code.$touch"
      />
      <input type="hidden" name="csrf_token" :value="csrf_token" />
      <input type="hidden" name="remember_totp" :value="remember_totp" />
      <input type="hidden" name="username" :value="username" />
      <m-m-button
        :is-disabled="v$.$invalid"
        class="mm-mb-8 verify-button"
        is-full-width
        type="submit"
      >
        Verify and login
      </m-m-button>
      <div class="mm-flex mm-flex-column">
        <div class="mm-flex mm-flex-justify-between mm-mb-8">
          <m-m-checkbox v-model="remember_totp" cy="remember_totp">
            Don’t ask again for {{ rememberFor }} days
          </m-m-checkbox>
        </div>
        <m-m-button
          variant="transparent"
          class="mm-mb-12 font-weight-500"
          cy="button-show-verify-with-backup-code"
          @click="emit('setState', 'backup-code')"
        >
          No access to authenticator app?
        </m-m-button>
        <m-m-button
          v-if="isChooseDifferentMFAMethod"
          variant="transparent"
          class="mm-fs-14 mm-pa-0 mfa-button"
          @click.prevent="chooseDifferentMFAMethod"
        >
          <span class="mm-fw-600">Use a different method</span>
        </m-m-button>
        <div class="mm-auth-view-back-link mm-mt-16">
          <div data-teleport="onboarding-back" />
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.mfa-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.verify-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
</style>

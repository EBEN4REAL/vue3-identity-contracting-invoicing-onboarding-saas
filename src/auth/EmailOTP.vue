<script setup lang="ts">
import { computed, ComputedRef, reactive, ref, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import config from "~/mm.config.json";
import {
  Auth,
  TypeSignupTOTPVerificationForm,
  TypeSignupTOTPVerificationFormRules,
  TypeValidatorSignupTOTPVerification,
} from "~/auth/auth.types";
import { ERRORS_LOGIN } from "~/auth/constants";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { getUserEmail } from "~/auth/cookies";

const route = useRoute();
const router = useRouter();

const remember_email_otp: Ref<boolean> = ref(false);
const rememberFor = encodeURIComponent(
  route.query.remember_email_otp?.toString() || "30",
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
const error = route.query.error;
const errorDescription = error
  ? ERRORS_LOGIN[error.toString() as keyof typeof ERRORS_LOGIN]
  : "Something went wrong. please try again.";
const isAlertVisible: Ref<boolean> = ref(!!error);

const isChooseDifferentMFAMethod: ComputedRef<boolean> = computed(() =>
  Boolean(mfaMethods.value.split(",").length > 1),
);

const csrf_token: ComputedRef<string> = computed(
  () => route.query.csrf_token?.toString() || "",
);

const next_url: ComputedRef<string> = computed(
  () => route.query.next_url?.toString() || "",
);

const mfaMethods: ComputedRef<string> = computed(
  () => route.query.mfa_methods?.toString() || "",
);

const mfa_required: ComputedRef<string> = computed(
  (): string => route.query.mfa_required?.toString() || "",
);

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const formUrl: ComputedRef<string> = computed(
  () =>
    `${config.idp.url}/login-email-otp?next_url=${encodeURIComponent(`${route.query.next_url}`)}`,
);

const backTo = `/login?stage=${Auth.Email}&next_url=${encodeURIComponent(`${next_url.value}`)}`;

const v$: TypeValidatorSignupTOTPVerification = useVuelidate(formRules, form);
const brandingConfigStore = useBrandingConfigStore();

const chooseDifferentMFAMethod = () => {
  router.push({
    path: "/login-mfa",
    query: {
      next_url: next_url.value,
      mfa_methods: mfaMethods.value,
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
  <div class="mm-auth-view-email-otp">
    <div class="mm-flex mm-flex-align-center mm-flex-justify-center">
      <img
        v-if="logoSrc"
        class="mm-auth-view-logo"
        :src="logoSrc"
        data-cy="brand-logo"
      />
    </div>
    <div data-cy="verification-required">
      <div class="mm-auth-view-content-title mm-mb-6">
        Verification required
      </div>
      <div class="mm-auth-view-content-subtitle mm-mb-16">
        Enter the code from your email
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
          cy="login-with-email-otp-code"
          name="code"
          label="Enter 6 digit code"
          placeholder="123456"
          class="mm-mb-8"
          @blur="v$.code.$touch"
        />
        <input type="hidden" name="csrf_token" :value="csrf_token" />
        <input type="hidden" name="username" :value="username" />
        <input type="hidden" name="next_url" :value="next_url" />
        <input
          type="hidden"
          name="remember_email_otp"
          :value="remember_email_otp"
        />
        <m-m-button
          :is-disabled="v$.$invalid"
          cy="login-with-email-otp"
          class="mm-mb-8 email-otp-button"
          is-full-width
          type="submit"
        >
          Verify and login
        </m-m-button>
        <div class="mm-flex mm-flex-column">
          <div class="mm-flex mm-flex-justify-between">
            <m-m-checkbox
              v-model="remember_email_otp"
              class="mm-mb-"
              cy="remember_totp"
            >
              Don’t ask again for {{ rememberFor }} days
            </m-m-checkbox>
            <m-m-button
              v-if="isChooseDifferentMFAMethod"
              variant="transparent"
              class="mm-fs-14 mm-pa-0 email-otp-button"
              @click.prevent="chooseDifferentMFAMethod"
            >
              <span class="mm-fw-600">Use a different method</span>
            </m-m-button>
          </div>
          <div class="mm-auth-view-back-link">
            <div data-teleport="onboarding-back" />
          </div>
        </div>
      </form>
      <div>
        <div class="mm-flex mm-flex-justify-center mm-mt-8">
          <m-m-link
            prepend-icon="arrow-left"
            :href="backTo"
            data-cy="button-email-otp-login-back-to"
          >
            <m-m-icon icon="arrow-left" class="mm-mr-4" />
            <span class="font-weight-600">Back to log in</span>
          </m-m-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.email-otp-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.mm-auth-view-email-otp {
  min-width: 510px;
  border-radius: 12px;
  background: white;
  padding: 30px 60px 30px;
  &-container {
    min-height: 56px;
    border-radius: 16px;

    &:hover {
      background-color: #f4f5f7;
    }

    padding: 16px;
    cursor: pointer;

    &.selected {
      background: #f4f5f7;
    }
  }
}

/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-auth-view-email-otp {
    box-shadow: none;
    background: transparent;
    width: calc(100% - 30px);
    padding: 0;
    min-width: auto;
  }
}
</style>

<script setup lang="ts">
import { useRoute } from "vue-router";
import config from "~/mm.config.json";
import { computed, ComputedRef, reactive, ref, Ref } from "vue";
import {
  TypeSignupConfirmationForm,
  TypeSignupConfirmationFormRules,
  TypeValidatorSignupConfirmation,
} from "~/auth/auth.types";
import { useVuelidate } from "@vuelidate/core";
import { usePasswordRequirements } from "~/mm_ui_kit/src/composables/usePasswordRequirements";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { useTranslation } from "i18next-vue";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { ERRORS_PASSWORD } from "~/auth/constants";
import { getUserEmail } from "~/auth/cookies";

const { t } = useTranslation();
const route = useRoute();
const status = route.query.status;
const token = route.query.token;
const backup_codes = route.query.backup_codes;
const csrfToken = route.query.csrf_token;
const invitationToken = route.query.invitation_token?.toString() || undefined;
const outcome = route.query.outcome;
const nextUrl = route.query.next_url?.toString() || "";
const signup_completed = encodeURIComponent(
  route.query.signup_completed?.toString() || "",
);

const username = getUserEmail();
const usernameEncoded = encodeURIComponent(username);
const usernameDecoded = decodeURIComponent(username);

const { passwordRules, passwordRequirements } = usePasswordRequirements(
  `${usernameEncoded}`,
);

const isAlertVisible: Ref<boolean> = ref(!!route.query.error);
const isButtonSubmitLoading: Ref<boolean> = ref(false);

const errorDescription = route.query.error
  ? ERRORS_PASSWORD[
      route.query.error.toString() as keyof typeof ERRORS_PASSWORD
    ]
  : "Something went wrong. Please try again.";

const formUrlSignupConfirmation = `${config.idp.url}/signup/confirmation`;

const form: TypeSignupConfirmationForm = reactive({
  password: "",
});

const formRules: TypeSignupConfirmationFormRules = {
  password: passwordRules.value,
};

const v$: TypeValidatorSignupConfirmation = useVuelidate(formRules, form);

const titleText = computed(() => {
  if (decodedBackupCodes.value.length > 0) return "TOTP configured";
  return t("onboarding.confirmation.title");
});

const subtitleText = computed(() => {
  return isSuccess
    ? t("onboarding.confirmation.subtitle_success")
    : t("onboarding.confirmation.subtitle_password");
});

const decodedBackupCodes: ComputedRef<string[]> = computed(() =>
  backup_codes ? atob(backup_codes.toString()).split(",") : [],
);

const isOutcomePendingTOTP: ComputedRef<boolean> = computed(() =>
  Boolean(outcome && outcome.toString() === "T"),
);

const loginButtonText: ComputedRef<string> = computed(() =>
  isOutcomePendingTOTP.value ? "Continue" : "Log in",
);

const formActionLoginSignup: ComputedRef<string> = computed(
  () =>
    `${config.idp.url}/login-signup?signup_completed=${signup_completed}&next_url=${encodeURIComponent(nextUrl)}`,
);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () => v$.value.$invalid || isButtonSubmitLoading.value,
);

const isSuccess = status && status === "SUCCESS";

const brandingConfigStore = useBrandingConfigStore();

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

if (!status && !csrfToken) {
  window.location.href = formUrlSignupConfirmation;
}

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onSubmit = () => {
  isButtonSubmitLoading.value = true;
};
</script>

<template>
  <div class="mm-auth-view-signup-confirmation">
    <div
      v-if="logoSrc"
      class="mm-mb-15 mm-mx-auto mm-flex mm-justify-center mm-align-center"
    >
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <div class="mm-auth-view-content-title mm-mb-2">{{ titleText }}</div>
    <div class="mm-auth-view-content-subtitle mm-mb-6" data-cy="success">
      {{ subtitleText }}
    </div>
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      cy="signup-form-alert"
      class="mm-mb-12"
      @close="onAlertClose"
    >
      {{ errorDescription }}
    </m-m-alert>
    <form
      v-if="!isSuccess"
      v-mm-focus-first
      :action="formUrlSignupConfirmation"
      method="post"
      @submit="onSubmit"
    >
      <input
        type="email"
        name="email"
        :value="usernameDecoded"
        class="hidden-field"
      />
      <m-m-password
        id="password"
        v-model="form.password"
        :requirements="passwordRequirements"
        :errors="v$.password.$errors"
        name="password"
        label="Password"
        placeholder="Enter your password"
        cy="password"
        class="mm-mb-8"
        required
        @input="v$.password.$touch"
      />
      <input type="hidden" name="next_url" :value="nextUrl" />
      <input type="hidden" name="csrf_token" :value="csrfToken" />
      <input v-if="token" type="hidden" name="token" :value="token" />
      <input
        v-if="invitationToken"
        type="hidden"
        name="invitation_token"
        :value="invitationToken"
      />
      <m-m-button
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        type="submit"
        class="continue-button"
        is-full-width
        data-cy="continue"
      >
        Continue
      </m-m-button>
    </form>
    <m-m-backup-codes v-if="backup_codes" :backup-codes="decodedBackupCodes" />
    <form
      v-if="isSuccess"
      v-mm-focus-first
      :action="formActionLoginSignup"
      method="POST"
    >
      <input type="hidden" name="username" :value="usernameDecoded" />
      <input type="hidden" name="csrf_token" :value="csrfToken" />
      <m-m-button
        type="submit"
        is-full-width
        data-cy="login"
        class="mm-mt-14 submit-button"
      >
        {{ loginButtonText }}
      </m-m-button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.continue-button,
.submit-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.mm-auth-view-signup-confirmation {
  display: flex;
  flex-direction: column;
  min-width: 490px;
  height: fit-content;
  box-shadow: 0px 5px 15px 0px #0000001f;
  border-radius: 12px;
  background: white;
  padding: 30px 60px 20px;
}

.hidden-field {
  visibility: hidden;
  position: absolute;
  top: -2000px;
}

/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-auth-view-signup-confirmation {
    display: flex;
    flex-direction: column;
    box-shadow: none;
    width: calc(100% - 30px);
    padding: 0;
    min-width: auto;
  }
}
</style>

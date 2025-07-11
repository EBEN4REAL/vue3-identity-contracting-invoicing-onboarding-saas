<script setup lang="ts">
import { useRoute } from "vue-router";
import config from "~/mm.config.json";
import { computed, ComputedRef, onMounted, reactive, ref, Ref } from "vue";
import {
  TypeResetPasswordForm,
  TypeResetPasswordFormRules,
  TypeValidatorResetPassword,
} from "~/auth/auth.types";
import { useVuelidate } from "@vuelidate/core";
import { usePasswordRequirements } from "~/mm_ui_kit/src/composables/usePasswordRequirements";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { StatusTypes } from "~/common/types";
import DialogPasswordSecurityBreach from "~/auth/DialogPasswordSecurityBreach.vue";
import { ERRORS_PASSWORD } from "~/auth/constants";
import { getUserEmail } from "~/auth/cookies";

const route = useRoute();
const status = route.query.status;
const token = route.query.token;
const csrfToken = route.query.csrf_token;
const nextUrl = encodeURIComponent(route.query.next_url?.toString() || "");
const username = getUserEmail();
const usernameEncoded = encodeURIComponent(username);
const isDialogPasswordSecurityBreachOpen: Ref<boolean> = ref(false);

const formUrl: Ref<string> = ref(`${config.idp.url}/password/reset`);
const loginUrl = `${config.idp.url}/login?next_url=${nextUrl}&username=${usernameEncoded}`;
const resetPasswordUrl = `/forgotten-password?csrf_token=${csrfToken}&next_url=${nextUrl}&username=${usernameEncoded}`;

const isError = status && status === StatusTypes.ERROR;
const isSuccess = status && status === StatusTypes.SUCCESS;
const isTokenError =
  isError && route.query.error === "MISSING_OR_INVALID_TOKEN";
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);
const errorDescription = route.query.error
  ? ERRORS_PASSWORD[
      route.query.error.toString() as keyof typeof ERRORS_PASSWORD
    ]
  : "Something went wrong. Please try again.";
const isReady = isSuccess || csrfToken;

if (!isReady) {
  window.location.href = formUrl.value;
}

const { passwordRules, passwordRequirements } =
  usePasswordRequirements(username);

const form: TypeResetPasswordForm = reactive({
  password: "",
});

const formRules: TypeResetPasswordFormRules = {
  password: passwordRules.value,
};

const v$: TypeValidatorResetPassword = useVuelidate(formRules, form);

const titleText = computed(() => {
  return isSuccess ? "Password reset" : "Reset password";
});

const subtitleText = computed(() => {
  return isSuccess
    ? "You can now use your new password to log in to your account"
    : isTokenError
      ? "You need to reset your password again"
      : "Please enter your new password";
});

const login = () => {
  window.location.href = loginUrl;
};
const resetPassword = () => {
  window.location.href = resetPasswordUrl;
};
const brandingConfigStore = useBrandingConfigStore();
const logoSrc: ComputedRef = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const onDialogPasswordSecurityBreachClose = () => {
  isDialogPasswordSecurityBreachOpen.value = false;
};

const onDialogPasswordSecurityBreachSubmit = () => {
  isDialogPasswordSecurityBreachOpen.value = false;
  formUrl.value = `${formUrl.value}?override_pwned=true`;
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(() => {
  if (route.query.error === "PWNED_PASSWORD") {
    isDialogPasswordSecurityBreachOpen.value = true;
  }
});
</script>

<template>
  <m-m-progress-circular
    v-if="!isReady"
    :size="128"
    :width="12"
    class="loader-centered"
  />
  <div v-else class="mm-auth-view-forgotten-password">
    <div
      v-if="logoSrc"
      class="mm-mb-15 mm-mx-auto mm-flex mm-flex-justify-center mm-flex-align-center"
    >
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <div class="mm-auth-view-content-title mm-mb-6">{{ titleText }}</div>
    <div class="mm-auth-view-content-subtitle mm-mb-12" data-cy="subtitle">
      {{ subtitleText }}
    </div>
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      cy="alert"
      class="mm-mb-12"
      @close="onAlertClose"
    >
      {{ errorDescription }}
    </m-m-alert>
    <form
      v-if="!isSuccess && !isTokenError"
      v-mm-focus-first
      :action="formUrl"
      method="post"
    >
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

      <input type="hidden" name="token" :value="token" />
      <input type="hidden" name="csrf_token" :value="csrfToken" />
      <m-m-button
        class="reset-password-button"
        :is-disabled="v$.$invalid"
        type="submit"
        is-full-width
        data-cy="continue"
      >
        Continue
      </m-m-button>
    </form>
    <m-m-button
      v-if="isSuccess"
      class="reset-password-button"
      type="submit"
      is-full-width
      data-cy="login"
      @click.prevent="login"
    >
      Log in
    </m-m-button>
    <m-m-button
      v-else-if="isTokenError"
      class="reset-password-button"
      type="submit"
      is-full-width
      data-cy="reset"
      @click.prevent="resetPassword"
    >
      Reset password
    </m-m-button>
  </div>

  <dialog-password-security-breach
    :is-open="isDialogPasswordSecurityBreachOpen"
    @submit="onDialogPasswordSecurityBreachSubmit"
    @close="onDialogPasswordSecurityBreachClose"
  />
</template>

<style scoped>
.reset-password-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.mm-auth-view-forgotten-password {
  min-width: 490px;
  box-shadow: 0px 5px 15px 0px #0000001f;
  border-radius: 12px;
  background: white;
  padding: 30px 60px 30px;
}
</style>

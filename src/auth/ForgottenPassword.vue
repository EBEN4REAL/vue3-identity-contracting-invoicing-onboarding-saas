<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ComputedRef, Ref, computed, reactive, ref } from "vue";
import config from "~/mm.config.json";
import type {
  TypeForgottenPasswordForm,
  TypeForgottenPasswordFormRules,
  TypeValidatorForgottenPassword,
} from "~/auth/auth.types";
import { useVuelidate } from "@vuelidate/core";
import { ERRORS_PASSWORD } from "~/auth/constants";
import { email, helpers, required } from "@vuelidate/validators";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";

const route = useRoute();
const router = useRouter();
const status = route.query.status;
const nextUrl = route.query.next_url;
const csrfToken = route.query.csrf_token;
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);
const errorDescription = route.query.error
  ? ERRORS_PASSWORD[
      route.query.error.toString() as keyof typeof ERRORS_PASSWORD
    ]
  : "Something went wrong. Please try again.";

const form: TypeForgottenPasswordForm = reactive({
  email: "",
});
const brandingConfigStore = useBrandingConfigStore();
const logoSrc: ComputedRef = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const formRules: TypeForgottenPasswordFormRules = {
  email: {
    required: helpers.withMessage("Email address is required", required),
    email: helpers.withMessage("Please enter a valid email address", email),
  },
};

const isSuccess = computed(() => status && status === "SUCCESS");

const titleText = computed(() => {
  return isSuccess.value ? "Email sent" : "Forgot Password";
});

const subtitleText = computed(() => {
  return isSuccess.value
    ? "A reset email has been sent to your account"
    : "Enter your email to reset your password";
});

const formUrl = `${config.idp.url}/password/forgotten?next_url=${encodeURIComponent(`${nextUrl}`)}`;

const v$: TypeValidatorForgottenPassword = useVuelidate(formRules, form);

if (!status && !csrfToken) {
  window.location.href = formUrl;
}

const onBackToLogIn = () => {
  router.push("login");
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <div class="mm-auth-view-forgotten-password">
    <div
      v-if="logoSrc"
      class="mm-mb-15 mm-mx-auto mm-flex mm-flex-justify-center mm-flex-align-center"
    >
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <div class="mm-auth-view-content-title mm-mb-6">{{ titleText }}</div>
    <div class="mm-auth-view-content-subtitle mm-mb-12">
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
    <form v-if="!isSuccess" v-mm-focus-first :action="formUrl" method="post">
      <m-m-input
        id="username"
        v-model="form.email"
        type="email"
        name="username"
        inputmode="email"
        label="Email"
        placeholder="Enter Your Email"
        data-cy="username"
        class="mm-mb-8"
        :errors="v$.email.$errors"
        @blur="v$.email.$touch"
      />
      <input type="hidden" name="csrf_token" :value="csrfToken" />
      <m-m-button
        type="submit"
        is-full-width
        class="mm-auth-view-forgotten-password-button"
        data-cy="send-recovery-email"
      >
        Send recovery email
      </m-m-button>
      <div class="mm-auth-view-back-link mm-mt-16" cy="back-to-login-link">
        <div data-teleport="onboarding-back" />
      </div>
    </form>
    <m-m-button
      v-else
      is-full-width
      cy="button-back-to-login"
      class="mm-auth-view-forgotten-password-button"
      @click="onBackToLogIn"
    >
      Back to log In
    </m-m-button>
  </div>
</template>

<style scoped lang="scss">
.mm-auth-view-forgotten-password {
  min-width: 490px;
  box-shadow: 0px 5px 15px 0px #0000001f;
  border-radius: 12px;
  background: white;
  padding: 30px 60px 30px;
  &-button {
    background-color: var(--branding-button-background-color);
    border: var(--branding-border);
    color: var(--branding-button-text-color);
  }
}
/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-auth-view-forgotten-password {
    box-shadow: none;
    background: transparent;
    width: calc(100% - 30px);
    padding: 0;
    min-width: auto;
  }
}
</style>

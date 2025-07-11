<script setup lang="ts">
import { ref, Ref, onMounted, reactive, computed, ComputedRef } from "vue";
import { authService } from "~/auth/auth.service";
import {
  Auth,
  LoginValidatorType,
  TypeLoginFormRules,
  TypeSSOLoginForm,
  UserProfileMM,
} from "~/auth/auth.types";
import VeriamLogoSVG from "~/assets/images/veriam_logo.svg";
import { useRoute } from "vue-router";
import { ERRORS_LOGIN } from "~/auth/constants";
import { email, helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import config from "~/mm.config.json";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { getUserEmail } from "~/auth/cookies";

const route = useRoute();

const userProfile: Ref<UserProfileMM | null> = ref(null);

const nextUrl = route.query.next_url;
const csrfToken = route.query.csrf_token;
const ssoLoginForm = reactive({
  email: getUserEmail(),
} as TypeSSOLoginForm);

const ssoLoginFormRules: TypeLoginFormRules = {
  email: {
    required: helpers.withMessage("Email address is required", required),
    email: helpers.withMessage("Please enter a valid email address", email),
  },
};

const v$: LoginValidatorType = useVuelidate(ssoLoginFormRules, ssoLoginForm);
const backTo = `/login?stage=${Auth.Email}&next_url=${encodeURIComponent(`${nextUrl}`)}&csrf_token=${csrfToken}`;
const loginWithSSOUrl = `${config.idp.url}/login-sso?next_url=${encodeURIComponent(`${nextUrl}`)}`;

const errorMessage: ComputedRef<string> = computed(() =>
  ["LOGIN_MISSING_SSO", "LOGIN_INVALID_USERNAME"].includes(
    route.query.error as keyof typeof ERRORS_LOGIN,
  )
    ? "We can’t find any SSO configuration for this account, please log in using a different method."
    : ERRORS_LOGIN[route.query.error as keyof typeof ERRORS_LOGIN],
);

const isAlertVisible: Ref<boolean> = ref(!!route.query.error);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
});
</script>

<template>
  <div class="auth-card" data-cy="login-with-sso-form">
    <div class="w-100">
      <div class="support-login-logo-container">
        <VeriamLogoSVG class="mm-auth-view-logo" data-cy="default-logo" />
      </div>
      <div
        data-cy="signin-with-sso-header "
        class="mm-auth-view-content-title mm-mb-10"
      >
        Continue with SSO
      </div>
      <m-m-alert
        v-if="isAlertVisible"
        :status="AlertTypes.Error"
        cy="login-form-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ errorMessage }}
      </m-m-alert>
      <form
        v-mm-focus-first
        class="mm-mt-30"
        :action="loginWithSSOUrl"
        method="post"
        data-cy="login-with-sso-form"
      >
        <input type="hidden" name="csrf_token" :value="csrfToken" />
        <m-m-input
          id="username"
          v-model="ssoLoginForm.email"
          type="email"
          name="username"
          inputmode="email"
          label="Email"
          placeholder="Enter your email"
          data-cy="login-with-sso-email-input"
          required
          class="mm-mb-8"
          hide-asterisk
          :errors="v$.email.$errors"
          @blur="v$.email.$touch"
        />

        <m-m-button
          cy="continue"
          variant="elevated"
          type="submit"
          :is-full-width="true"
          class="mm-auth-view-button-submit mm-mb-8"
        >
          Continue
        </m-m-button>
      </form>

      <div>
        <div class="mm-flex mm-flex-justify-center mm-mt-16">
          <m-m-link prepend-icon="arrow-left" :href="backTo" data-cy="back-to">
            <m-m-icon icon="arrow-left" class="mm-mr-4" />
            <span class="font-weight-600">Back to log in</span>
          </m-m-link>
        </div>
      </div>

      <div class="mm-auth-view-login-footer mm-mt-15">
        By continuing, I agree with Veriam's
        <m-m-link
          href="/tc/terms.pdf"
          target="_blank"
          class="mm-auth-view-login-footer-decorated"
          >&nbsp;Terms of service&nbsp;
        </m-m-link>
        and
        <m-m-link
          href="/tc/privacy.pdf"
          target="_blank"
          class="mm-auth-view-login-footer-decorated"
          >&nbsp;Privacy policy
        </m-m-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-auth-view-login {
  &-logo {
    align-self: center;
  }

  &-footer {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    color: #9ea5af;

    &-decorated {
      color: #9ea5af;
      font-size: 12px;
      text-decoration: underline;
    }
  }

  &-social-button {
    font-weight: 400;
    box-shadow: 0px 1px 2px 0px #1018280d;
    border-color: #d0d5dd;
  }

  &-logo-container {
    align-self: center;
    margin: 0 0 30px 0;
  }
}
</style>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ComputedRef, onMounted, reactive, ref, Ref } from "vue";
import config from "~/mm.config.json";
import { authService } from "~/auth/auth.service";
import {
  Auth,
  LoginStateRead,
  LoginValidatorType,
  ScreenHint,
  TypeLoginForm,
  TypeLoginFormRules,
} from "~/auth/auth.types";
import LogoSVG from "~/assets/images/veriam_logo.svg";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { ERRORS_LOGIN } from "~/auth/constants";
import totp from "./TOTP/Index.vue";
import OrganizationSelect from "./OrganizationSelect/Index.vue";
import { email, helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { useFlag } from "@unleash/proxy-client-vue";
import LoginWithWebAuthn from "./LoginWithWebAuthn.vue";
import LoginWithEmailOTP from "./EmailOTP.vue";
import { interpolateString } from "~/common/helpers/interpolateString";
import MMPassword from "~/mm_ui_kit/src/components/MMPassword.vue";
import { getUserEmail } from "~/auth/cookies";
import { useTranslation } from "i18next-vue";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";
import { loginService } from "~/auth/login.service";

const route = useRoute();
const stage = route.query.stage?.toString() || Auth.Email;
const csrfToken = route.query.csrf_token;
const isLoading: Ref<boolean> = ref(true);
const isGoogleOneTapEnabled = useFlag("google_one_tap");
const isButtonSubmitPasswordLoading: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const passwordField = ref<InstanceType<typeof MMPassword> | null>(null);
const organizationId = route.query.organization_id?.toString() || undefined;
const username = getUserEmail();
const invitationToken = route.query.invitation_token?.toString() || undefined;
const loginForm = reactive({
  email: username,
  password: "",
} as TypeLoginForm);
const brandingConfigStore = useBrandingConfigStore();
const { t } = useTranslation();

const nextUrl: ComputedRef<string | null> = computed(() => {
  const next_url = route.query.next_url
    ? new URL(`${route.query.next_url}`)
    : null;

  if (next_url) {
    next_url.searchParams.set("username", username);
    return next_url.href;
  }

  return null;
});

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const loginFormRules: TypeLoginFormRules = {
  email: {
    required: helpers.withMessage("Email address is required", required),
    email: helpers.withMessage("Please enter a valid email address", email),
  },
};

const v$: LoginValidatorType = useVuelidate(loginFormRules, loginForm);

const loginUrl = `${config.idp.url}/login?next_url=${encodeURIComponent(`${nextUrl.value}`)}`;
const loginEmailUrl = `${config.idp.url}/login-email?next_url=${encodeURIComponent(`${nextUrl.value}`)}`;
const loginWithMagicLinkUrl = `${config.idp.url}/login-magic-link?next_url=${encodeURIComponent(`${nextUrl.value}`)}`;
const forgotPasswordUrl = `/forgotten-password?next_url=${encodeURIComponent(`${nextUrl.value}`)}&csrf_token=${csrfToken}`;
const loginWithSSOUrl = `/login/sso`;
const nextUrlWithScreenHint = `${nextUrl.value}&screen_hint=${ScreenHint.SIGNUP}`;
const signupUrl = `/signup?next_url=${encodeURIComponent(nextUrlWithScreenHint)}&csrf_token=${csrfToken}`;
const error = route.query.error;

const errorDescription: ComputedRef<string> = computed(() => {
  const defaultErrorDescription = "Something went wrong. Please try again.";
  if (!error) return defaultErrorDescription;
  const stringToInterpolate =
    ERRORS_LOGIN[error?.toString() as keyof typeof ERRORS_LOGIN];
  const valueToInterpolate = {
    soft_lock_duration: Number(route.query.soft_lock_duration),
  };
  const interpolatedError = interpolateString(
    stringToInterpolate,
    valueToInterpolate,
  );
  return interpolatedError || defaultErrorDescription;
});
const isAlertVisible: Ref<boolean> = ref(!!error);

const accountName: ComputedRef<string> = computed(
  () => `${brandingConfigStore.brandingConfigGetter?.name || "Veriam"}`,
);
const displayVeriamLogo: ComputedRef<boolean> = computed(() => !logoSrc.value);
const buttonType: ComputedRef<string> = computed(() =>
  v$.value.email.$invalid || loginForm.email.length === 0 ? "button" : "submit",
);

const loginGoogleUrl: ComputedRef<string> = computed(
  () => `${config.idp.url}/login-google`,
);

const loginMicrosoftUrl: ComputedRef<string> = computed(
  () => `${config.idp.url}/login-microsoft`,
);

const isEmailForm: ComputedRef<boolean> = computed(
  () => !username || stage === Auth.Email,
);

const isWebAuthn: ComputedRef<boolean> = computed(
  () => "webauthn_options" in route.query,
);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () => v$.value.$invalid || isButtonSubmitLoading.value,
);

const isEmailOTP: ComputedRef<boolean> = computed(
  () =>
    stage === Auth.MFA &&
    "mfa_methods" in route.query &&
    route.query.email_otp === "1",
);

const isTOTP: ComputedRef<boolean> = computed(() => {
  return (
    stage === Auth.MFA &&
    ("totp_remember" in route.query || "remember_totp" in route.query)
  );
});

const isPassword: ComputedRef<boolean> = computed(() => {
  return stage === Auth.Password;
});

const isOrganizationSelect: ComputedRef<boolean> = computed(
  () => stage === Auth.OrganizationSelection,
);

const showMagicLinkInfo: ComputedRef<boolean> = computed(() => {
  const { stage, status } = route.query;
  const username = getUserEmail();
  return stage === Auth.Email && status === "SUCCESS" && !!username;
});

const loginTitle: ComputedRef<string> = computed(() =>
  t(
    "login.title",
    escapeObjectValuesForHtml({ accountName: accountName.value }),
  ),
);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onSubmit = () => {
  isButtonSubmitPasswordLoading.value = true;
  isButtonSubmitLoading.value = true;
};

const validateLoginState = async (): Promise<boolean> => {
  if (!nextUrl.value) {
    authService.loginWithParams(
      undefined,
      username,
      organizationId,
      invitationToken,
      undefined,
    );
    return false;
  }
  if (!csrfToken) {
    window.location.href = loginUrl;
    return false;
  }
  const loginState = await loginService.getLoginState();
  if (!loginState.csrf_token || csrfToken !== loginState.csrf_token) {
    window.location.href = loginUrl;
    return false;
  }
  return true;
};

const monitorLoginState = async () => {
  try {
    const loginState: LoginStateRead = await loginService.getLoginState();
    if (!loginState.csrf_token) {
      isLoading.value = true;
      window.location.href = loginUrl;
    }
  } catch (error) {
    console.error(error);
  }
};

const loadGoogleOneTap = (): boolean => {
  if (!isGoogleOneTapEnabled.value) {
    return false;
  }
  if (stage && stage !== Auth.Email) {
    return false;
  }
  try {
    google.accounts.id.prompt();
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

onMounted(async () => {
  if (await validateLoginState()) {
    isLoading.value = false;
    setInterval(monitorLoginState, 60000);
    if (!loadGoogleOneTap()) {
      passwordField.value?.focusInput();
    }
  }
  localStorage.setItem("previousPath", window.location.pathname);
});
</script>

<template>
  <m-m-progress-circular
    v-if="isLoading"
    :size="128"
    :width="12"
    class="loader-centered"
  />
  <div v-else class="auth-card">
    <div v-if="isEmailForm" class="mm-flex mm-flex-column">
      <div class="mm-auth-view-login-logo-container">
        <LogoSVG
          v-show="displayVeriamLogo"
          class="mm-auth-view-logo"
          data-cy="default-logo"
        />
        <img
          v-if="logoSrc"
          class="mm-auth-view-logo"
          :src="logoSrc"
          data-cy="brand-logo"
        />
      </div>

      <div
        v-sanitize-html="loginTitle"
        class="mm-auth-view-content-title"
      ></div>
      <div class="mm-auth-view-content-subtitle">
        <div
          v-if="brandingConfigStore.brandingConfigGetter?.name"
          v-sanitize-html="$t('login.subtitle')"
        ></div>
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
      <m-m-alert
        v-if="showMagicLinkInfo"
        :status="AlertTypes.Success"
        cy="login-form-alert-success"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        An email has been sent to you, click on the email to login to the portal
      </m-m-alert>
      <div class="mm-flex mm-flex-column mm-flex-gap-6">
        <form v-mm-focus-first :action="loginGoogleUrl" method="get">
          <input type="hidden" name="next_url" :value="nextUrl" />
          <m-m-button
            cy="continue-with-google"
            variant="outlined-light"
            type="submit"
            icon-size="24px"
            prepend-icon="google"
            :is-full-width="true"
            class="mm-auth-view-login-social-button"
          >
            <span class="mm-auth-view-login-option">
              Continue
              <span class="mm-fw-500">with Google</span>
            </span>
          </m-m-button>
        </form>

        <form v-mm-focus-first :action="loginMicrosoftUrl" method="get">
          <input type="hidden" name="next_url" :value="nextUrl" />
          <m-m-button
            icon-size="24px"
            class="mm-auth-view-login-social-button"
            cy="continue-with-microsoft"
            variant="outlined-light"
            type="submit"
            prepend-icon="microsoft"
            :is-full-width="true"
          >
            <span class="mm-auth-view-login-option">
              Continue
              <span class="mm-fw-500">with Microsoft</span>
            </span>
          </m-m-button>
        </form>

        <form v-mm-focus-first :action="loginWithSSOUrl" method="get">
          <input type="hidden" name="next_url" :value="nextUrl" />
          <input type="hidden" name="csrf_token" :value="csrfToken" />
          <m-m-button
            icon-size="24px"
            class="mm-auth-view-login-social-button"
            cy="continue-with-sso"
            variant="outlined-light"
            type="submit"
            prepend-icon="shield-check-outline"
            :is-full-width="true"
          >
            <span class="mm-auth-view-login-option">
              Continue
              <span class="mm-fw-500">with SSO</span>
            </span>
          </m-m-button>
        </form>
      </div>

      <div class="mm-auth-view-separator">
        <m-m-divider border-color="#EAECF0" />
        OR
        <m-m-divider border-color="#EAECF0" />
      </div>
      <form
        v-mm-focus-first
        :action="loginEmailUrl"
        method="post"
        class="mm-mb-8"
        novalidate
        @submit="onSubmit"
      >
        <m-m-input
          id="username"
          v-model="loginForm.email"
          type="email"
          name="username"
          inputmode="email"
          label="Email"
          placeholder="Enter your email"
          data-cy="username"
          required
          class="mm-mb-8"
          hide-asterisk
          :errors="v$.email.$errors"
          @blur="v$.email.$touch"
        />
        <input type="hidden" name="csrf_token" :value="csrfToken" />
        <input
          v-if="invitationToken"
          type="hidden"
          name="invitation_token"
          :value="invitationToken"
        />
        <m-m-button
          cy="log-in"
          class="mm-auth-view-login-continue-button-padding"
          variant="elevated"
          :type="buttonType"
          :is-full-width="true"
          :is-disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          @click="v$.$validate()"
        >
          Continue with email
        </m-m-button>
      </form>
      <form class="mm-mb-7" :action="loginWithMagicLinkUrl" method="post">
        <input type="hidden" name="csrf_token" :value="csrfToken" />
        <input type="hidden" name="username" :value="loginForm.email" />
        <m-m-button
          cy="continue-with-magic-link"
          variant="outlined"
          type="submit"
          :is-full-width="true"
        >
          <span class="mm-fw-500">Continue with magic link</span>
        </m-m-button>
      </form>
      <div class="mm-flex mm-flex-gap-3 mm-mb-18">
        <div>
          <m-m-icon icon="info" width="16px" height="16px" class="mm-mt-1" />
        </div>
        <div class="mm-auth-view-login__magic-link-desc mm-fw-400">
          We’ll email you a magic link to your registered email to sign in
          without a password.
        </div>
      </div>
      <div v-if="isEmailForm" class="mm-auth-view-link-signup">
        Don't have an account?&nbsp;
        <m-m-link
          :to="signupUrl"
          class="mm-auth-view-link-signup-button"
          cy="signup"
        >
          <span class="mm-auth-view-link-signup underline">Sign up</span>
        </m-m-link>
      </div>
      <div class="mm-auth-view-login-footer">
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
    <login-with-web-authn v-else-if="isWebAuthn" is-login />
    <login-with-email-o-t-p v-else-if="isEmailOTP" />
    <totp v-else-if="isTOTP" />
    <OrganizationSelect v-else-if="isOrganizationSelect" />
    <div
      v-else-if="isPassword"
      class="mm-flex mm-flex-align-center mm-flex-column mm-w-10"
    >
      <div class="mm-auth-view-back-link mm-mt-16">
        <div data-teleport="onboarding-back" />
      </div>
      <div v-if="logoSrc" class="mm-mb-15 mm-mx-auto">
        <img :src="logoSrc" class="mm-auth-view-logo" />
      </div>
      <div
        v-sanitize-html="$t('password.title')"
        class="mm-auth-view-content-title"
      ></div>
      <div
        v-sanitize-html="$t('password.subtitle')"
        class="mm-auth-view-content-subtitle"
      ></div>
      <m-m-alert
        v-if="isAlertVisible"
        :status="AlertTypes.Error"
        cy="login-form-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ errorDescription }}
      </m-m-alert>
      <form
        v-mm-focus-first
        :action="loginUrl"
        method="post"
        class="mm-w-10"
        data-cy="password-form"
        @submit="onSubmit"
      >
        <m-m-password
          id="password"
          ref="passwordField"
          v-model="loginForm.password"
          :is-full-width="true"
          name="password"
          label="Password"
          placeholder="Enter your password"
          cy="password"
          class="mm-mb-8"
        />
        <input type="hidden" name="csrf_token" :value="csrfToken" />
        <m-m-button
          cy="continue"
          class="mm-auth-view-login-continue-button mm-mb-8"
          variant="elevated"
          type="submit"
          :is-full-width="true"
          :loading="isButtonSubmitPasswordLoading"
          :is-disabled="isButtonSubmitPasswordLoading"
        >
          Continue
        </m-m-button>
      </form>
      <m-m-link
        :href="forgotPasswordUrl"
        data-cy="forgot-password"
        color="primary"
        class="mm-mt-21"
      >
        <span class="mm-fw-600">Forgot password?</span>
      </m-m-link>
    </div>
    <m-m-alert
      v-else
      :status="AlertTypes.Error"
      cy="login-form-alert"
      class="mm-mb-12"
      @close="onAlertClose"
    >
      {{ errorDescription }}
    </m-m-alert>
  </div>
</template>

<style scoped lang="scss">
.mm-auth-view-login {
  &-continue {
    padding: 8px 15px;

    &-button,
    &-button-padding {
      background-color: var(--branding-button-background-color);
      border: var(--branding-border);
      color: var(--branding-button-text-color);
    }
  }

  &-logo {
    align-self: center;
  }

  &-option {
    color: #344054;
  }

  &-footer {
    margin-top: 30px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__magic-link-desc {
    font-size: 14px;
    line-height: 20px;
    color: #475467;
  }
}
</style>

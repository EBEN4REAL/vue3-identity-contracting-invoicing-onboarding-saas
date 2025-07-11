<script setup lang="ts">
import { ComputedRef, computed, reactive, Ref, ref, onMounted } from "vue";
import {
  TypeSignupForm,
  TypeSignupFormRules,
  SignupValidatorType,
} from "~/auth/auth.types";
import { useVuelidate } from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import config from "~/mm.config.json";
import { useRoute } from "vue-router";
import LogoSVG from "~/assets/images/veriam_logo.svg";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { authService } from "~/auth/auth.service";
import { ERRORS_SIGNUP } from "~/auth/constants";
import { useFlag } from "@unleash/proxy-client-vue";
import { SignupStatus } from "~/signup/signup.types";
import { getUserEmail } from "~/auth/cookies";
import { useTranslation } from "i18next-vue";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";

const route = useRoute();
const error = route.query.error;
const errorDescription = error
  ? ERRORS_SIGNUP[error.toString() as keyof typeof ERRORS_SIGNUP]
  : "Something went wrong. Please try again.";
const status = route.query.status;
const nextUrl = route.query.next_url;
const csrfToken = route.query.csrf_token;
const sp = route.query.sp;
const brandingConfigStore = useBrandingConfigStore();
const isLoading: Ref<boolean> = ref(true);
const isGoogleOneTapEnabled = useFlag("google_one_tap");
const username = getUserEmail();
const { t } = useTranslation();

if (!nextUrl && !error) {
  authService.signup();
} else {
  isLoading.value = false;
}

const isButtonSubmitLoading: Ref<boolean> = ref(false);

const isAlertVisible: Ref<boolean> = ref(
  !!error || status === SignupStatus.SUCCESS,
);

const buttonType: ComputedRef<string> = computed(() =>
  v$.value.email.$invalid || signupForm.email.length === 0
    ? "button"
    : "submit",
);

const signupForm = reactive({
  email: username,
} as TypeSignupForm);
const signupFormRules: TypeSignupFormRules = {
  email: {
    required: helpers.withMessage("Email address is required", required),
    email: helpers.withMessage("Please enter a valid email address", email),
  },
};

const v$: SignupValidatorType = useVuelidate(signupFormRules, signupForm);

const signupUrl: ComputedRef<string> = computed(() => {
  let url = `/signup?next_url=${encodeURIComponent(nextUrl as string)}&csrf_token=${csrfToken}`;
  if (sp) {
    url += `&sp=${sp}`;
  }
  return url;
});
const loginUrl: ComputedRef<string> = computed(() => {
  let url = `/login?next_url=${encodeURIComponent(nextUrl as string)}&csrf_token=${csrfToken}`;
  if (sp) {
    url += `&sp=${sp}`;
  }
  return url;
});
const signupFormUrl = `${config.idp.url}/signup?next_url=${encodeURIComponent(`${nextUrl}`)}&sp=${sp}`;

const accountName: ComputedRef<string> = computed(
  () => `${brandingConfigStore.brandingConfigGetter?.name || "Veriam"}`,
);
const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);
const displayVeriamLogo: ComputedRef<boolean> = computed(
  () => !logoSrc.value && !sp,
);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () => v$.value.$invalid || isButtonSubmitLoading.value,
);

const isPreviousRouteLogin: ComputedRef<boolean> = computed(() =>
  (localStorage.getItem("previousPath") ?? "").includes("/login"),
);

const isShowNoAccountInfo: ComputedRef<boolean> = computed(
  () => isPreviousRouteLogin.value && isAlertVisible.value,
);
const subtitleTranslation: ComputedRef<string> = computed(() =>
  isShowNoAccountInfo.value
    ? "onboarding.check_email.subtitle_no_account"
    : "onboarding.check_email.subtitle",
);

const title: ComputedRef<string> = computed(() =>
  t(
    "singup.title",
    escapeObjectValuesForHtml({
      accountName: accountName.value,
    }),
  ),
);

const onboardingCheckEmailSubtitle: ComputedRef<string> = computed(() =>
  t(
    subtitleTranslation.value,
    escapeObjectValuesForHtml({
      userEmail: username,
    }),
  ),
);

const onChangeEmail = () => {
  window.location.href = signupUrl.value;
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onSubmit = () => {
  localStorage.setItem("previousPath", window.location.pathname);
  isButtonSubmitLoading.value = true;
};

onMounted(async () => {
  if (isGoogleOneTapEnabled.value && status !== SignupStatus.SUCCESS) {
    try {
      google.accounts.id.prompt();
    } catch (error) {
      console.error(error);
    }
  }
});
</script>

<template>
  <m-m-progress-circular
    v-if="isLoading"
    :size="128"
    :width="12"
    class="loader-centered"
  />
  <div v-else-if="status !== 'SUCCESS'" class="auth-card" data-cy="signup">
    <div class="mm-auth-view-container">
      <div class="mm-auth-view-logo-container">
        <LogoSVG
          v-show="displayVeriamLogo"
          id="modal-logo"
          class="mm-auth-view-logo"
          data-cy="default-logo"
        />
        <img v-if="logoSrc" :src="logoSrc" class="mm-auth-view-logo" />
      </div>
      <div v-sanitize-html="title" class="mm-auth-view-content-title" />
      <div class="mm-auth-view-content-subtitle">
        <div
          v-if="brandingConfigStore.brandingConfigGetter?.name"
          v-sanitize-html="$t('singup.subtitle')"
        ></div>
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
      <div class="mm-auth-view-button-group">
        <form
          v-mm-focus-first
          :action="`${config.idp.url}/login-google`"
          method="get"
        >
          <input type="hidden" name="next_url" :value="nextUrl" />
          <m-m-button
            cy="continue-with-google"
            variant="outlined-light"
            type="submit"
            icon-size="24px"
            prepend-icon="google"
            :is-full-width="true"
            class="mm-auth-view-social-button"
          >
            <span class="mm-auth-view-option">
              Continue
              <span class="mm-fw-500">with Google</span>
            </span>
          </m-m-button>
        </form>

        <form
          v-mm-focus-first
          :action="`${config.idp.url}/login-microsoft`"
          method="get"
        >
          <input type="hidden" name="next_url" :value="nextUrl" />
          <m-m-button
            cy="continue-with-microsoft"
            variant="outlined-light"
            type="submit"
            icon-size="24px"
            prepend-icon="microsoft"
            :is-full-width="true"
            class="mm-auth-view-social-button"
          >
            <span class="mm-auth-view-option">
              Continue
              <span class="mm-fw-500">with Microsoft</span>
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
        class="mm-mb-8"
        :action="signupFormUrl"
        method="post"
        novalidate
        @submit="onSubmit"
      >
        <input type="hidden" name="csrf_token" :value="csrfToken" />
        <m-m-input
          v-model="signupForm.email"
          name="email"
          type="email"
          inputmode="email"
          label="Email"
          placeholder="Enter your email"
          class="mm-mb-8"
          data-cy="input-signup-email"
          :errors="v$.email.$errors"
          @blur="v$.email.$touch"
        />
        <m-m-button
          cy="button-signup-submit"
          :type="buttonType"
          :is-full-width="true"
          class="mm-auth-view-button-submit"
          :is-disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          @click="v$.$validate()"
        >
          Continue with email
        </m-m-button>
      </form>

      <div class="mm-auth-view-options mm-page-subtitle--h2">
        Already have an account?&nbsp;
        <m-m-link :to="loginUrl" class="mm-auth-view-options options-link">
          <span class="mm-auth-view-link-signup underline">Login</span>
        </m-m-link>
      </div>
      <div class="mm-auth-view-link-footer">
        By continuing, I agree with Veriam's
        <m-m-link
          href="/tc/terms.pdf"
          target="_blank"
          class="mm-auth-view-link-footer-decorated"
          >&nbsp;Terms of service&nbsp;
        </m-m-link>
        and
        <m-m-link
          href="/tc/privacy.pdf"
          target="_blank"
          class="mm-auth-view-link-footer-decorated"
          >&nbsp;Privacy policy
        </m-m-link>
      </div>
    </div>
  </div>

  <div v-else class="mm-auth-view-check-your-email" data-cy="check-your-email">
    <div v-if="logoSrc" class="mm-mb-15">
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <div
      v-sanitize-html="$t('onboarding.check_email.title')"
      class="mm-auth-view-content-title mm-mb-6"
    ></div>
    <div
      v-sanitize-html="onboardingCheckEmailSubtitle"
      class="mm-auth-view-content-subtitle mm-mb-16"
    />
    <div class="mm-auth-view-options">
      <div class="mm-my-8">
        Not correct? &nbsp;
        <m-m-button variant="text" @click="onChangeEmail">
          <span class="font-weight-600"> Change email </span>
        </m-m-button>
      </div>
    </div>
    <div class="mm-auth-view-back-link mm-mt-16">
      <div data-teleport="onboarding-back" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.options-link {
  font-weight: 600;
}

.mm-auth-view-button-submit {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}

.mm-auth-view-social-button {
  font-weight: 400;
}

.mm-auth-view {
  &-option {
    color: #344054;
  }

  &-options {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: #475467;

    & span {
      color: #475467;
    }

    button {
      display: inline;
      padding: 0;
      color: #072e51;

      &:hover {
        border-color: transparent;
        background-color: transparent;
      }

      &:active {
        outline: transparent;
        background-color: transparent;
      }
    }
  }

  &-check-your-email {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 490px;
    box-shadow: 0px 5px 15px 0px #0000001f;
    border-radius: 12px;
    background: white;
    padding: 30px 60px 20px;
  }

  &-link-footer,
  &-link-footer-decorated {
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: #9ea5af;
    margin-top: 30px;

    &-decorated {
      color: #9ea5af;
      font-size: 12px;
      text-decoration: underline;
      margin-top: 0;
    }
  }

  &-container {
    display: flex;
    flex-direction: column;
  }

  &-button-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
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

  &-logo {
    align-self: center;
  }
}

/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-auth-view-check-your-email {
    box-shadow: none;
    background: transparent;
    width: calc(100% - 30px);
    padding: 0;
    min-width: auto;
  }
  .mm-auth-view-back-link {
    left: 10px;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, ComputedRef, Ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { TypeMFAMethod } from "../../auth.types";
import { MFAMethodsEnum, MFARequiredEnum } from "./enums";
import config from "~/mm.config.json";
import { ERRORS_SIGNUP } from "~/auth/constants";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { getUserEmail } from "../../cookies";

type MFAMethodKey = keyof typeof MFAMethodsEnum;

const route = useRoute();

const isAlertVisible: Ref<boolean> = ref(!!route.query.error);

const { mfa_methods, csrf_token, next_url, mfa_required } = route.query;

const brandingConfigStore = useBrandingConfigStore();

const parsedMFAMethods: Ref<TypeMFAMethod[]> = ref([]);
const selectedMFAMethod: Ref<string> = ref("");
const signupMFARef = ref<HTMLFormElement | null>(null);
const username = getUserEmail();

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const isSkipMFA: ComputedRef<boolean> = computed(() =>
  Boolean(mfa_required && mfa_required === MFARequiredEnum.NOTREQUIRED),
);

const errorDescription = computed(() => {
  const errorKey = route.query.error?.toString() || "";
  return errorKey && errorKey in ERRORS_SIGNUP
    ? ERRORS_SIGNUP[errorKey as keyof typeof ERRORS_SIGNUP]
    : "Something went wrong. Please try again.";
});

const signupWithMFAUrl: ComputedRef<string> = computed(() => {
  const baseUrl = `${config.idp.url}/signup/mfa`;
  const url = new URL(baseUrl);

  if (isSkipMFA.value && !selectedMFAMethod.value) {
    url.searchParams.append("skip", "true");
  }

  return url.toString();
});

const getIcon = (method: string): string => {
  const iconMapping: { [key: string]: string } = {
    TOTP: "totp",
    WEBAUTHN: "finger-print",
    EMAIL_OTP: "email-top",
  };
  return iconMapping[method] || "❓";
};

const initializeMFAMethods = () => {
  const MFA_METHODS = mfa_methods ? (mfa_methods as string).split(",") : [];
  parsedMFAMethods.value = MFA_METHODS.map((mfaMethod: string) => ({
    selected: false,
    name: mfaMethod,
    icon: getIcon(mfaMethod),
  }));
};

const selectMethod = (selectedMethod: TypeMFAMethod) => {
  selectedMFAMethod.value = selectedMethod.name;
  parsedMFAMethods.value.forEach((method) => {
    method.selected = method.name === selectedMethod.name;
  });
  if (signupMFARef.value) {
    setTimeout(() => {
      signupMFARef.value?.submit();
    }, 100);
  }
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(() => {
  initializeMFAMethods();
});
</script>

<template>
  <div class="mm-auth-view-web-authn">
    <div
      v-if="logoSrc"
      class="mm-mb-15 mm-mx-auto mm-flex mm-flex-justify-center mm-flex-align-center"
    >
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <div class="mm-auth-view-content-title mm-mb-6">
      Two-factor authentication
    </div>
    <div class="mm-auth-view-content-subtitle mm-mb-12">
      Choose a multi-factor authentication method to set up
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
    <form
      ref="signupMFARef"
      v-mm-focus-first
      :action="signupWithMFAUrl"
      method="post"
      class="mm-w-10"
    >
      <div
        v-for="method in parsedMFAMethods"
        :key="method.name"
        @click="selectMethod(method)"
      >
        <div
          class="mm-flex mm-flex-justify-between mm-flex-align-center mm-auth-view-web-authn-container mm-mb-5"
          :class="{ selected: method.selected }"
          :data-cy="`mfa-method-selected-${method.name}`"
        >
          <div class="mm-flex mm-flex-gap-5 mm-flex-align-center">
            <m-m-icon :icon="method.icon" class="mm-mt-1" />
            <span>{{ MFAMethodsEnum[method.name as MFAMethodKey] }}</span>
          </div>
          <div>
            <m-m-icon icon="arrow-right-visible" width="15px" height="12px" />
          </div>
        </div>
      </div>
      <input type="hidden" name="username" :value="username" />
      <input type="hidden" name="csrf_token" :value="csrf_token" />
      <input
        v-if="selectedMFAMethod"
        type="hidden"
        name="method"
        :value="selectedMFAMethod"
      />
      <input type="hidden" name="next_url" :value="next_url" />
      <m-m-button
        v-if="isSkipMFA"
        cy="continue"
        variant="elevated"
        type="submit"
        :is-full-width="true"
        class="mm-auth-view-button-submit mm-mb-8"
      >
        Skip
      </m-m-button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.mm-auth-view-button-submit {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.mm-auth-view-web-authn {
  min-width: 510px;
  border-radius: 12px;
  background: white;
  padding: 30px 60px 30px;
  box-shadow: 0px 5px 15px 0px #0000001f;

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
  .mm-auth-view-web-authn {
    box-shadow: none;
    background: transparent;
    width: calc(100% - 30px);
    padding: 0;
    min-width: auto;
  }
}
</style>

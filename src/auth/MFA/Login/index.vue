<script setup lang="ts">
import { ref, Ref, onMounted, ComputedRef, computed } from "vue";
import { useRoute } from "vue-router";
import { TypeMFAMethod } from "../../auth.types";
import { MFAMethodsEnum } from "./enums";
import config from "~/mm.config.json";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { ERRORS_SIGNUP } from "~/auth/constants";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { getUserEmail } from "~/auth/cookies";

type MFAMethodKey = keyof typeof MFAMethodsEnum;

const route = useRoute();

const { mfa_methods, csrf_token, next_url } = route.query;
const username = getUserEmail();

const brandingConfigStore = useBrandingConfigStore();

const isAlertVisible: Ref<boolean> = ref(!!route.query.error);

const errorDescription = computed(() => {
  const errorKey = route.query.error?.toString() || "";
  return errorKey && errorKey in ERRORS_SIGNUP
    ? ERRORS_SIGNUP[errorKey as keyof typeof ERRORS_SIGNUP]
    : "Something went wrong. Please try again.";
});

const parsedMFAMethods: Ref<TypeMFAMethod[]> = ref([]);
const selectedMFAMethod: Ref<string> = ref("");
const loginMFARef = ref<HTMLFormElement | null>(null);

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const loginWithMFAUrl: ComputedRef<string> = computed(
  () =>
    `${config.idp.url}/login-mfa?next_url=${encodeURIComponent(`${next_url}`)}`,
);

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
  if (loginMFARef.value) {
    setTimeout(() => {
      loginMFARef.value?.submit();
    }, 200);
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
      Choose a multi-factor authentication method to continue
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
      ref="loginMFARef"
      v-mm-focus-first
      :action="loginWithMFAUrl"
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
    </form>
  </div>
</template>

<style scoped lang="scss">
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

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import VerificationRequired from "./VerificationRequired.vue";
import VerifyWithBackupCode from "./VerifyWithBackupCode.vue";
import { useBrandingConfigStore } from "~/stores/brandingConfig";

const state: Ref<"code" | "backup-code"> = ref("code");
const isBackNavigation: Ref<boolean> = ref(false);
const route = useRoute();
const brandingConfigStore = useBrandingConfigStore();

const backupCodeErrors = [
  "LOGIN_INVALID_BACKUP_CODE",
  "LOGIN_USED_BACKUP_CODE",
  "LOGIN_INVALID_BACKUP_CODE_ACCOUNT_WILL_BE_LOCKED",
  "LOGIN_USED_BACKUP_CODE_ACCOUNT_WILL_BE_LOCKED",
];

const error: ComputedRef<string> = computed(
  () => (route.query?.error as string) || "",
);

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const isBackupCodeForm: ComputedRef<boolean> = computed(
  () =>
    (state.value === "backup-code" || backupCodeErrors.includes(error.value)) &&
    !isBackNavigation.value,
);

const isVerificationForm: ComputedRef<boolean> = computed(
  () => !isBackupCodeForm.value,
);

const onSetState = (newState: "code" | "backup-code") => {
  state.value = newState;
  isBackNavigation.value = newState === "code";
};
</script>

<template>
  <div class="mm-flex mm-flex-align-center mm-flex-justify-center">
    <img
      v-if="logoSrc"
      class="mm-auth-view-logo"
      :src="logoSrc"
      data-cy="brand-logo"
    />
  </div>
  <verification-required
    v-if="isVerificationForm"
    data-cy="verification-required"
    @set-state="onSetState"
  />
  <verify-with-backup-code
    v-if="isBackupCodeForm"
    data-cy="verify-with-backup-code"
    @set-state="onSetState"
  />
</template>

<style scoped lang="scss">
.mm-auth-view-totp {
  min-width: 510px;
  border-radius: 12px;
  background: white;
  padding: 0 60px 30px;
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

<script setup lang="ts">
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import { usersService } from "~/users/users.service";
import DialogConfirmResetWebAuthentication from "./Dialogs/DialogResetWebAuthentication.vue";
import {
  UserRead,
  WebAuthnOptionsRead,
  WebAuthnRead,
  WebAuthnStatusRead,
} from "~/iam/iam.types";
import { TypeDialogConfirmResetWebAuthenticationUser } from "./users.types";
import { startRegistration } from "@simplewebauthn/browser";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const props = defineProps({
  hasPassword: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object as PropType<UserRead | null>,
    default: null,
  },
});

const emit = defineEmits(["get-user-mfa"]);

const loading: Ref<boolean> = ref(true);
const isWebAuthnConfirmed: Ref<boolean> = ref(false);
const isDialogConfirmResetWebAuthenticationOpen: Ref<boolean> = ref(false);
const userInfo: Ref<TypeDialogConfirmResetWebAuthenticationUser | null> =
  ref(null);
const webAuthOptions: Ref<WebAuthnOptionsRead | null> = ref(null);
const credential: Ref<string> = ref("");
const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);

const isButtonSetupBiometricsDisabled: ComputedRef<boolean> = computed(
  () => isButtonSubmitDisabled.value || isButtonSubmitLoading.value,
);

const webAuthToolTipText: ComputedRef<string> = computed(
  () =>
    "Use the biometrics of your device (fingerprint / face recogniction), device account (Google or Apple) or hardware token (eg Ubikey) for authentication",
);

const getMeUserWebAuthn = async () => {
  loading.value = true;
  try {
    const webauthn: WebAuthnRead = await usersService.getUserMeWebAuthn();
    isWebAuthnConfirmed.value = webauthn.confirmed;
  } catch (err) {
    if (err.response.status === 404) {
      isWebAuthnConfirmed.value = false;
    }
  } finally {
    loading.value = false;
  }
};

const updateMeUserWebAuthn = async () => {
  loading.value = true;
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;
    const payload = { credential: credential.value };
    const webauthn: WebAuthnStatusRead =
      await usersService.updateUserMeWebAuthn(payload);
    isWebAuthnConfirmed.value = webauthn.confirmed;
    eventBus.$emit("onShowToast", {
      text: "Biometrics setup has been verified and confirmed successfully",
      status: "info",
    });
  } catch (err) {
    if (err.response.status === 404) {
      isWebAuthnConfirmed.value = false;
    }
  } finally {
    loading.value = false;
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
    emit("get-user-mfa");
  }
};

const openDialogConfirmResetwebAuthentication = () => {
  isDialogConfirmResetWebAuthenticationOpen.value = true;
};

const closeDialogConfirmResetWebAuthentication = () => {
  isDialogConfirmResetWebAuthenticationOpen.value = false;
  emit("get-user-mfa");
};

const onSubmit = async () => {
  try {
    const webAuthnOptions: WebAuthnOptionsRead =
      await usersService.setupUserMeWebAuthn();
    await setupWebAuthentication(webAuthnOptions);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to setup biometrics",
      status: "error",
    });
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};

const setupWebAuthentication = async (
  webAuthnOptionsObj: WebAuthnOptionsRead,
) => {
  webAuthOptions.value = webAuthnOptionsObj;
  if (webAuthOptions.value?.webauthn_options) {
    try {
      const parsedWebauthnOptions = JSON.parse(
        atob(webAuthOptions.value?.webauthn_options as string),
      );
      const regResp = await startRegistration(parsedWebauthnOptions);
      credential.value = JSON.stringify(regResp);
      await updateMeUserWebAuthn();
    } catch (error) {
      eventBus.$emit("onShowToast", {
        text: "Biometrics registration failed",
        status: "error",
      });
    }
  }
};

const submitConfirmResetWebAuthentication = () => {
  isWebAuthnConfirmed.value = false;
};

const onResetwebAuthentication = () => {
  userInfo.value = {
    user_id: props?.user?.id || "",
    first_name: props?.user?.first_name || "",
    last_name: props?.user?.last_name || "",
    email: props?.user?.email || "",
  };
  openDialogConfirmResetwebAuthentication();
};

onMounted(async () => {
  await getMeUserWebAuthn();
});
</script>

<template>
  <div
    class="mm-flex mm-flex-justify-between mm-flex-align-center mm-mb-10"
    data-cy="webauthn-setting"
  >
    <div class="mm-flex mm-flex-gap-5 mm-flex-align-center">
      <m-m-icon icon="finger-print" width="19.5px" height="19.5px" />
      <span>Biometrics</span>
      <div>
        <m-m-icon icon="info" width="18px" height="18px" />
        <m-m-tooltip display-position="toRight">
          {{ webAuthToolTipText }}
        </m-m-tooltip>
      </div>
    </div>
    <div>
      <m-m-button
        v-if="!isWebAuthnConfirmed"
        variant="outlined"
        prepend-icon="shield-check-outline"
        cy="button-setup-web-authentication"
        :loading="isButtonSubmitLoading"
        :is-disabled="isButtonSetupBiometricsDisabled"
        @click="onSubmit"
      >
        Setup biometrics
        <m-m-tooltip max-width="300px" display-position="toLeft">
          Biometrics might not work with an enabled password manager plugin
        </m-m-tooltip>
      </m-m-button>
      <m-m-button
        v-else
        variant="text-danger"
        prepend-icon="trash"
        cy="button-reset-web-authentication"
        :loading="loading"
        @click="onResetwebAuthentication"
      >
        Reset biometrics
      </m-m-button>
    </div>
  </div>
  <dialog-confirm-reset-web-authentication
    :is-open="isDialogConfirmResetWebAuthenticationOpen"
    cy="dialog-confirm-reset-web-authentication"
    :data="userInfo"
    @update="submitConfirmResetWebAuthentication"
    @close="closeDialogConfirmResetWebAuthentication"
  />
</template>

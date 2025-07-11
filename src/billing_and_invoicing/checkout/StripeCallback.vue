<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { AuthStorageKeys } from "~/auth/auth.types";
import { AgreementRead } from "~/policies/policies.types";
import { policiesClientService } from "~/policies/policies.client.service";
import { iamClientService } from "~/iam/iam.client.service";
import { OAuthManager } from "~/common/services/oauth.client.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import DialogPaymentSuccessful from "~/organizations/licenses/LicenseDetails/Dialogs/DialogPaymentSuccessful.vue";
import { clearIntervalAsync, setIntervalAsync } from "set-interval-async";
import { useRoute } from "vue-router";

const route = useRoute();
const isPaymentSuccessfullDialogOpen: Ref<boolean> = ref(true);
const isAgreementActive: Ref<boolean> = ref(false);
const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
const organizationId: Ref<string | null> = ref(null);
const agreementId: string | null = urlParams.get("license_id");
const agreement: Ref<AgreementRead | null> = ref(null);
const serviceProviderId: Ref<string> = ref("");
const clientId: Ref<string> = ref("");
const code = route.query.code?.toString() || "";
const nextUrl = route.query.next_url?.toString() || "";
const getAgreement = async (initialFetch = false) => {
  try {
    const sessionStorage = localStorage.getItem(AuthStorageKeys.PLAN_PAGE);
    let nextUrl = "";
    if (sessionStorage) {
      const session = JSON.parse(sessionStorage);
      nextUrl = session.nextUrl || "";
    }

    agreement.value = await policiesClientService.getServiceConsumerAgreement(
      organizationId.value as string,
      agreementId as string,
    );
    isAgreementActive.value = agreement.value?.active === true;
    if (isAgreementActive.value) {
      window.location.href = nextUrl || "";
    }

    if (initialFetch && !isAgreementActive.value) {
      pollGetAgreement();
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to get agreement type",
      status: "error",
    });
  }
};

const loadServiceProvider = async () => {
  try {
    const oAuthManager = new OAuthManager(
      code,
      nextUrl,
      AuthStorageKeys.PLAN_PAGE,
    );
    await oAuthManager.init();
    iamClientService.setOAuthManager(oAuthManager);
    policiesClientService.setOAuthManager(oAuthManager);
    clientId.value = oAuthManager.getClientId() ?? "";
    serviceProviderId.value = oAuthManager.getServiceProviderId() || "";
    organizationId.value = oAuthManager.getOrganizationId() || "";
  } catch (error) {
    console.error(error);
  }
};

const pollGetAgreement = async () => {
  const interval = setIntervalAsync(async () => {
    await getAgreement(false);
    if (isAgreementActive.value) {
      await clearIntervalAsync(interval);
    }
  }, 3000);
};

const savePaymentClientSecrets = () => {
  const paymentIntentClientSecret: string | null = urlParams.get(
    "payment_intent_client_secret",
  );
  const setupIntentClientSecret: string | null = urlParams.get(
    "setup_intent_client_secret",
  );

  if ((paymentIntentClientSecret || setupIntentClientSecret) && agreementId) {
    if (paymentIntentClientSecret) {
      localStorage.setItem(
        "payment_intent_client_secret",
        paymentIntentClientSecret,
      );
    } else if (setupIntentClientSecret) {
      localStorage.setItem(
        "setup_intent_client_secret",
        setupIntentClientSecret,
      );
    }
    localStorage.setItem("current_agreement_id", agreementId);
  }
};

onMounted(async () => {
  organizationId.value = urlParams.get("organization_id") || null;
  await loadServiceProvider();
  savePaymentClientSecrets();
  await getAgreement(true);
});
</script>
<template>
  <m-m-progress-circular
    v-if="!isPaymentSuccessfullDialogOpen"
    :size="128"
    :width="12"
    class="loader-centered"
  />
  <DialogPaymentSuccessful
    v-else
    :is-open="!isAgreementActive && isPaymentSuccessfullDialogOpen"
    @close="isPaymentSuccessfullDialogOpen = false"
  />
</template>

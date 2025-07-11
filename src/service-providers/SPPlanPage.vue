<script setup lang="ts">
import { authService } from "~/auth/auth.service";
import { useRoute } from "vue-router";
import { computed, ComputedRef, onMounted, Ref, ref } from "vue";
import { OAuthManager } from "~/common/services/oauth.client.service";
import { AuthStorageKeys } from "~/auth/auth.types";
import { iamClientService } from "~/iam/iam.client.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { AgreementType, OauthClientPlanPageRead } from "~/iam/iam.types";
import DialogLegalDocsActivation from "~/service-providers/Dialogs/DialogLegalDocsActivation.vue";
import DialogSuccessSelfServiceCheckout from "~/service-providers/Dialogs/DialogSuccessSelfServiceCheckout.vue";
import LogoSVG from "~/assets/images/veriam-logo.svg";
import { convertToMainUnit } from "~/mm_ui_kit/src/helpers/priceUnitConverter";
import { getPriceModel } from "~/billing_and_invoicing/billing_and_invoicing.types";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { AgreementReadExtended } from "~/organizations/licenses/licenses.types";
import { policiesClientService } from "~/policies/policies.client.service";
import { AgreementRead } from "~/policies/policies.types";
import { EntityType } from "~/billing_and_invoicing/checkout/types";

const route = useRoute();
const brandingConfigStore = useBrandingConfigStore();
const code = route.query.code?.toString() || "";
const nextUrl = route.query.next_url?.toString() || "";

const isLoading: Ref<boolean> = ref(true);
const showSuccessModal: Ref<boolean> = ref(false);
const showLegalDocsModal: Ref<boolean> = ref(false);
const serviceProviderId: Ref<string> = ref("");
const clientId: Ref<string> = ref("");
const organizationId: Ref<string> = ref("");
const licenseProcessing: Ref<boolean> = ref(false);
const agreement: Ref<AgreementReadExtended | null> = ref(null);
const selectedPlan: Ref<AgreementType | null> = ref(null);
const response: Ref<AgreementRead | null> = ref(null);
const oAuthClientDetails: Ref<OauthClientPlanPageRead | null> = ref(null);
const isRedirecting: Ref<boolean> = ref(false);
const disableUnselectedPlans: Ref<boolean> = ref(false);
const logout = () => {
  if (nextUrl !== "") {
    authService.logoutWithNextUrl(nextUrl);
  } else {
    authService.logout();
  }
};

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const orgName: ComputedRef<string> = computed(
  () => `${brandingConfigStore.brandingConfigGetter?.name || "Veriam"}`,
);

const buttonStyles = computed(() => {
  if (brandingConfigStore.brandingConfigGetter) {
    return {
      backgroundColor:
        brandingConfigStore.brandingConfigGetter.button_background_color,
      color: brandingConfigStore.brandingConfigGetter.button_text_color,
    };
  }
  return {};
});

const sortedPlanPageData = computed(() => {
  if (!oAuthClientDetails.value) {
    return [];
  }
  return oAuthClientDetails.value?.plan_page_data?.agreement_types
    .slice()
    .sort((a, b) => a.self_service_order - b.self_service_order);
});

const formattedPrice = (plan: AgreementType) =>
  convertToMainUnit(Number(plan.price.amount), plan.price.currency as string)
    .formatted;

const pricingType = (item: string) =>
  item === "FLAT_FEE_RECURRING" ? "Month" : getPriceModel(item);

const getOAuthClientDetails = async () => {
  try {
    oAuthClientDetails.value =
      await iamClientService.getOAuthClientPagePageDetails(
        serviceProviderId.value,
        clientId.value,
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to get Application details",
      status: "error",
    });
  }
};

const handleClose = () => {
  showSuccessModal.value = false;
  showLegalDocsModal.value = false;
};

const pollGetLicense = async () => {
  const interval = setInterval(async () => {
    await getAgreement(false);
    if (agreement.value?.active === true) {
      licenseProcessing.value = false;
      clearInterval(interval);
    }
  }, 4000);
};

const getAgreement = async (initialFetch = false) => {
  isLoading.value = true;
  try {
    agreement.value = await policiesClientService.getServiceConsumerAgreement(
      organizationId.value,
      response.value?.id as string,
    );
    licenseProcessing.value = !agreement.value?.active;

    if (agreement.value?.active === true) {
      window.location.href = decodeURIComponent(nextUrl);
    }

    if (initialFetch && licenseProcessing.value) {
      await pollGetLicense();
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to get Agreement",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  await getAgreement(true);
};

const onSelectPlan = async (plan: AgreementType) => {
  try {
    disableUnselectedPlans.value = true;
    isRedirecting.value = true;
    response.value = await policiesClientService.signUpForAgreementType(
      organizationId.value,
      plan.id as string,
    );

    if (plan.price?.billing_type === "FREE" || !plan.price?.billing_type) {
      if (plan.requires_legal_documents) {
        selectedPlan.value = { ...plan, logoSrc: logoSrc.value };
        showLegalDocsModal.value = true;
      } else {
        selectedPlan.value = plan;
        showSuccessModal.value = true;
      }
    } else {
      if (response.value.id) {
        window.location.href = `/checkout/${response.value.id}?code=${code}&next_url=${encodeURIComponent(nextUrl)}&isPlanPage=true&entity_type=${EntityType.SP}`;
      }
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error signing up for a Plan",
      status: "error",
    });
  } finally {
    disableUnselectedPlans.value = false;
    isRedirecting.value = false;
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
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadServiceProvider();
  await getOAuthClientDetails();
});
</script>

<template>
  <m-m-progress-circular
    v-if="isLoading"
    :size="128"
    :width="12"
    class="loader-centered"
  />
  <div v-else>
    <div class="choose-plan--container">
      <div class="choose-plan">
        <div class="choose-plan--section">
          <img
            v-if="logoSrc"
            class="mm-auth-view-logo"
            :src="logoSrc"
            data-cy="brand-logo"
          />
          <LogoSVG v-else class="logo" data-cy="default-logo" />
          <div class="mm-page-title mm-page-title--h1 mm-mt-4">
            Select a {{ orgName }} license
          </div>
        </div>
        <div class="choose-plan--scrollable mm-mt-18">
          <div class="mm-flex mm-flex-nowrap mm-flex-gap-8">
            <m-m-pricing-card
              v-for="(plan, index) in sortedPlanPageData"
              :key="index"
              :product-name="plan.name"
              :price="formattedPrice(plan)"
              :pricing-type="pricingType(plan.price?.billing_type)"
              button-text="Continue"
              :button-color="buttonStyles"
              :disabled="disableUnselectedPlans"
              :loading="isRedirecting"
              @button-click="onSelectPlan(plan)"
            >
              <template #princing-card-message>
                <div>
                  {{ plan.description }}
                </div>
              </template>
              <template
                v-if="plan.marketing_features?.length"
                #included-products
              >
                <div
                  class="choose-plan--title mm-page-subtitle--h2 font-weight-700 mm-mb-6"
                >
                  What's Included
                </div>
                <ul class="choose-plan--list mm-page-subtitle--h2">
                  <li
                    v-for="(feature, elem) in plan.marketing_features"
                    :key="elem"
                  >
                    {{ feature }}
                  </li>
                </ul>
              </template>
            </m-m-pricing-card>
          </div>
        </div>
      </div>
    </div>
    <DialogSuccessSelfServiceCheckout
      v-if="showSuccessModal"
      :is-open="showSuccessModal"
      :org-name="orgName"
      :org-id="organizationId"
      @close="handleClose"
      @submit="handleSubmit"
    />
    <DialogLegalDocsActivation
      v-if="selectedPlan && showLegalDocsModal"
      :is-open="showLegalDocsModal"
      :selected-plan="selectedPlan"
      :service-consumer-id="organizationId"
      @close="handleClose"
      @submit="handleSubmit"
    />
    <m-m-button
      variant="outlined"
      min-width="160px"
      class="button-logout"
      @click="logout"
    >
      Logout
    </m-m-button>
  </div>
</template>

<style scoped lang="scss">
.button-logout {
  position: fixed;
  right: 20px;
  top: 40px;
  z-index: 101;
}

.choose-plan {
  &--container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0px 15px 35px 0px #3c425714;
    width: fit-content;
    padding: 24px;
    @media (max-width: $breakpoint-xs) {
      width: calc(100vw - 30px);
      padding: 10px;
    }
  }

  &--title {
    text-align: left;
  }

  &--list {
    list-style: none;
    text-align: left;

    & li {
      list-style-type: disc;
      margin-left: 16px;
      color: #6d7480;
    }
  }

  .logo {
    width: 80px;
    height: 24px;
  }

  &--section {
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (max-width: $breakpoint-xs) {
      text-align: left;
    }
  }

  &--scrollable {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    min-width: 100%;
    max-width: 1150px;
    justify-content: space-evenly;
    @media (max-width: $breakpoint-xs) {
      max-width: none;
    }
  }

  .mm-pricing-card {
    @media (max-width: $breakpoint-xs) {
      max-width: 100px;
    }
  }
}
</style>

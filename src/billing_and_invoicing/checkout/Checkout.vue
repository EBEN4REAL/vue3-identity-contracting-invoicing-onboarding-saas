<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import { helpers, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { convertToMainUnit } from "~/mm_ui_kit/src/helpers/priceUnitConverter";
import { LegalDocumentTypeWithLegalDocumentRead } from "~/organizations/licenses/legal-documents.types";
import { BillingStatus, LegalDocumentStatus } from "~/policies/policies.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import config from "~/mm.config.json";
import {
  AgreementExtendedRead,
  BillingAddressRead,
  getBillingPeriod,
  StripePaymentIntent,
} from "~/billing_and_invoicing/billing_and_invoicing.types";
import {
  TypeUpdateOrganizationBillingAddressFormRules,
  TypeValidatorUpdateOrganizationBillingAddress,
} from "~/organizations/organizations.types";
import DialogSuccessSelfServiceCheckout from "~/service-providers/Dialogs/DialogSuccessSelfServiceCheckout.vue";
import { policiesService } from "~/service-providers/policies.service";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { billingAndInvoicingService } from "~/billing_and_invoicing/billing_and_invoicing.service";
import { legalDocumentsService } from "~/service-providers/legal-documents.service";
import { OAuthManager } from "~/common/services/oauth.client.service";
import { AuthStorageKeys } from "~/auth/auth.types";
import { policiesClientService } from "~/policies/policies.client.service";
import { billingAndInvoicingClientService } from "~/billing_and_invoicing/billing_and_invoicing.client.service";
import { contractingClientService } from "~/contracting/contracting.client.service";
import {
  BillingServiceType,
  ContractingServiceType,
  EntityType,
  PoliciesServiceType,
} from "./types";

const entityType: ComputedRef<EntityType> = computed(
  () => (route.query.entity_type || EntityType.SC) as EntityType,
);

const policiesServiceMap: Record<EntityType, PoliciesServiceType> = {
  [EntityType.SP]: policiesClientService,
  [EntityType.SC]: policiesService,
};

const contractingServiceMap: Record<EntityType, ContractingServiceType> = {
  [EntityType.SP]: contractingClientService,
  [EntityType.SC]: legalDocumentsService,
};

const billingServiceMap: Record<EntityType, BillingServiceType> = {
  [EntityType.SP]: billingAndInvoicingClientService,
  [EntityType.SC]: billingAndInvoicingService,
};

const selectedPoliciesService: ComputedRef<PoliciesServiceType> = computed(
  () => policiesServiceMap[entityType.value],
);
const selectedContractingService: ComputedRef<ContractingServiceType> =
  computed(() => contractingServiceMap[entityType.value]);
const selectedBillingService: ComputedRef<BillingServiceType> = computed(
  () => billingServiceMap[entityType.value],
);

// Route and state variables
const route = useRoute();
const brandingConfigStore = useBrandingConfigStore();
const code = route.query.code?.toString() || "";
const nextUrl = route.query.next_url?.toString() || "";
const agreementId = route.params.agreement_id;

const isLoading: Ref<boolean> = ref(false);
const paymentLoading: Ref<boolean> = ref(false);
const isPaymentSuccessful: Ref<boolean> = ref(false);
const serviceConsumerId: Ref<string | null> = ref(null);
const serviceProviderId: Ref<string | null> = ref(null);
const serviceProviderName: Ref<string | null> = ref(null);
const agreementBillingDetails: Ref<AgreementExtendedRead | null> = ref(null);
const checkoutSession: Ref<StripePaymentIntent | null> = ref(null);
const legalDocuments: Ref<LegalDocumentTypeWithLegalDocumentRead[] | null> =
  ref(null);
const signedLegalDocuments = ref([]);
const legalDocNotSigned = ref(false);
let elements = null;
// TODO: Implement vue-stripe plugin once vue3 support is available
const stripe = Stripe(config.stripe_publishable_key);
// anchor link ref type
const downloadLink: Ref<HTMLAnchorElement | null> = ref(null);
const isLoadingBillingDetails = ref(false);

// Steps for the multi-step form
const steps = [{ title: "Billing Details" }, { title: "Payment Details" }];
const activeStep = ref(0);

// Billing address state
const billingAdress: Ref<BillingAddressRead> = ref({
  country: "",
  address_line_1: "",
  address_line_2: null,
  postal_code: "",
  town_city: "",
  id: "",
  service_consumer_id: "",
});

const displaySuccessDialog = computed(
  () => entityType.value === EntityType.SP && isPaymentSuccessful.value,
);
// Computed properties for price details, currency, billing type and logo url
const paymentAmount = computed(() => {
  return convertToMainUnit(
    Number(agreementBillingDetails.value?.prices[0]?.amount || 0),
    (agreementBillingDetails.value?.prices[0]?.currency as string) || "EUR",
  ).formatted;
});

const isUserBasedRecurring = computed(() => {
  return (
    agreementBillingDetails.value?.agreement_type.billing_type ===
    "USER_BASED_RECURRING"
  );
});

const billingType = computed(() => {
  const type = agreementBillingDetails.value?.agreement_type.billing_type;
  if (type === "USER_BASED_RECURRING") {
    return "Per user";
  }
  return type
    ?.toLowerCase()
    .replace(/_/g, "-")
    .replace(/\b\w/g, (l) => l.toUpperCase());
});

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

// Validation rules for the billing address form
const billingFormRules: TypeUpdateOrganizationBillingAddressFormRules = {
  country: { required: helpers.withMessage("Country is required", required) },
  address_line_1: {
    required: helpers.withMessage("Address Line 1 is required", required),
  },
  town_city: {
    required: helpers.withMessage("Town or city required", required),
  },
  postal_code: {
    required: helpers.withMessage("Postal code is required", required),
  },
};

// Vuelidate instance for form validation
const v$: TypeValidatorUpdateOrganizationBillingAddress = useVuelidate(
  billingFormRules,
  billingAdress,
);

const billingTypeMessage = computed(() => {
  const billingType =
    agreementBillingDetails.value?.agreement_type?.billing_type;

  if (billingType === "USER_BASED_RECURRING") {
    return "Your card will not be charged right now, it is only being validated for billing at the end of the month.";
  } else if (billingType !== "FREE" && billingType !== "ONCE_OFF") {
    return "Card will automatically be billed on this day every month unless subscription is cancelled.";
  } else if (billingType === "ONCE_OFF") {
    return "This is a once-off charge.";
  }
  return "";
});

// Fetch agreement billing details
const getAgreementBillingDetails = async () => {
  try {
    if (!serviceConsumerId.value) return;
    agreementBillingDetails.value =
      await selectedBillingService.value.getAgreementBillingDetails(
        serviceConsumerId.value as string,
        agreementId as string,
      );
  } catch (error) {
    console.error("Error fetching agreement billing details", error);
  }
};

// Fetch legal documents
const getLegalDocs = async () => {
  try {
    if (!serviceConsumerId.value) return;
    const legalDocumentsResponse =
      await selectedContractingService.value.getLegalDocumentTypesByAgreementTypeId(
        serviceConsumerId.value as string,
        agreementBillingDetails.value?.agreement_type_id as string,
        {
          fully_signed: false,
          limit: "50",
          offset: "0",
        },
      );

    legalDocuments.value = legalDocumentsResponse?.results;
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to get legal documents",
      status: "error",
    });
  }
};

// Sign legal documents
const signLegalDocs = async () => {
  try {
    await selectedContractingService.value.createLegalDocsSignature(
      serviceConsumerId.value as string,
      signedLegalDocuments.value,
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: error,
      status: "Failed to sign legal document(s)",
    });
  }
};

// Fetch document pdf url
const pdfUrl = async (legal_document_type: string) => {
  try {
    const response =
      await selectedContractingService.value.getLegalDocumentsForSigning(
        serviceConsumerId.value as string,
        legal_document_type,
      );
    if (downloadLink.value) {
      downloadLink.value.href = response.pdf_url;
      if (downloadLink.value) downloadLink.value?.click();
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to get pdf url",
      status: "error",
    });
  }
};

// Fetch billing address
const getBillingAddress = async () => {
  try {
    if (!serviceConsumerId.value) return;
    billingAdress.value = await selectedBillingService.value.getBillingAddress(
      serviceConsumerId.value as string,
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching billing address",
      status: "error",
    });
  }
};

// Create checkout session
const createCheckoutSession = async () => {
  try {
    if (isUserBasedRecurring.value) {
      checkoutSession.value =
        await selectedBillingService.value.createAgreementCheckoutSession(
          serviceConsumerId.value as string,
          agreementId as string,
        );
    } else {
      const invoice_id = agreementBillingDetails.value?.invoices[0]?.id;
      checkoutSession.value =
        await selectedBillingService.value.createInvoiceCheckoutSession(
          serviceConsumerId.value as string,
          invoice_id as string,
        );
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error creating checkout session",
      status: "error",
    });
    throw error;
  }
};

// Initialize Stripe elements
const initStripe = () => {
  const clientSecret = checkoutSession.value?.client_secret;
  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#384250",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#d92d20",
      fontFamily: "Haffer, sans-serif",
      spacingUnit: "3px",
      borderRadius: "8px",
      gridRowSpacing: "24px",
    },
  };
  elements = stripe.elements({ appearance, clientSecret });
  const paymentElementOptions = { layout: "tabs" };
  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
};

// check if legal documents are signed
const legalDocsSigned = computed(() => {
  if (legalDocuments.value) {
    return legalDocuments.value.length === signedLegalDocuments.value.length;
  }
  return false;
});

// Set billing and legal document status to processing before payment
const initProcessing = async () => {
  const billing_status: BillingStatus = "PROCESSING";
  const legal_document_status: LegalDocumentStatus = "PROCESSING";

  try {
    await selectedPoliciesService.value.updateBillingStatus(
      serviceConsumerId.value as string,
      agreementId as string,
      billing_status,
    );
    if (legalDocuments.value?.length) {
      await selectedPoliciesService.value.updateLegalDocumentStatus(
        serviceConsumerId.value as string,
        agreementId as string,
        legal_document_status,
      );
    }
  } catch (error) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status !== 400) {
      eventBus.$emit("onShowToast", {
        text: "Failed to update billing and legal docs status",
        status: "error",
      });
    }
  }
};

// Submit billing address
const submitBillingAddress = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  isLoading.value = true;
  try {
    await selectedBillingService.value.updateBillingAddress(
      serviceConsumerId.value as string,
      billingAdress.value,
    );
    await createCheckoutSession();
    activeStep.value = 1;
    setTimeout(() => initStripe(), 0);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to submit billing address",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

// Submit payment
const submitPayment = async () => {
  if (legalDocuments.value?.length && !legalDocsSigned.value) {
    legalDocNotSigned.value = true;
    return;
  }

  paymentLoading.value = true;

  const displayError = (message: string) => {
    const messageContainer = document.querySelector(
      "#error-message",
    ) as HTMLElement;
    if (messageContainer) {
      messageContainer.textContent = message;
    }
  };
  try {
    await initProcessing();

    if (legalDocuments.value?.length) {
      await signLegalDocs();
    }
    const redirectToStripeCallbackPage = entityType.value === EntityType.SP;
    const returnUrl = new URL(
      redirectToStripeCallbackPage
        ? `${config.app.url}/stripe-callback`
        : `${config.app.url}/sc/subscriptions/${agreementId}`,
    );
    if (redirectToStripeCallbackPage) {
      returnUrl.searchParams.append("next_url", nextUrl);
      returnUrl.searchParams.append("code", code as string);
    }
    returnUrl.searchParams.append("license_id", agreementId as string);
    returnUrl.searchParams.append(
      "organization_id",
      serviceConsumerId.value as string,
    );
    let response;
    if (isUserBasedRecurring.value) {
      // sets up the payment method for future without immediately charging the customer
      response = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: returnUrl.toString(),
        },
      });
    } else {
      response = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl.toString(),
        },
      });
    }

    if (response.error) {
      displayError(response.error.message);
    } else isPaymentSuccessful.value = true;
  } catch (error) {
    displayError(error.message);
  } finally {
    paymentLoading.value = false;
  }
};

const pollGetBillingDetails = async () => {
  isLoadingBillingDetails.value = true;
  const startTime = Date.now();
  const maxDuration = 10000;

  while (Date.now() - startTime < maxDuration) {
    try {
      await getAgreementBillingDetails();
      if (agreementBillingDetails.value) {
        isLoadingBillingDetails.value = false;
        return agreementBillingDetails.value;
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Unexpected error:", error);
        isLoadingBillingDetails.value = false;
        throw error;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  isLoadingBillingDetails.value = false;
  throw new Error("Polling failed: Max duration reached");
};

const loadServiceProvider = async () => {
  try {
    const oAuthManager = new OAuthManager(
      code,
      nextUrl,
      AuthStorageKeys.PLAN_PAGE,
    );
    await oAuthManager.init();
    selectedPoliciesService.value.setOAuthManager(oAuthManager);
    selectedContractingService.value.setOAuthManager(oAuthManager);
    selectedBillingService.value.setOAuthManager(oAuthManager);
    serviceProviderId.value = oAuthManager.getServiceProviderId() || "";
    serviceProviderName.value = oAuthManager.getServiceProviderName() || "";
    serviceConsumerId.value = oAuthManager.getOrganizationId() || "";
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
const initializeData = async () => {
  if (entityType.value === EntityType.SP) {
    await loadServiceProvider();
  } else if (entityType.value === EntityType.SC) {
    serviceConsumerId.value = route.query.service_consumer_id as string;
  }
};
// On component mount, fetch user profile and billing details
onMounted(async () => {
  await initializeData();
  await pollGetBillingDetails();
  await getLegalDocs();
  await getBillingAddress();
});
</script>
<template>
  <m-m-teleport to="split-page-layout-side-content">
    <div v-if="isLoadingBillingDetails">
      <m-m-skeleton-loader />
    </div>
    <div v-else>
      <div class="plan-header">
        <p>
          <span data-cy="checkout-heading"
            >Subscribe to
            {{ agreementBillingDetails?.agreement_type?.service_provider_name }}
          </span>
          <m-m-badge
            :text="billingType"
            :status="BadgeTypes['Warning']"
            cy="checkout-badge-billing-type"
          ></m-m-badge>
          <m-m-badge
            v-if="agreementBillingDetails?.agreement_type?.billing_period_unit"
            :text="
              getBillingPeriod(
                agreementBillingDetails?.agreement_type?.billing_period_unit,
              )
            "
            :status="BadgeTypes['Invited']"
            cy="checkout-badge-billing-period"
          ></m-m-badge>
        </p>

        <h1 data-cy="checkout-price-amount">{{ paymentAmount }}</h1>
      </div>

      <div class="plan-details">
        <img v-if="logoSrc" :src="logoSrc" class="sp-logo" />
        <div class="plan-details--holder">
          <div class="w-100">
            <div class="plan-details--holder--row">
              <span data-cy="checkout-agreement-type-name">{{
                agreementBillingDetails?.agreement_type?.name
              }}</span>
              <span>{{ paymentAmount }}</span>
            </div>
            <div class="plan-details--holder--row grayed">
              <span
                class="mm-fw-400"
                data-cy="checkout-agreement-type-description"
                >{{
                  agreementBillingDetails?.agreement_type?.description
                }}</span
              >
            </div>
            <div v-if="isUserBasedRecurring" class="plan-details--holder--row">
              <!-- hardcoded value to be changed later -->
              <span class="mm-mb-8">Number of users</span>
              <span class="mm-mb-8">1</span>
            </div>
          </div>

          <div class="w-100">
            <div class="plan-details--holder--row separator">
              <span>Subtotal</span>
              <span data-cy="checkout-subtotal-amount">
                {{ paymentAmount }}</span
              >
            </div>
            <!-- <div class="plan-details--holder--row separator">
            <span>Tax</span>
            <span>To be calculated</span>
          </div> -->
            <div class="plan-details--holder--row separator">
              <span
                >Total due
                <span
                  v-if="isUserBasedRecurring"
                  class="mm-page-subtitle mm-page-subtitle--h2"
                  >(at the end of the billing period)</span
                ></span
              >
              <span class="mm-fw-600" data-cy="checkout-total-due-amount">{{
                paymentAmount
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </m-m-teleport>

  <m-m-teleport to="split-page-layout-side-footer-text">
    This order process is conducted by Veriam as the merchant of record.
    <m-m-link
      href="/tc/terms.pdf"
      target="_blank"
      underline
      class="side-footer-text-link"
      >&nbsp;Terms of service&nbsp;
    </m-m-link>
    and
    <m-m-link
      href="/tc/privacy.pdf"
      target="_blank"
      underline
      class="side-footer-text-link"
      >&nbsp;Privacy policy
    </m-m-link>
  </m-m-teleport>

  <div class="mm-checkout">
    <div class="mm-checkout-card">
      <m-m-multi-step :steps="steps" :active-step="activeStep">
        <template #step-0>
          <p class="mm-checkout-card--title mm-mb-8">Billing address</p>
          <form
            v-mm-focus-first
            class="billing-address-form"
            data-cy="checkout-billing-address-form"
          >
            <m-m-input
              v-model="billingAdress.country"
              label="Country"
              required
              placeholder="Country"
              cy="input-country"
              :errors="v$.country.$errors"
            />
            <m-m-input
              v-model="billingAdress.address_line_1"
              label="Street address line 1"
              required
              placeholder="Street address line 1"
              cy="input-address-line-1"
              :errors="v$.address_line_1.$errors"
            />
            <m-m-input
              v-model="billingAdress.address_line_2"
              label="Street address line 2"
              placeholder="Street address line 2"
              cy="input-address-line-2"
            />
            <m-m-input
              v-model="billingAdress.postal_code"
              label="Postal code"
              required
              placeholder="Postal code"
              cy="input-postal-code"
              :errors="v$.postal_code.$errors"
            />
            <m-m-input
              v-model="billingAdress.town_city"
              label="City / Town"
              required
              placeholder="City / Town"
              cy="input-city-town"
              :errors="v$.town_city.$errors"
            />

            <m-m-button
              cy="button-submit-checkout-billing-address"
              class="mm-mt-8"
              :loading="isLoading"
              :is-disabled="isLoading"
              @click="submitBillingAddress"
              >Continue
            </m-m-button>
          </form>
        </template>
        <template #step-1>
          <p class="mm-checkout-card--title">Payment Details</p>
          <form id="payment-form" v-mm-focus-first>
            <div id="payment-element"></div>
            <div
              id="error-message"
              class="mm-checkout-card--error-holder mm-input-errors-item"
            ></div>
          </form>
          <div
            v-if="billingTypeMessage"
            class="mm-page-subtitle mm-page-subtitle--h1"
            data-cy="checkout-billing-type"
          >
            {{ billingTypeMessage }}
          </div>
          <div
            v-if="legalDocuments?.length"
            :class="[
              'plan-details--holder--docs',
              'mm-mt-12',
              { error: legalDocNotSigned && !legalDocsSigned },
            ]"
            data-cy="checkout-license-legal-documents"
          >
            <div
              v-for="(document, index) in legalDocuments"
              :key="index"
              class="activate-license-documents"
            >
              <m-m-checkbox
                v-model="signedLegalDocuments"
                :value="document.legal_documents[0].id"
                name="document_name"
                :data-cy="`checkbox-document-${index}`"
              >
                <span>I agree to the </span>
                <m-m-link
                  :data-cy="`checkbox-link-${index}`"
                  underline
                  :download="downloadLink"
                  @click.prevent="
                    pdfUrl(document.legal_documents[0].legal_document_type)
                  "
                >
                  {{ document.name }}
                </m-m-link>
              </m-m-checkbox>
            </div>
            <div class="mm-checkout-card--error-holder mm-input-errors-item">
              You must agree to all legal documents before proceeding
            </div>
            <a
              ref="downloadLink"
              class="hidden-link"
              download
              target="_blank"
            />
          </div>
          <m-m-button
            id="submit"
            class="w-100 mm-mt-12"
            cy="button-checkout-submit-payment"
            :loading="paymentLoading"
            :is-disabled="paymentLoading"
            @click.prevent="submitPayment"
            >{{ isUserBasedRecurring ? "Validate card" : "Pay now" }}
          </m-m-button>
        </template>
      </m-m-multi-step>
    </div>
  </div>
  <DialogSuccessSelfServiceCheckout
    :is-open="displaySuccessDialog"
    :org-id="serviceProviderId"
    :org-name="serviceProviderName"
  />
</template>

<style scoped lang="scss">
.plan-header {
  > p {
    color: #9ea5af;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-bottom: 6px;
  }

  > h1 {
    color: #384250;
    font-size: 48px;
    font-weight: 500;
    line-height: 60px;
    letter-spacing: -0.02em;
    margin-bottom: 40px;
  }
}

.side-footer-text-link {
  color: #9ea5af;
  font-size: 12px;
}

.plan-details {
  display: flex;
  align-items: flex-start;
  gap: 16px;

  &--holder {
    display: flex;
    flex-direction: column;
    gap: 56px;
    width: 100%;

    &--row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #384250;
      margin-bottom: 8px;
      width: 100%;
      font-weight: 500;

      &.grayed {
        color: #9ea5af;
      }

      &.separator {
        border-bottom: 1px solid #e6e8ec;
        padding-bottom: 16px;
        margin-bottom: 16px;
      }
    }

    &--docs {
      border: 1px solid #e6e8ec;
      border-radius: 12px;
      padding: 8px 16px;

      span {
        font-weight: 500;
      }

      .mm-input-errors-item {
        display: none;
      }

      &.error {
        border-color: #d92d20;

        .mm-input-errors-item {
          display: block;
        }
      }
    }
  }

  .sp-logo {
    max-width: 58px;
    max-height: 58px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.mm-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &-card {
    width: 100%;
    max-width: 560px;
    box-shadow: 0px 8px 8px -4px #10182808;
    border-radius: 12px;
    background: #fff;
    padding: 32px 56px;
    z-index: 101;

    &--title {
      font-size: 20px;
      font-weight: 600;
      line-height: 30px;
    }

    &--error-holder {
      color: #d92d20;
      font-size: 14px;
      margin-top: 16px;
    }
  }

  @media screen and (max-width: 1024px) {
    &-card {
      padding: 32px;
    }
  }
}

.billing-address-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hidden-link {
  display: none;
}
</style>

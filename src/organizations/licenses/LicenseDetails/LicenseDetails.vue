<script setup lang="ts">
import { ComputedRef, Ref, computed, onMounted, ref, watch } from "vue";
import { authService } from "~/auth/auth.service";
import { useRoute, useRouter } from "vue-router";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import {
  AgreementExtendedRead,
  getPriceModel,
  getBillingPeriod,
  PaginationSchema_InvoiceRead_,
  PaymentIntentRead,
} from "~/billing_and_invoicing/billing_and_invoicing.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { billingAndInvoicingService } from "~/billing_and_invoicing/billing_and_invoicing.service";
import Payments from "./Tabs/Payments.vue";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { useFlag } from "@unleash/proxy-client-vue";
import { policiesService } from "~/service-providers/policies.service";
import { AgreementReadExtended } from "../licenses.types";
import { LegalDocumentTypeWithLegalDocumentRead } from "../legal-documents.types";
import { legalDocumentsService } from "~/service-providers/legal-documents.service";
import { ITEMS_PER_PAGE } from "~/common/constants";
import LegalDocuments from "./Tabs/LegalDocuments.vue";
import Users from "./Tabs/Assignments.vue";
import Invoices from "./Tabs/Invoices.vue";
import DialogActivateLicense from "./Dialogs/DialogActivateLicense.vue";
import DialogBillingContact from "./Dialogs/DialogBillingContact.vue";
import DialogPaymentSuccessful from "./Dialogs/DialogPaymentSuccessful.vue";
import DialogPaymentFailed from "./Dialogs/DialogPaymentFailed.vue";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import {
  statusMap,
  getStatusText,
} from "~/mm_ui_kit/src/helpers/agreementUtils";
import { displayPaymentStatus } from "~/common/helpers/displayPaymentStatus";
import { convertToMainUnit } from "~/mm_ui_kit/src/helpers/priceUnitConverter";
import { organizationsService } from "~/organizations/organizations.service";
import DialogCancelSubscription from "./Dialogs/DialogCancelSubscription.vue";
import { usersService } from "~/users/users.service";
import { useUiStore } from "~/stores/useUiStore";
import { EntityType } from "~/billing_and_invoicing/checkout/types";
import { useTranslation } from "i18next-vue";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";

const uiStore = useUiStore();
const { t } = useTranslation();

const defaultPagination = { limit: ITEMS_PER_PAGE[0], offset: "0" };
const legalDocsEnabled = useFlag("legal_documents");
const route = useRoute();
const router = useRouter();
const paymentsEnabled = useFlag("billing_and_invoicing");
const activateLicenseEnabled = useFlag("activate_license");
const service_consumer_id: Ref<string> = ref("");
const documents: Ref<TableResponse<LegalDocumentTypeWithLegalDocumentRead> | null> =
  ref(null);
const invoices: Ref<PaginationSchema_InvoiceRead_ | null> = ref(null);
const orgName: Ref<string> = ref("");
const payments: Ref<TableResponse<PaymentIntentRead> | null> = ref(null);
const isActivateLicenseDialogOpen: Ref<boolean> = ref(false);
const isBillingContactDialogOpen: Ref<boolean> = ref(false);
const isPaymentSuccessfullDialogOpen: Ref<boolean> = ref(false);
const isPaymentFailedDialogOpen: Ref<boolean> = ref(false);
const isDialogCancelSubscriptionOpen: Ref<boolean> = ref(false);
const agreementBillingDetails: Ref<AgreementExtendedRead | null> = ref(null);
const isLoading: Ref<boolean> = ref(false);
const contactInfo: Ref<string> = ref("");
const isLegalDocumentsLoading: Ref<boolean> = ref(true);
const isPaymentsLoading: Ref<boolean> = ref(true);
const isInfoLoading = ref(false);
const licenseProcessing = ref(false);
const isAgreementCancelling = ref(false);
const isSignatureCreated = ref(false);
const serviceConsumerName = ref("");

const createQueryParams = (
  params?: TableRequestParams,
  additionalParams?: Record<string, string | boolean>,
) => {
  return {
    ...defaultPagination,
    ...params,
    ...additionalParams,
  };
};

const isSubscriptionsRoute = computed<boolean>(() =>
  route.path.includes("/subscriptions/"),
);
const dropdownItems: ComputedRef<TypeDropdownItem[]> = computed(() => [
  {
    label: isSubscriptionsRoute.value
      ? "Update billing contact"
      : "Update license contact",
    type: "button",
    isDisabled: uiStore.isSCViewerOnly,
    onClick: () => {
      isBillingContactDialogOpen.value = true;
    },
  },
  {
    label: `Cancel  ${isAccessLicenseRoute.value ? "license" : "subscription"}`,
    type: "button",
    onClick: () => {
      isDialogCancelSubscriptionOpen.value = true;
    },
    isDisabled:
      (isCancelledAtEndOfBillingPeriod.value
        ? true
        : !agreement.value?.active) || uiStore.isSCViewerOnly,
  },
]);

const showDialogActivateLicense = computed(() => {
  return (
    route.params.license_id &&
    service_consumer_id.value &&
    activateLicenseEnabled.value &&
    isActivateLicenseDialogOpen.value
  );
});

const isRecurringBilling = computed(() => {
  return (
    agreementBillingDetails.value?.agreement_type.billing_type &&
    agreementBillingDetails.value?.agreement_type.billing_type !== "ONCE_OFF" &&
    agreementBillingDetails.value?.agreement_type.billing_type !== "FREE"
  );
});

const hasUnsignedLegalDocuments = computed(
  () => agreement.value?.legal_document_status === "UNSIGNED_LEGAL_DOCUMENTS",
);
const isNoPaymentRequired = computed(
  () =>
    agreement.value?.billing_status === "UNKNOWN" ||
    agreement.value?.billing_status === "NO_PAYMENT_REQUIRED",
);

const isUserBasedRecurring = computed(() => {
  return (
    agreementBillingDetails.value?.agreement_type.billing_type ===
    "USER_BASED_RECURRING"
  );
});
const isCancellingInProgress: ComputedRef<boolean> = computed(
  () =>
    isAgreementCancelling.value &&
    (!agreementBillingDetails.value?.cancelled ||
      !isCancelledAtEndOfBillingPeriod.value),
);
const isCancellingProcessFinished: ComputedRef<boolean> = computed(
  () =>
    isAgreementCancelling.value &&
    (agreementBillingDetails.value?.cancelled ||
      isCancelledAtEndOfBillingPeriod.value),
);
const isCancelledAtEndOfBillingPeriod = computed(
  () => agreementBillingDetails.value?.cancel_at_period_end,
);
const priceLabel = computed(() => {
  return isUserBasedRecurring.value ? "Price (per user)" : "Price";
});

const formattedTotalPrice = computed(() => {
  if (!agreementBillingDetails.value?.currency) return "";

  return convertToMainUnit(
    Number(
      agreementBillingDetails.value.current_cost_per_billing_period_amount || 0,
    ),
    agreementBillingDetails.value.currency,
  ).formatted;
});

const agreement: Ref<AgreementReadExtended | null> = ref(null);
const handleError = () => {
  eventBus.$emit("onShowToast", {
    text: "Failed to fetch license details",
    status: "error",
  });
};

const badgeStatus: ComputedRef<BadgeTypes> = computed(() => {
  if (
    agreement.value &&
    !agreement.value?.cancelled &&
    !agreement.value?.active
  ) {
    return BadgeTypes.Warning;
  } else {
    return agreement.value?.cancelled
      ? BadgeTypes.Cancelled
      : agreement.value?.active
        ? BadgeTypes.Active
        : BadgeTypes.Inactive;
  }
});
const isAccessLicenseRoute = computed(() => {
  return route.path.includes("access-licenses");
});

watch(
  () => badgeStatus.value,
  async (newValue) => {
    if (newValue === "active" && isRecurringBilling.value)
      await pollGetAgreementBillingDetails();
  },
  {
    deep: true,
    immediate: true,
  },
);

const pricingModel = computed(() => {
  return getPriceModel(
    agreementBillingDetails.value?.agreement_type.billing_type || "FREE",
  );
});

const price = computed(() => {
  return agreementBillingDetails.value?.agreement_type?.price?.amount
    ? agreementBillingDetails.value?.agreement_type?.price?.amount.toFixed(2)
    : "-";
});

const accessLicenseDetailsTitle: ComputedRef<string> = computed(() =>
  t(
    "access_licenses.access_license_details.title",
    escapeObjectValuesForHtml({
      licenseName: agreement.value?.agreement_type.name || "",
      orgName: orgName.value,
    }),
  ),
);

const accessLicenseDetailsSubtitle: ComputedRef<string> = computed(() =>
  t(
    "access_licenses.access_license_details.subtitle",
    escapeObjectValuesForHtml({
      subscriptionOrLicense: isSubscriptionsRoute.value
        ? "subscription"
        : "license",
    }),
  ),
);

const showPrice = computed(() => {
  return (
    !!agreementBillingDetails?.value?.agreement_type?.billing_type &&
    pricingModel.value !== "Free"
  );
});

const getServiceConsumer = async () => {
  if (!service_consumer_id.value) {
    const userProfile = await authService.getProfile();
    service_consumer_id.value = userProfile?.org || "";
  }
};

const getAgreementBillingDetails = async () => {
  isLoading.value = true;
  try {
    agreementBillingDetails.value =
      await billingAndInvoicingService.getAgreementBillingDetails(
        service_consumer_id.value,
        route.params?.license_id as string,
      );
    orgName.value =
      agreementBillingDetails.value?.agreement_type?.service_provider_name ??
      "";
    serviceConsumerName.value =
      agreementBillingDetails.value?.service_consumer_name ?? "";
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching billing details",
      status: "error",
    });
  } finally {
    isLoading.value = false;
    if (isCancellingProcessFinished.value) {
      isAgreementCancelling.value = false;
    }
  }
};

const getPayments = async (params?: TableRequestParams) => {
  const queryParams = createQueryParams(params, {
    agreement_id: route.params.license_id.toString(),
  });
  try {
    await getServiceConsumer();
    isPaymentsLoading.value = true;
    payments.value = await billingAndInvoicingService.getPayments(
      service_consumer_id.value,
      queryParams,
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching payments",
      status: "error",
    });
  } finally {
    isPaymentsLoading.value = false;
  }
};

const handleUpdateLicense = () => {
  getLicense(true);
};

const handlePaymentsUpdate = (params: TableRequestParams) => {
  getPayments(params);
};

const handleInvoicesUpdate = (params: TableRequestParams) => {
  getInvoices(params);
};

const getLicense = async (initialFetch = false) => {
  const licenseId = route.params?.license_id?.toString();

  if (!licenseId) {
    return;
  }

  try {
    agreement.value = await policiesService.getServiceConsumerAgreement(
      service_consumer_id.value,
      licenseId,
    );
    licenseProcessing.value =
      (!isNoPaymentRequired.value &&
        agreement.value?.billing_status === "PROCESSING") ||
      (isNoPaymentRequired.value &&
        !agreement.value?.active &&
        isSignatureCreated.value);

    if (initialFetch && licenseProcessing.value) {
      if (
        !isNoPaymentRequired.value ||
        (isNoPaymentRequired.value && isSignatureCreated.value)
      ) {
        pollGetLicense();
      }
    }
  } catch (error) {
    handleError();
  }
};

const pollGetLicense = async () => {
  const interval = setInterval(async () => {
    await getLicense();
    if (
      (!isNoPaymentRequired.value &&
        agreement.value?.billing_status !== "PROCESSING") ||
      (isNoPaymentRequired.value && agreement.value?.active === true)
    ) {
      licenseProcessing.value = false;
      clearInterval(interval);
    }
  }, 2000);
};
const pollGetAgreementBillingDetails = async () => {
  let timeoutId: number;
  const checkBillingDetails = async () => {
    await getAgreementBillingDetails();
    if (
      agreementBillingDetails.value?.next_billing_due_date &&
      !isCancellingInProgress.value
    ) {
      clearTimeout(timeoutId);
      return;
    }
    timeoutId = setTimeout(checkBillingDetails, 2000);
  };
  checkBillingDetails();
};

const getLegalDocuments = async (params?: TableRequestParams) => {
  const queryParams = {
    ...defaultPagination,
    ...params,
  };

  try {
    isLegalDocumentsLoading.value = true;
    documents.value =
      await legalDocumentsService.getLegalDocumentTypesByAgreementTypeId(
        service_consumer_id.value,
        agreementBillingDetails.value?.agreement_type?.id as string,
        queryParams,
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching legal documents",
      status: "error",
    });
  } finally {
    isLegalDocumentsLoading.value = false;
  }
};

const handleLegalDocumentsUpdate = (params: TableRequestParams) => {
  if (agreementBillingDetails.value) {
    getLegalDocuments(params);
  }
};

const getInvoices = async (params?: TableRequestParams) => {
  const queryParams = createQueryParams(params, {
    agreement_id: route.params.license_id.toString(),
  });
  try {
    isLoading.value = true;
    await getServiceConsumer();
    invoices.value = await billingAndInvoicingService.getInvoices(
      service_consumer_id.value,
      route.params.license_id.toString(),
      queryParams,
    );
  } catch (error) {
    handleError();
  } finally {
    isLoading.value = false;
  }
};

const goToCheckout = () => {
  router.push({
    name: "Checkout",
    params: {
      agreement_id: route.params.license_id.toString(),
      service_consumer_id: service_consumer_id.value,
    },
    query: {
      service_consumer_id: service_consumer_id.value,
      entity_type: EntityType.SC,
    },
  });
};

const getOrganizationUser = async () => {
  try {
    if (agreement.value?.contact_organization_user_id == null) {
      return;
    }
    const user = await usersService.getUserMe();
    const organizationUser = user.organization_users.find(
      (organizationUserItem) =>
        organizationUserItem.organization.id === service_consumer_id.value,
    );
    const response = await organizationsService.getOrganizationUser(
      service_consumer_id.value,
      organizationUser.id,
    );
    contactInfo.value =
      response?.first_name && response?.last_name
        ? `${response?.first_name} ${response?.last_name}`
        : response?.email || "-";
  } catch (error) {
    handleError();
  }
};

const handleContactUpdated = async (newUserId: string) => {
  if (agreement.value) {
    agreement.value.contact_organization_user_id = newUserId;
  }
  await getOrganizationUser();
};

const checkPaymentStatus = async () => {
  const paymentStatus = await displayPaymentStatus();
  if (paymentStatus === "succeeded") {
    isPaymentSuccessfullDialogOpen.value = true;
  }
  if (paymentStatus === "error") {
    isPaymentFailedDialogOpen.value = true;
  }
};

const cancelSubscription = async () => {
  try {
    await policiesService.cancelServiceConsumerAgreement(
      service_consumer_id.value,
      agreement.value?.id,
    );
  } catch {
    eventBus.$emit("onShowToast", {
      text: "Error cancelling subscription",
      status: "error",
    });
  } finally {
    if (!isRecurringBilling.value || isUserBasedRecurring.value) {
      await getLicense(false);
    } else {
      isAgreementCancelling.value = true;
      await pollGetAgreementBillingDetails();
    }
    isDialogCancelSubscriptionOpen.value = false;
  }
};

const formattedPrice = (price: string) =>
  convertToMainUnit(
    Number(price),
    agreementBillingDetails.value?.agreement_type?.price?.currency as string,
  ).formatted;

onMounted(async () => {
  const userProfile = await authService.getProfile();
  service_consumer_id.value = userProfile?.org || "";

  if (userProfile?.org) {
    isInfoLoading.value = true;
    if (paymentsEnabled.value) {
      await getAgreementBillingDetails();
    }
    await getLicense(true);
    await getOrganizationUser();
    isInfoLoading.value = false;
    await checkPaymentStatus();
    if (legalDocsEnabled.value) {
      await getLegalDocuments(defaultPagination);
    }
    if (
      hasUnsignedLegalDocuments.value &&
      !isUserBasedRecurring.value &&
      isNoPaymentRequired.value
    ) {
      isActivateLicenseDialogOpen.value = true;
    }
  }
});
</script>
<template>
  <m-m-teleport to="common-page-layout-header-title">
    <div
      v-if="agreement"
      class="mm-flex mm-flex-column mm-flex-justify-between"
    >
      <div class="mm-flex mm-flex-align-center">
        <div v-sanitize-html="accessLicenseDetailsTitle" />
        <m-m-badge
          v-if="isCancelledAtEndOfBillingPeriod"
          :status="BadgeTypes.Warning"
          indicator
          text="Non Renewing"
          class="mm-ml-8"
        />
        <m-m-badge
          v-else-if="licenseProcessing || isCancellingInProgress"
          :status="BadgeTypes.Warning"
          indicator
          text="Processing"
          class="mm-ml-8"
        />
        <m-m-badge
          v-else
          :status="
            statusMap(
              agreement?.cancelled as boolean,
              agreement?.active as boolean,
            )
          "
          indicator
          :text="getStatusText(agreement)"
          class="mm-ml-8"
        />
      </div>
      <div
        v-sanitize-html="accessLicenseDetailsSubtitle"
        data-cy="header-subtitle"
        class="header-subtitle"
      />
    </div>
  </m-m-teleport>
  <m-m-teleport to="common-page-layout-header-controls">
    <div class="mm-flex mm-flex-gap-6">
      <m-m-dropdown
        v-if="!agreement?.cancelled"
        cy="license-details-header-dropdown"
        :items="dropdownItems"
      />
    </div>
  </m-m-teleport>

  <m-m-skeleton-loader
    v-show="isInfoLoading || licenseProcessing || isCancellingInProgress"
  />
  <div v-show="!isInfoLoading && !licenseProcessing && !isCancellingInProgress">
    <div
      v-if="!isLoading && badgeStatus == 'warning'"
      class="mm-flex mm-flex-align-center mm-flex-column mm-flex-gap-12"
    >
      <template v-if="pricingModel === 'Free'">
        <div class="activate-icon">
          <m-m-icon icon="document-check" width="56px" height="56px" />
        </div>
        <m-m-button
          variant="outlined"
          cy="button-activate-license"
          :is-disabled="uiStore.isSCViewerOnly"
          @click="isActivateLicenseDialogOpen = true"
          >Activate now</m-m-button
        >
      </template>
      <template v-if="pricingModel != 'Free'">
        <div
          v-if="!isUserBasedRecurring"
          class="mm-page-subtitle mm-page-subtitle--h2"
        >
          {{ orgName }} has created this subscription for
          {{ serviceConsumerName }} to access their products.
          <div>
            To start using it, simply click below to complete payment and then
            add your colleagues to start using it.
          </div>
        </div>
        <div
          v-if="isUserBasedRecurring"
          class="mm-page-subtitle mm-page-subtitle--h2"
        >
          {{ orgName }} has created this subscription for
          {{ serviceConsumerName }} to access their products.
          <div>
            To start using it, simply click below to verify your payment
            details.
          </div>
        </div>
        <div class="activate-icon">
          <m-m-icon icon="credit-card" width="56px" height="56px" />
        </div>
        <m-m-button
          variant="outlined"
          cy="button-activate-license"
          :is-disabled="uiStore.isSCViewerOnly"
          @click="goToCheckout"
          >Pay now</m-m-button
        >
      </template>
    </div>
    <div v-else>
      <div class="mm-page-title mm-page-title--h2 mm-mb-8">Summary</div>
      <div class="mm-flex mm-flex-column mm-flex-gap-12">
        <m-m-card class="mm-pa-8">
          <div
            class="mm-grid mm-grid-columns-3 mm-grid-row-gap-12 mm-grid-column-gap-16"
          >
            <div class="mm-page-item-label">
              Effective from
              <div class="mm-page-item-value" data-cy="effective-from">
                <m-m-formatted-date
                  :raw-date="agreement?.effective_from_date"
                />
              </div>
            </div>
            <div v-if="agreement?.cancelled" class="mm-page-item-label">
              Effective to
              <div class="mm-page-item-value" data-cy="effective-to">
                <m-m-formatted-date :raw-date="agreement?.valid_until" />
              </div>
            </div>
            <div v-if="isSubscriptionsRoute" class="mm-page-item-label">
              Pricing type
              <div class="mm-page-item-value" data-cy="pricing-model">
                {{ pricingModel }}
              </div>
            </div>

            <div
              v-if="showPrice && isSubscriptionsRoute"
              class="mm-page-item-label"
            >
              {{ priceLabel }}
              <div class="mm-page-item-value" data-cy="price">
                {{ formattedPrice(price) }}
              </div>
            </div>

            <div v-if="isUserBasedRecurring" class="mm-page-item-label">
              <div class="mm-flex mm-flex-align-center mm-flex-gap-2">
                Total price
                <div>
                  <m-m-icon icon="info" width="16px" height="16px" />
                  <m-m-tooltip display-position="toRight">
                    This is the total amount based on the current active users
                    on the subscription times the price per user. Excludes any
                    pro rata amounts for current billing period.
                  </m-m-tooltip>
                </div>
              </div>
              <div class="mm-page-item-value">
                {{ formattedTotalPrice }}
              </div>
            </div>

            <div
              v-if="isRecurringBilling && isSubscriptionsRoute"
              class="mm-page-item-label"
            >
              Billing period
              <div class="mm-page-item-value" data-cy="billing-period">
                {{
                  agreementBillingDetails?.agreement_type
                    ?.billing_period_unit &&
                  getBillingPeriod(
                    agreementBillingDetails?.agreement_type
                      ?.billing_period_unit,
                  )
                }}
              </div>
            </div>
            <div
              v-if="isRecurringBilling && isSubscriptionsRoute"
              class="mm-page-item-label"
            >
              Next billing date
              <div class="mm-page-item-value" data-cy="next-billing-date">
                <m-m-formatted-date
                  v-if="
                    !agreement?.cancelled && !isCancelledAtEndOfBillingPeriod
                  "
                  :raw-date="agreementBillingDetails?.next_billing_due_date"
                />
                <span v-else>-</span>
              </div>
            </div>
            <div class="mm-page-item-label">
              Contact
              <div class="mm-page-item-value" data-cy="contact">
                {{ contactInfo || "-" }}
              </div>
            </div>
          </div>
        </m-m-card>
        <m-m-divider />
        <Users
          :is-user-based-recurring="isUserBasedRecurring"
          :is-access-license="isAccessLicenseRoute"
        />
        <Payments
          v-if="paymentsEnabled && isSubscriptionsRoute"
          :payments="payments"
          :is-loading="isPaymentsLoading"
          @update-params="handlePaymentsUpdate"
        />
        <Invoices
          v-if="paymentsEnabled && isSubscriptionsRoute"
          :invoices="invoices?.results"
          :is-loading="isLoading"
          @update-params="handleInvoicesUpdate"
        />
        <LegalDocuments
          v-if="legalDocsEnabled"
          :documents="documents"
          :service-consumer-id="service_consumer_id"
          :is-loading="isLegalDocumentsLoading"
          @update-params="handleLegalDocumentsUpdate"
        />
      </div>
    </div>
  </div>
  <DialogActivateLicense
    v-if="showDialogActivateLicense"
    :is-open="isActivateLicenseDialogOpen"
    :license-id="route.params.license_id.toString()"
    :service-consumer-id="service_consumer_id"
    :documents="documents"
    :is-loading="isLegalDocumentsLoading"
    @close-dialog="isActivateLicenseDialogOpen = false"
    @update-licenses="handleUpdateLicense"
    @signature-created="isSignatureCreated = true"
  />
  <DialogBillingContact
    v-if="service_consumer_id"
    :is-open="isBillingContactDialogOpen"
    :organization-id="service_consumer_id"
    :agreement-id="agreement?.id"
    :user-id="agreement?.contact_organization_user_id"
    @close="isBillingContactDialogOpen = false"
    @update-contact="handleContactUpdated"
  />
  <DialogPaymentSuccessful
    :is-open="isPaymentSuccessfullDialogOpen"
    :is-user-based="isUserBasedRecurring"
    @close="isPaymentSuccessfullDialogOpen = false"
  />
  <DialogPaymentFailed
    :is-open="isPaymentFailedDialogOpen"
    :license-id="route.params.license_id.toString()"
    @close="isPaymentFailedDialogOpen = false"
  />
  <dialog-cancel-subscription
    v-if="isDialogCancelSubscriptionOpen"
    :is-open="isDialogCancelSubscriptionOpen"
    :service-consumer-id="service_consumer_id"
    :agreement-id="agreement?.id"
    :is-user-based-pricing="isUserBasedRecurring"
    :is-access-license="isAccessLicenseRoute"
    @close="isDialogCancelSubscriptionOpen = false"
    @cancel-subscription="cancelSubscription"
  />
</template>
<style scoped lang="scss">
.activate-icon {
  background: #f4f5f7;
  min-width: 144px;
  min-height: 144px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.license-details {
  &--link {
    text-decoration: underline;
  }
}

.header-subtitle {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
:deep(.mm-page-subtitle) {
  text-align: center;
}
:deep(.mm-table) {
  padding: 0 24px 24px 24px;
}
:deep(.mm-expandable-card--active) {
  background-color: #f2f4f7;
}
:deep(.mm-table-body) {
  background-color: #f2f4f7;
}
:deep(.mm-table-body tr) {
  background-color: #fff;
}
:deep(.mm-table-body thead tr) {
  background-color: #fafbfc;
}
:deep(.mm-table-actions-cell) {
  overflow: hidden;
  white-space: nowrap;
}
</style>

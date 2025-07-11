<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import { ServiceProviderAttributesConsentsRead } from "~/onboarding/onboarding.types";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { useRoute } from "vue-router";
import { onboardingServiceAuth } from "~/onboarding/onboarding.service";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { TableHeader } from "~/mm_ui_kit/src/types/table.types";
import DialogReviewConsent from "./Dialogs/DialogReviewConsent.vue";
import { UserProfileMM } from "~/auth/auth.types";
import { TypeIdName } from "~/common/types";
import { organizationsService } from "~/organizations/organizations.service";
import { ServiceProviderRead } from "~/iam/iam.types";

const route = useRoute();

const organizationConsents: Ref<ServiceProviderAttributesConsentsRead[]> = ref(
  [],
);
const consentToReview: Ref<ServiceProviderAttributesConsentsRead | null> =
  ref(null);
const isDialogReviewConsentOpen: Ref<boolean> = ref(false);
const isDialogReviewConsentButtonSubmitDisabled: Ref<boolean> = ref(false);
const isDialogReviewConsentButtonSubmitLoading: Ref<boolean> = ref(false);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const serviceProviders: Ref<ServiceProviderRead[]> = ref([]);
const isLoading: Ref<boolean> = ref(true);

const dropdownItems = (
  consent: ServiceProviderAttributesConsentsRead,
): TypeDropdownItem[] => [
  {
    label: "Review Consent",
    type: "button",
    onClick: () => onOpenDialogReviewConsent(consent),
  },
];

const tableHeadersConsents: TableHeader[] = [
  {
    key: "name",
    label: "Organization name",
  },
  {
    key: "consent_date",
    label: "Consent given On",
  },
  {
    key: "actions",
    label: "",
  },
];

const attributeTypesForConsentToReview: ComputedRef<TypeIdName[]> = computed(
  () =>
    consentToReview.value?.attributes.map(
      (attributeType) => attributeType.type,
    ) || [],
);

const consentIds: ComputedRef<string[]> = computed(() =>
  organizationConsents.value.map((consent) => consent.id),
);

const organizationNameInConsentToReview: ComputedRef<string> = computed(
  () => consentToReview.value?.name || "-",
);

const organizationName = (row: ServiceProviderAttributesConsentsRead) =>
  row.name || "-";

const onOpenDialogReviewConsent = (
  consent: ServiceProviderAttributesConsentsRead,
) => {
  consentToReview.value = consent;
  isDialogReviewConsentOpen.value = true;
};

const onCloseDialogReviewConsent = () => {
  consentToReview.value = null;
  isDialogReviewConsentOpen.value = false;
};

const getServiceProviders = async () => {
  if (userProfile.value?.org && Boolean(consentIds.value.length)) {
    try {
      serviceProviders.value =
        await organizationsService.getServiceProvidersByOrganization(
          userProfile.value.org,
          consentIds.value,
        );
      if (route.params.org_id === userProfile.value.org) {
        serviceProviders.value.push({
          id: userProfile.value.org,
          name: userProfile.value.org_name as string,
        });
      }
    } catch (err) {
      eventBus.$emit("onShowToast", {
        text: "Failed to fetch service providers",
        status: "error",
      });
    }
  }
};

const onSubmitDialogReviewConsent = async () => {
  try {
    isDialogReviewConsentButtonSubmitDisabled.value = true;
    isDialogReviewConsentButtonSubmitLoading.value = true;

    await onboardingServiceAuth.deleteOrganizationConsents(
      userProfile.value?.org as string,
      consentToReview.value?.id as string,
    );
    await getOrganizationConsents();
    onCloseDialogReviewConsent();
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to review consent",
      status: "error",
    });
  } finally {
    isDialogReviewConsentButtonSubmitDisabled.value = false;
    isDialogReviewConsentButtonSubmitLoading.value = false;
  }
};

const getOrganizationConsents = async () => {
  try {
    isLoading.value = true;
    organizationConsents.value =
      await onboardingServiceAuth.getOrganizationConsents(
        route.params.org_id as string,
      );
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  await getOrganizationConsents();
  await getServiceProviders();
});
</script>

<template>
  <m-m-table
    :headers="tableHeadersConsents"
    :rows="organizationConsents"
    cy="table-consents"
  >
    <template #name="{ row }">
      {{ organizationName(row) }}
    </template>
    <template #consent_date="{ row }">
      <m-m-formatted-date
        :raw-date="row.consent_date"
        format="DD MMM YYYY, HH:mm A"
      />
    </template>
    <template #actions="{ row }">
      <m-m-dropdown :cy="`dropdown-${row.id}`" :items="dropdownItems(row)">
        <template #activator>
          <m-m-button
            prepend-icon="dots-vertical"
            variant="text"
            :cy="`actions-button-${row.id}`"
          />
        </template>
      </m-m-dropdown>
    </template>
  </m-m-table>

  <dialog-review-consent
    :is-open="isDialogReviewConsentOpen"
    :organization-name="organizationNameInConsentToReview"
    :attribute-types="attributeTypesForConsentToReview"
    :is-button-submit-disabled="isDialogReviewConsentButtonSubmitDisabled"
    :is-button-submit-loading="isDialogReviewConsentButtonSubmitLoading"
    @close="onCloseDialogReviewConsent"
    @submit="onSubmitDialogReviewConsent"
  />
</template>

<style scoped lang="scss"></style>

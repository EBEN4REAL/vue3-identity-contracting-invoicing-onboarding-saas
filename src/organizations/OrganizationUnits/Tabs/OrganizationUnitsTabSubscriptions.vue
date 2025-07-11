<script lang="ts" setup>
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import { authService } from "~/auth/auth.service";
import { OrganizationUnitRead, ServiceProviderRead } from "~/iam/iam.types";
import AssignLicenseToOrganizationUnit from "../Dialogs/OrganizationUnitAssignLicenseToUnit.vue";
import UnassignLicenseFromOrganizationUnit from "../Dialogs/OrganizationUnitUnassignLicenseFromUnit.vue";
import {
  ServiceConsumerAgreementRead,
  ServiceConsumerAgreementsRead_,
} from "~/organizations/licenses/licenses.types";
import { policiesService } from "~/service-providers/policies.service";
import { ErrorAlertProp, SubmitType } from "../types";
import { organizationsService } from "~/organizations/organizations.service";
import {
  EmptyStateType,
  TablePagination,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogManageOptionalPoliciesForUnit from "~/organizations/licenses/LicenseDetails/Dialogs/DialogManageOptionalPoliciesForUnit.vue";
import { AgreementTypeRead, SCAgreementRead } from "~/policies/policies.types";
import { getServiceProviderName } from "~/mm_ui_kit/src/helpers/serviceProviderUtils";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";

const emptyState: EmptyStateType = {
  icon: sectionIcons["units"],
  title: "Add subscription to unit",
  description:
    "All users in this organizational unit can then access and use the subscription.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/provide-access-to-employees#manage-license-for-organizational-unit",
};

const headers = [
  {
    key: "agreement_type_name",
    label: "Subscription name",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
  {
    key: "service_provider_name",
    label: "Organization name",
  },
  {
    key: "actions",
    label: "",
  },
];

const props = defineProps({
  unit: {
    type: Object as PropType<OrganizationUnitRead>,
    default: () => ({}),
    required: true,
  },
  organizationId: { type: String, default: "" },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const selectedSubscription: Ref<ServiceConsumerAgreementRead | null> =
  ref(null);
const selectedUnit: Ref<{ id: string; name: string } | null> = ref(null);
const isDialogManageOptionalPoliciesOpen: Ref<boolean> = ref(false);
const serviceConsumerId: Ref<string> = ref("");
const subscriptions: Ref<TableResponse<SCAgreementRead> | null> = ref(null);
const isConfirmUnassignDialogOpen: Ref<boolean> = ref(false);
const isAssignDialogOpen: Ref<boolean> = ref(false);
const subscriptionToUnassign: Ref<ServiceConsumerAgreementsRead_ | null> =
  ref(null);
const loadingUnassign: Ref<boolean> = ref(false);
const serviceProviders: Ref<ServiceProviderRead[] | null> = ref(null);
const isInErrorState: Ref<boolean> = ref(false);
const isSaving: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const isLoading: Ref<boolean> = ref(true);
const description: string = "All subscriptions directly assigned to this unit.";
const resetErrorState = () => {
  isInErrorState.value = false;
  alertText.value = "";
};
const errorAlert: Ref<ErrorAlertProp> = ref({
  resetErrorState,
  alertText,
  isInErrorState,
});

let initialQueryParams: TablePagination = {
  limit: ITEMS_PER_PAGE[0],
  offset: "0",
};

const isSubscriptionBtnDisabled: ComputedRef<boolean> = computed(() => {
  return !subscriptions.value?.results || props.isSCViewerOnly;
});

const tryUnassign = (row: ServiceConsumerAgreementsRead_): void => {
  subscriptionToUnassign.value = row;
  toggleConfirmUnassign();
};

const toggleConfirmUnassign = () => {
  isConfirmUnassignDialogOpen.value = !isConfirmUnassignDialogOpen.value;
};

const toggleAssignDialog = () => {
  isAssignDialogOpen.value = !isAssignDialogOpen.value;
};

const getSubscriptionAgreements = async () => {
  isLoading.value = true;

  if (serviceConsumerId.value) {
    const fetchedSubscriptions =
      await policiesService.getServiceConsumerAgreements(
        serviceConsumerId.value,
        {
          ...initialQueryParams,
          assigned_organization_unit_id: props.unit.id,
          category: "SUBSCRIPTION",
        },
      );
    subscriptions.value = fetchedSubscriptions;
    isLoading.value = false;
    getServiceProviders();
  }
};
const submit = async (payload: SubmitType) => {
  try {
    isSaving.value = true;
    await policiesService.assignServiceConsumerAgreementToOrgUnit(
      serviceConsumerId.value,
      payload.agreement_id,
      props.unit.id,
      payload.optional_policy_ids,
    );
    await getSubscriptionAgreements();
    isSaving.value = false;
  } catch (error) {
    isSaving.value = false;
    isInErrorState.value = true;
    alertText.value = "Failed to add subscription to unit";
  }
};

const onUnassignButtonClick = async () => {
  loadingUnassign.value = true;
  await policiesService.unassignServiceConsumerAgreementFromOrgUnit(
    serviceConsumerId.value,
    subscriptionToUnassign!.value!.id,
    props.unit.id,
  );
  loadingUnassign.value = false;
  await getSubscriptionAgreements();
  toggleConfirmUnassign();
};

const getServiceProviders = async () => {
  if (!subscriptions.value?.results) return;
  const service_provider_ids = subscriptions.value.results.map(
    (subscription) => subscription.service_provider_id,
  );
  serviceProviders.value =
    await organizationsService.getOrganizationServiceProvidersDetails(
      props.organizationId,
      service_provider_ids,
    );
};

const handleUpdateParams = async (params: TableRequestParams) => {
  initialQueryParams = { ...initialQueryParams, ...params };
  if (serviceConsumerId.value == "") {
    const userProfile = await authService.getProfile();
    if (userProfile?.org) {
      serviceConsumerId.value = userProfile.org;
    }
  }
  await getSubscriptionAgreements();
};

const dropdownItems = (
  row: ServiceConsumerAgreementRead,
): TypeDropdownItem[] => {
  selectedSubscription.value = row;

  const items: TypeDropdownItem[] = [];

  const unit = {
    id: props.unit.id,
    name: props.unit.name,
  };

  if (row.has_optional_policies) {
    items.push({
      label: "Manage optional policies",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      onClick: () => onDialogManageOptionalPoliciesOpen(unit),
    });
  }

  items.push({
    label: "Remove subscription",
    type: "button",
    isDisabled: props.isSCViewerOnly,
    color: "error",
    onClick: () => {
      tryUnassign(row);
    },
  });

  return items;
};

const onDialogManageOptionalPoliciesOpen = async (unit: {
  id: string;
  name: string;
}) => {
  selectedUnit.value = unit;
  isDialogManageOptionalPoliciesOpen.value = true;
};

const onDialogManageOptionalPoliciesClose = () => {
  isDialogManageOptionalPoliciesOpen.value = false;
};

const detailedViewLink = (row: AgreementTypeRead) =>
  `/sc/subscriptions/${row?.id}`;

onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.org) {
    serviceConsumerId.value = userProfile.org;
  }
});
</script>
<template>
  <m-m-table
    :is-loading="isLoading"
    :headers="headers"
    :rows="subscriptions?.results || []"
    :total-rows="subscriptions?.total"
    cy="subscriptions-table"
    :description="description"
    show-search
    :empty-state="emptyState"
    @update-params="handleUpdateParams"
  >
    <template #empty-state-button>
      <m-m-button
        variant="elevated"
        size="small"
        prepend-icon="plus-white"
        class="mm-ml-auto"
        cy="empty-state-assign-subscription-button"
        :disabled="isSubscriptionBtnDisabled"
        @click="toggleAssignDialog"
      >
        Add Subscription
      </m-m-button>
    </template>

    <template #agreement_type_name="{ row }">
      <m-m-link
        :to="detailedViewLink(row)"
        font-weigth="500"
        :data-cy="`column-name-${row.id}`"
      >
        {{ row.agreement_type_name }}
      </m-m-link>
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
    <template #service_provider_name="{ row }">
      <span class="font-weight-500">
        {{ getServiceProviderName(serviceProviders, row.service_provider_id) }}
      </span>
    </template>
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        prepend-icon="plus"
        class="mm-ml-auto"
        cy="assign-subscription-button"
        :disabled="isSubscriptionBtnDisabled"
        @click="toggleAssignDialog"
      >
        Add Subscription
      </m-m-button>
    </template>
  </m-m-table>

  <assign-license-to-organization-unit
    v-if="serviceConsumerId"
    :is-open="isAssignDialogOpen"
    :unit="unit"
    :error-alert="errorAlert"
    :service-consumer-id="serviceConsumerId"
    :is-saving="isSaving"
    :assigned-licenses="subscriptions?.results || []"
    category="SUBSCRIPTION"
    @close="toggleAssignDialog"
    @submit="submit"
  />
  <unassign-license-from-organization-unit
    v-if="subscriptionToUnassign"
    :is-open="isConfirmUnassignDialogOpen"
    :license-to-unassign="subscriptionToUnassign"
    :unit="unit"
    :loading-unassign="loadingUnassign"
    :service-consumer-id="serviceConsumerId"
    category="SUBSCRIPTION"
    @close="toggleConfirmUnassign"
    @submit="onUnassignButtonClick"
  />
  <dialog-manage-optional-policies-for-unit
    :is-open="isDialogManageOptionalPoliciesOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="selectedSubscription?.id"
    :unit="selectedUnit"
    @close="onDialogManageOptionalPoliciesClose"
  />
</template>

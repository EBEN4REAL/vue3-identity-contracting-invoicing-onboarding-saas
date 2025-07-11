<script setup lang="ts">
import { ComputedRef, PropType, Ref, computed, onMounted, ref } from "vue";
import { authService } from "~/auth/auth.service";
import { OrganizationRead, ServiceProviderRead } from "~/iam/iam.types";
import type { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import {
  EmptyStateType,
  TablePagination,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { SubmitType } from "~/service-providers/Licenses/licenses.types";
import { policiesService } from "~/service-providers/policies.service";
import AssignLicenseToOrganization from "./Dialogs/AssignLicenseToOrganization.vue";
import UnassignLicenseFromOrganization from "./Dialogs/UnassignLicenseFromOrganization.vue";
import { organizationsService } from "../organizations.service";
import { ErrorAlertProp } from "../OrganizationGroups/types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { getServiceProviderName } from "~/mm_ui_kit/src/helpers/serviceProviderUtils";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { SCAgreementRead } from "~/policies/policies.types";

const props = defineProps({
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});
const forceUpdate = ref(0);
const serviceConsumerId: Ref<string> = ref("");
const serviceProviders: Ref<ServiceProviderRead[] | null> = ref(null);
const licenses: Ref<TableResponse<SCAgreementRead>> = ref(null);
const isAssignDialogOpen: Ref<boolean> = ref(false);
const licenseToUnassign: Ref<SCAgreementRead | null> = ref(null);
const loadingUnassign: Ref<boolean> = ref(false);
const isUnassignDialogOpen: Ref<boolean> = ref(false);
const isSaving: Ref<boolean> = ref(false);
const isInErrorState: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const isLoading: Ref<boolean> = ref(true);
const agreements: Ref<SCAgreementRead[]> = ref([]);
const description: string = "All licenses added to the entire organization.";
const emptyState: EmptyStateType = {
  icon: sectionIcons["organizationDetails"],
  title: "No licenses",
  description: "No licenses have been added to the entire organization",
};

const headers = [
  {
    key: "agreement_type_name",
    label: "License name",
    sortable: true,
    sortIcon: true,
    order: "asc",
    sortName: "agreement_type.name",
  },
  {
    key: "service_provider_name",
    label: "Organization name",
    sortable: true,
  },
  {
    label: "",
    key: "actions",
    sortable: false,
  },
];

const isButtonAddLicenseDisabled: ComputedRef<boolean> = computed(
  () => isLicenseBtnDisabled.value || props.isSCViewerOnly,
);

const isLicenseBtnDisabled: ComputedRef<boolean> = computed(
  () => agreements.value.length === 0,
);

const toggleConfirmUnassign = () => {
  isUnassignDialogOpen.value = !isUnassignDialogOpen.value;
};

const tryUnassign = (row: SCAgreementRead): void => {
  licenseToUnassign.value = row;
  toggleConfirmUnassign();
};

const actionsInDropdown = (row: SCAgreementRead): TypeDropdownItem[] => [
  {
    label: "Remove license",
    type: "button",
    color: "error",
    isDisabled: props.isSCViewerOnly,
    onClick: () => {
      tryUnassign(row);
    },
  },
];
const getServiceProviders = async () => {
  const service_provider_ids = licenses.value?.results.map(
    (license) => license.service_provider_id,
  );
  serviceProviders.value =
    await organizationsService.getOrganizationServiceProvidersDetails(
      props.organization.id,
      service_provider_ids,
    );
};
const fetchLicenses = async (params?: TableRequestParams) => {
  isLoading.value = true;
  const orgId = props.organization?.id;
  if (!orgId) {
    return;
  }
  const initialQueryParams: TablePagination = {
    limit: ITEMS_PER_PAGE[0],
    offset: "0",
  };

  if (serviceConsumerId.value) {
    licenses.value = await policiesService.getServiceConsumerAgreements(
      serviceConsumerId.value,
      {
        ...initialQueryParams,
        ...params,
        cancelled: false,
        assigned_own_organization: true,
        category: "ACCESS",
      },
    );
  }
  isLoading.value = false;
};

const onUnassignButtonClick = async () => {
  loadingUnassign.value = true;
  await policiesService.unassignServiceConsumerAgreementToOrganization(
    serviceConsumerId.value,
    licenseToUnassign!.value!.id,
  );
  loadingUnassign.value = false;
  forceUpdate.value++;
  toggleConfirmUnassign();
};

const toggleAssignDialog = () => {
  isAssignDialogOpen.value = !isAssignDialogOpen.value;
};

const resetErrorState = () => {
  isInErrorState.value = false;
  alertText.value = "";
};

const errorAlert: Ref<ErrorAlertProp> = ref({
  resetErrorState,
  alertText,
  isInErrorState,
});

const submit = async (payload: SubmitType) => {
  try {
    isSaving.value = true;
    await policiesService.assignServiceConsumerAgreementToOrganization(
      serviceConsumerId.value,
      payload.agreement_id,
      payload.optional_policy_ids,
    );
    isSaving.value = false;
    forceUpdate.value++;
  } catch (error) {
    isSaving.value = false;
    isInErrorState.value = true;
    alertText.value = "Failed to add license to organization";
  }
};
const handleUpdateParams = async (params?: TableRequestParams) => {
  if (serviceConsumerId.value == "") {
    const userProfile = await authService.getProfile();
    if (userProfile?.org) {
      serviceConsumerId.value = userProfile.org;
    }
  }
  await fetchLicenses(params);
  await getServiceProviders();
};
const updateOrgLicenses = (licenses: SCAgreementRead[]) => {
  agreements.value = licenses;
};

const detailedViewLink = (row: SCAgreementRead): string =>
  props.isSCViewerOnly ? "" : `/sc/access-licenses/${row.id}`;

onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.org) {
    serviceConsumerId.value = userProfile.org;
  }
});
</script>

<template>
  <m-m-table
    :key="forceUpdate"
    cy="licenses-table"
    :description="description"
    :is-loading="isLoading"
    :headers="headers"
    :rows="licenses?.results || []"
    :total-rows="licenses?.total"
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
        cy="empty-state-assign-license-button"
        :is-disabled="isButtonAddLicenseDisabled"
        @click="toggleAssignDialog"
      >
        Add license
      </m-m-button>
    </template>
    <template #agreement_type_name="{ row }">
      <m-m-link
        :to="detailedViewLink(row)"
        font-weigth="500"
        :data-cy="`column-licenses-name-${row.id}`"
      >
        <span class="font-weight-500">
          {{ row.agreement_type_name || "-" }}
        </span>
      </m-m-link>
    </template>
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        prepend-icon="plus"
        class="mm-ml-auto"
        cy="assign-license-button"
        :is-disabled="isButtonAddLicenseDisabled"
        @click="toggleAssignDialog"
      >
        Add license
      </m-m-button>
    </template>
    <template #service_provider_name="{ row }">
      <span class="font-weight-500">
        {{ getServiceProviderName(serviceProviders, row.service_provider_id) }}
      </span>
    </template>
    <template #actions="{ row }">
      <div class="mm-flex mm-flex-justify-end">
        <m-m-dropdown
          list-side="left"
          :items="actionsInDropdown(row)"
          :cy="`actions-dropdown-${row.id}`"
        >
          <template #activator>
            <m-m-button
              prepend-icon="dots-vertical"
              variant="text"
              :cy="`actions-${row.id}`"
              :is-disabled="isSCViewerOnly"
            />
          </template>
        </m-m-dropdown>
      </div>
    </template>
  </m-m-table>
  <assign-license-to-organization
    v-if="serviceConsumerId"
    :service-consumer-id="serviceConsumerId"
    :organization="organization"
    :is-open="isAssignDialogOpen"
    :is-saving="isSaving"
    :error-alert="errorAlert"
    :assigned-licenses="licenses?.results"
    category="ACCESS"
    @update-org-licenses="updateOrgLicenses"
    @close="toggleAssignDialog"
    @submit="submit"
  />
  <unassign-license-from-organization
    v-if="serviceConsumerId"
    :loading-unassign="loadingUnassign"
    :license-to-unassign="licenseToUnassign"
    :is-open="isUnassignDialogOpen"
    :organization="organization"
    @close="toggleConfirmUnassign"
    @submit="onUnassignButtonClick"
  />
</template>

<style scoped></style>

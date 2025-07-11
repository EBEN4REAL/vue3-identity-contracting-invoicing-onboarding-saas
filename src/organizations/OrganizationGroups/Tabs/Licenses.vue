<script lang="ts" setup>
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import { authService } from "~/auth/auth.service";
import { ITEMS_PER_PAGE } from "~/common/constants";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { policiesService } from "~/service-providers/policies.service";
import { ServiceConsumerAgreementRead } from "~/organizations/licenses/licenses.types";
import { OrganizationGroupRead } from "~/iam/iam.types";
import AssignLicenseToGroup from "~/organizations/OrganizationGroups/Dialogs/AssignLicenseToGroup.vue";
import {
  TypeFormattedLicenses,
  TypeLicenseItemInRow,
} from "~/organizations/OrganizationGroups/types";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogManageOptionalPoliciesForGroup from "~/organizations/licenses/LicenseDetails/Dialogs/DialogManageOptionalPoliciesForGroup.vue";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";

const emptyState: EmptyStateType = {
  icon: sectionIcons["groups"],
  title: "Add license to group",
  description: "All users in this group can then access and use the license.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/provide-access-to-employees#manage-license-for-group",
};

const headers = [
  {
    key: "name",
    label: "License name",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "actions",
    label: "",
  },
];

const props = defineProps({
  group: {
    type: Object as PropType<OrganizationGroupRead>,
    required: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const selectedGroup: Ref<{ id: string; name: string } | null> = ref(null);
const isDialogManageOptionalPoliciesOpen: Ref<boolean> = ref(false);
const selectedLicense: Ref<ServiceConsumerAgreementRead | null> = ref(null);
const serviceConsumerId: Ref<string> = ref("");
const licenses: Ref<TableResponse<ServiceConsumerAgreementRead> | null> =
  ref(null);
const isConfirmUnassignDialogOpen: Ref<boolean> = ref(false);
const isAssignDialogOpen: Ref<boolean> = ref(false);
const licenseToUnassign: Ref<TypeLicenseItemInRow | null> = ref(null);
const loadingUnassign: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(true);
const agreements: Ref<ServiceConsumerAgreementRead[]> = ref([]);
const description: string = "All licenses assigned to this group.";

const assignedLicenses: ComputedRef<TypeFormattedLicenses[]> = computed(
  () =>
    licenses.value?.results.map((license) => ({
      id: license.id,
      name: license.agreement_type_name,
      description: license.description,
      has_optional_policies: license.has_optional_policies,
    })) || [],
);

const title: ComputedRef<string> = computed(
  () => `Remove ${licenseToUnassign.value?.name}`,
);

const subtitle: ComputedRef<string> = computed(
  () =>
    `Are you sure you want to remove the license from the ${props.group.name} group?`,
);

const isLicenseBtnDisabled: ComputedRef<boolean> = computed(
  () => agreements.value.length === 0 || props.isSCViewerOnly,
);

const dropdownItems = (
  row: ServiceConsumerAgreementRead,
): TypeDropdownItem[] => {
  selectedLicense.value = row;
  const items: TypeDropdownItem[] = [];

  const groupInfo = {
    id: props.group.id,
    name: props.group.name,
  };

  if (row.has_optional_policies) {
    items.push({
      label: "Manage optional policies",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      onClick: () => onDialogManageOptionalPoliciesOpen(groupInfo),
    });
  }

  items.push({
    label: "Remove license",
    type: "button",
    isDisabled: props.isSCViewerOnly,
    color: "error",
    onClick: () => {
      tryUnassign(row);
    },
  });

  return items;
};

const onDialogManageOptionalPoliciesOpen = async (group: {
  id: string;
  name: string;
}) => {
  selectedGroup.value = group;
  isDialogManageOptionalPoliciesOpen.value = true;
};

const onDialogManageOptionalPoliciesClose = () => {
  isDialogManageOptionalPoliciesOpen.value = false;
};

const handleUpdateParams = async (params?: TableRequestParams) => {
  if (serviceConsumerId.value == "") {
    const userProfile = await authService.getProfile();
    if (userProfile?.org) {
      serviceConsumerId.value = userProfile.org;
    }
  }
  await getLicenses(params);
};

const getLicenses = async (params?: TableRequestParams) => {
  isLoading.value = true;
  if (!serviceConsumerId.value) return;

  licenses.value = await policiesService.getServiceConsumerGroupAgreements(
    serviceConsumerId.value,
    props.group.id as string,
    params
      ? { category: "ACCESS", ...params }
      : { category: "ACCESS", limit: ITEMS_PER_PAGE[0], offset: "0" },
  );
  isLoading.value = false;
};

const tryUnassign = (row: TypeLicenseItemInRow) => {
  licenseToUnassign.value = row;
  toggleConfirmUnassign();
};

const toggleConfirmUnassign = () => {
  isConfirmUnassignDialogOpen.value = !isConfirmUnassignDialogOpen.value;
};

const toggleAssignDialog = () => {
  isAssignDialogOpen.value = !isAssignDialogOpen.value;
};

const onUnassignButtonClick = async () => {
  if (licenseToUnassign.value) {
    loadingUnassign.value = true;

    await policiesService.unassignServiceConsumerAgreementFromGroup(
      serviceConsumerId.value,
      licenseToUnassign.value.id,
      props.group.id as string,
    );

    loadingUnassign.value = false;
    toggleConfirmUnassign();
    await getLicenses();
  }
};

const updateOrgLicenses = (licenses: ServiceConsumerAgreementRead[]) => {
  agreements.value = licenses;
};

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
    :rows="assignedLicenses"
    :total-rows="licenses?.total"
    cy="licenses-table"
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
        cy="empty-state-assign-license-button"
        :disabled="isLicenseBtnDisabled"
        @click="toggleAssignDialog"
      >
        Add license
      </m-m-button>
    </template>
    <template #name="{ row }">
      <m-m-link
        :to="`/sc/access-licenses/${row.id}`"
        font-weigth="500"
        :cy="`license-${row.id}`"
      >
        {{ row.name || "-" }}
      </m-m-link>
    </template>

    <template #actions="{ row }">
      <m-m-dropdown
        :cy="`licenses-dropdown-${row.id}`"
        :items="dropdownItems(row)"
      >
        <template #activator>
          <m-m-button
            prepend-icon="dots-vertical"
            variant="text"
            :cy="`actions-button-${row.id}`"
          />
        </template>
      </m-m-dropdown>
    </template>
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        prepend-icon="plus"
        class="mm-ml-auto"
        cy="assign-license-button"
        :disabled="isLicenseBtnDisabled"
        @click="toggleAssignDialog"
      >
        Add license
      </m-m-button>
    </template>
  </m-m-table>

  <assign-license-to-group
    v-if="serviceConsumerId"
    :is-open="isAssignDialogOpen"
    :group="group"
    :service-consumer-id="serviceConsumerId"
    :assigned-licenses="assignedLicenses"
    category="ACCESS"
    @update-org-licenses="updateOrgLicenses"
    @close="toggleAssignDialog"
    @submit="getLicenses"
  />

  <m-m-dialog
    :is-open="isConfirmUnassignDialogOpen"
    :title="title"
    :subtitle="subtitle"
    icon="warning"
    icon-color="error"
    cy="confirm-unassign"
    @close="toggleConfirmUnassign"
  >
    <template #footer>
      <m-m-button
        variant="outlined"
        data-cy="button-cancel-unassign"
        @click="toggleConfirmUnassign"
      >
        Cancel
      </m-m-button>
      <m-m-button
        variant="danger"
        :loading="loadingUnassign"
        data-cy="button-confirm-unassign"
        @click="onUnassignButtonClick"
      >
        Yes, remove
      </m-m-button>
    </template>
  </m-m-dialog>

  <dialog-manage-optional-policies-for-group
    :is-open="isDialogManageOptionalPoliciesOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="selectedLicense?.id"
    :group="selectedGroup"
    @close="onDialogManageOptionalPoliciesClose"
  />
</template>

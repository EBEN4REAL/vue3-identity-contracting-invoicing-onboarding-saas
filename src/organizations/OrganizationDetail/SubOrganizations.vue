<script setup lang="ts">
import { organizationsService } from "~/organizations/organizations.service";
import { computed, onMounted, PropType, ref, Ref } from "vue";
import { Industry, OrganizationRead } from "~/iam/iam.types";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { authService } from "~/auth/auth.service";
import CreateSubOrganizationDialog from "~/organizations/OrganizationDetail/CreateSubOrganizationDialog.vue";
import { INDUSTRIES, ITEMS_PER_PAGE } from "~/common/constants";
import { ComputedRef } from "vue";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { useUiStore } from "~/stores/useUiStore";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";

const uiStore = useUiStore();

const emptyState: EmptyStateType = {
  icon: sectionIcons["organizationDetails"],
  title: "Create a sub-organization",
  description:
    "A sub-organization is an organization (legal entity), that has a parent reference to your organization.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/set-up-your-organization#sub-organizations",
};

const SUB_ORGANIZATIONS_HEADERS = [
  { label: "Name", key: "name", sortable: true, order: "asc", sortIcon: true },
  { label: "Domains", key: "domains" },
  { label: "Industry", key: "industry" },
  { label: "Number of employees", key: "number_of_employees_range" },
  { label: "", key: "actions" },
];

const props = defineProps({
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
  },
});
const forceUpdate = ref(0);
const subOrganizationsResponse: Ref<TableResponse<OrganizationRead>> =
  ref(null);
const isCreateSubOrganizationDialogOpen: Ref<boolean> = ref(false);
const isConfirmDeleteDialogOpen: Ref<boolean> = ref(false);
const subOrgIdToDelete: Ref<string | null> = ref(null);
const isOrgAdmin: Ref<boolean> = ref(false);
const isErrorMessageVisible: Ref<boolean> = ref(false);
const errorMessage: Ref<string> = ref("");
const deleteInProgress: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(true);

onMounted(async () => {
  isOrgAdmin.value = await authService.isUserOrgAdmin();
  await fetchSubOrganizations();
});

const fetchSubOrganizations = async (params?: TableRequestParams) => {
  isLoading.value = true;
  const orgId = props.organization?.id;
  if (!orgId) {
    return;
  }

  subOrganizationsResponse.value =
    await organizationsService.getSubOrganizations(
      orgId,
      params ? params : { limit: ITEMS_PER_PAGE[0], offset: "0" },
    );
  isLoading.value = false;
};

const toggleConfirmDelete = () => {
  isConfirmDeleteDialogOpen.value = !isConfirmDeleteDialogOpen.value;
};

const onDeleteButtonClick = async () => {
  const orgId = props.organization?.id;
  const subOrgId = subOrgIdToDelete.value;

  if (!orgId || !subOrgId) {
    return;
  }

  deleteInProgress.value = true;
  try {
    await organizationsService.deleteSubOrganization(orgId, subOrgId);
  } catch (error) {
    isErrorMessageVisible.value = true;
    errorMessage.value = "Error deleting sub-organization";
  }
  deleteInProgress.value = false;
  toggleConfirmDelete();

  forceUpdate.value++;
};

const toggleCreateDialog = () => {
  isCreateSubOrganizationDialogOpen.value =
    !isCreateSubOrganizationDialogOpen.value;
};

const onCreateSuborganization = async () => {
  forceUpdate.value++;
};

const getDropdownItems: TypeDropdownItem = (row: OrganizationRead) => [
  {
    label: "Delete",
    type: "button",
    isDisabled: uiStore.isSCViewerOnly,
    onClick: () => {
      subOrgIdToDelete.value = row.id;
      toggleConfirmDelete();
    },
  },
];

const mapIndustryTitle = (industry: Industry) => {
  return INDUSTRIES.find((i) => i.value === industry)?.title ?? "";
};
const description: ComputedRef<string> = computed(
  () => `Your organization has
          ${subOrganizationsResponse.value?.total.toString() ?? 0}
          sub-organizations linked. Sub-organizations are separate organizations (and legal entities) that are managed individually on Veriam, but do have a (legal) connection to your organization.`,
);

const handleUpdateParams = async (params: TableRequestParams) => {
  await fetchSubOrganizations(params);
};
</script>

<template>
  <div class="sub-organizations">
    <m-m-alert
      v-if="isErrorMessageVisible"
      status="error"
      class="mm-my-4"
      cy="error-message"
      @close="isErrorMessageVisible = false"
    >
      {{ errorMessage }}
    </m-m-alert>

    <m-m-table
      :key="forceUpdate"
      :rows="subOrganizationsResponse?.results! || []"
      :total-rows="subOrganizationsResponse?.total || 0"
      :is-loading="isLoading"
      :headers="SUB_ORGANIZATIONS_HEADERS"
      cy="sub-organizations-table"
      :description="description"
      show-search
      :empty-state="emptyState"
      @update-params="handleUpdateParams"
    >
      <template #name="{ row }">
        <div class="mm-flex mm-flex-align-center mm-flex-gap-4">
          {{ row.name }}
        </div>
      </template>
      <template #domains="{ row }">
        {{ row.domains && row.domains.map(({ name }) => name).join(", ") }}
      </template>
      <template #industry="{ row }">
        {{ mapIndustryTitle(row.industry) }}
      </template>
      <template v-if="isOrgAdmin" #actions="{ row }">
        <div class="mm-flex mm-flex-justify-end">
          <m-m-dropdown
            list-side="left"
            :items="getDropdownItems(row)"
            :cy="`actions-dropdown-${row.id}`"
          >
            <template #activator>
              <m-m-button
                prepend-icon="dots-vertical"
                variant="text"
                :cy="`actions-${row.id}`"
              />
            </template>
          </m-m-dropdown>
        </div>
      </template>
      <template #action>
        <m-m-button
          variant="outlined"
          size="small"
          data-cy="button-create-sub-organization"
          :is-disabled="uiStore.isSCViewerOnly"
          @click="toggleCreateDialog"
        >
          Create sub-organization
        </m-m-button></template
      >
    </m-m-table>

    <CreateSubOrganizationDialog
      :is-open="isCreateSubOrganizationDialogOpen"
      :organization="organization"
      @close="toggleCreateDialog"
      @submit="onCreateSuborganization"
    />
  </div>
  <m-m-dialog
    :is-open="isConfirmDeleteDialogOpen"
    title="Delete sub-organization"
    icon="trash"
    icon-color="error"
    subtitle="Are you sure you want to delete this sub-organization?"
    cy="confirm-delete-sub-organization"
    @close="toggleConfirmDelete"
  >
    <template #footer>
      <m-m-button
        variant="outlined"
        data-cy="button-cancel-delete-sub-organization"
        @click="toggleConfirmDelete"
      >
        Cancel
      </m-m-button>
      <m-m-button
        variant="danger"
        data-cy="button-confirm-delete-sub-organization"
        :loading="deleteInProgress"
        @click="onDeleteButtonClick"
      >
        Delete
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
.sub-organizations {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-icon {
    display: inline;
    padding: 5px;
    background: #f3f4f6;
    border-radius: 4px;
  }
}
</style>

<script setup lang="ts">
import { organizationsService } from "~/organizations/organizations.service";
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import { OrganizationGroupRead } from "~/iam/iam.types";
import { authService } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import OrganizationGroupCreate from "~/organizations/OrganizationGroups/Dialogs/OrganizationGroupCreate.vue";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { Button } from "~/mm_ui_kit/src/types/overviewPage.types";
import { useUiStore } from "~/stores/useUiStore";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";

const uiStore = useUiStore();

const emptyState: EmptyStateType = {
  icon: sectionIcons["groups"],
  title: "Create your first group",
  description:
    "Groups can represent different roles, project teams, or any other collection of users that need to be grouped together for administrative purposes.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/set-up-your-organization#groups",
};
const GROUPS_HEADERS = [
  {
    label: "Group name",
    key: "name",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
  { label: "Description", key: "description" },
  {
    label: "Number of users",
    key: "users",
    sortable: true,
    order: "asc",
    sortName: "users_count",
    sortIcon: true,
  },
  { label: "", key: "actions" },
];

const isOrgAdmin: Ref<boolean> = ref(false);
const isOrgEditor: Ref<boolean> = ref(false);
const organizationGroups: Ref<TableResponse<OrganizationGroupRead>> = ref(null);
const isCreateGroupDialogOpen: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(true);
const isConfirmDeleteDialogOpen: Ref<boolean> = ref(false);
const groupToDelete: Ref<OrganizationGroupRead | null> = ref(null);

const userProfile: Ref<UserProfileMM | null> = ref(null);

const orgId = computed(() => userProfile.value?.org);

const loadingDelete = ref(false);

const onDeleteButtonClick = async () => {
  if (orgId.value && groupToDelete.value) {
    loadingDelete.value = true;
    await organizationsService
      .deleteOrganizationGroup(groupToDelete.value?.id, orgId.value)
      .catch((error) => {
        throw error;
      });
    await fetchOrganizationGroups({
      limit: ITEMS_PER_PAGE[0],
      offset: "0",
      sort: GROUPS_HEADERS[0].key + ":" + GROUPS_HEADERS[0].order,
    });
    isConfirmDeleteDialogOpen.value = false;
    groupToDelete.value = null;
    loadingDelete.value = false;
  }
};

const fetchOrganizationGroups = async (params: TableRequestParams) => {
  isLoading.value = true;
  if (userProfile.value == null) {
    userProfile.value = await authService.getProfile();
  }

  if (userProfile.value?.org) {
    organizationGroups.value = await organizationsService.getOrganizationGroups(
      userProfile.value.org,
      params,
    );
  }
  isLoading.value = false;
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  isOrgAdmin.value = await authService.isUserOrgAdmin();
  isOrgEditor.value = await authService.isUserOrgEditor();
});

const toggleConfirmDelete = () => {
  isConfirmDeleteDialogOpen.value = !isConfirmDeleteDialogOpen.value;
};

const toggleCreateDialog = () => {
  isCreateGroupDialogOpen.value = !isCreateGroupDialogOpen.value;
};

const updateTableParamsHandler = (params: TableRequestParams) => {
  fetchOrganizationGroups(params);
};

const getDropdownItems: TypeDropdownItem = (row: OrganizationGroupRead) => [
  {
    label: "View details",
    type: "link",
    to: `/sc/groups/${row.id}`,
  },
  {
    label: "Delete",
    hint: cannotDeleteGroupMessage(row),
    isDisabled: !canDeleteGroup(row) || uiStore.isSCViewerOnly,
    type: "button",
    color: "error",
    onClick: () => {
      groupToDelete.value = row;
      toggleConfirmDelete();
    },
  },
];

const canDeleteGroup = (group: OrganizationGroupRead) => {
  return (
    (isOrgAdmin.value || isOrgEditor.value) &&
    (!group.users || group.users.length <= 0) &&
    !group.role
  );
};

const cannotDeleteGroupMessage = (group: OrganizationGroupRead) => {
  if (group.role) {
    return "You cannot delete this group";
  } else if (group.users?.length) {
    return `You cannot delete this group as it is associated with ${group.users?.length} users`;
  }

  return "";
};

const onGroupCreate = async () => {
  await fetchOrganizationGroups({
    limit: ITEMS_PER_PAGE[0],
    offset: "0",
    sort: GROUPS_HEADERS[0].key + ":" + GROUPS_HEADERS[0].order,
  });
};

const buttons: ComputedRef<Button[]> = computed(() => [
  {
    key: "create_group",
    action: toggleCreateDialog,
    isVisible: isOrgAdmin.value || isOrgEditor.value,
    isDisabled: uiStore.isSCViewerOnly,
  },
]);
</script>

<template>
  <m-m-overview-page
    resource-id="groups.overview"
    :show-config-banner="false"
    :buttons="buttons"
  >
    <m-m-table
      :headers="GROUPS_HEADERS"
      :rows="organizationGroups?.results"
      :is-loading="isLoading"
      :total-rows="organizationGroups?.total"
      cy="organization-groups-table"
      :empty-state="emptyState"
      show-search
      @update-params="updateTableParamsHandler"
    >
      <template #empty-state-button>
        <MMButton
          v-if="isOrgAdmin || isOrgEditor"
          prepend-icon="plus-white"
          cy="empty-state-create-group-button"
          @click="toggleCreateDialog"
        >
          Create group
        </MMButton>
      </template>
      <template #name="{ row }">
        <m-m-link :to="`/sc/groups/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #description="{ row }">
        <m-m-text-ellipsis>{{ row.description }}</m-m-text-ellipsis>
      </template>
      <template #users="{ row }">{{ row.users?.length }}</template>
      <template #actions="{ row }">
        <div class="mm-flex mm-flex-justify-end">
          <m-m-dropdown
            list-side="left"
            :cy="`actions-dropdown-${row.id}`"
            max-width="218px"
            :items="getDropdownItems(row)"
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
      </template> </m-m-table
  ></m-m-overview-page>

  <organization-group-create
    :organization-id="userProfile?.org"
    :is-open="isCreateGroupDialogOpen"
    @submit="onGroupCreate"
    @close="toggleCreateDialog"
  />
  <m-m-dialog
    :is-open="isConfirmDeleteDialogOpen"
    :title="`Delete ${groupToDelete?.name}?`"
    icon="trash"
    subtitle="Are you sure you want to remove this group? Access to the users in this group will be impacted."
    cy="confirm-delete-group"
    @close="toggleConfirmDelete"
  >
    <template #footer>
      <m-m-button
        variant="outlined"
        data-cy="button-cancel-delete-group"
        @click="toggleConfirmDelete"
      >
        Cancel
      </m-m-button>
      <m-m-button
        variant="danger"
        :loading="loadingDelete"
        data-cy="button-confirm-delete-group"
        @click="onDeleteButtonClick"
      >
        Delete
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style lang="scss" scoped>
.mm-groups-dropdown-item {
  width: 100%;
  transition: background-color 0.3s;
  will-change: background-color;

  &:hover {
    background-color: #eaecf0;
  }

  &-disabled {
    max-width: 180px;
    color: #4d5761;
    font-size: 11px;
    line-height: 15px;
  }
}
</style>

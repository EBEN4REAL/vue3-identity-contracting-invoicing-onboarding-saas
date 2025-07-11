<script setup lang="ts">
import { computed, onMounted, PropType, ref, Ref } from "vue";
import { OrganizationGroupRead, OrganizationUserRead } from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import {
  ORGANIZATION_USER_STATUS_MAP,
  JOB_ROLES_MAP,
  ITEMS_PER_PAGE,
} from "~/common/constants";
import {
  EmptyStateType,
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import GroupUserAdd from "~/organizations/OrganizationGroups/Tabs/Users/Dialogs/GroupUserAdd.vue";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";

const props = defineProps({
  orgId: {
    type: String,
    required: true,
  },
  group: {
    type: Object as PropType<OrganizationGroupRead>,
    required: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});
const emptyState: EmptyStateType = {
  icon: sectionIcons["groups"],
  title: "Add users to group",
  description:
    "Add users to this group to manage access for all users part of it.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/set-up-your-organization#groups",
};
const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    searchable: true,
  },
  {
    key: "email",
    label: "Email address",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "job_role",
    label: "Job title",
  },
  {
    key: "actions",
    label: "",
  },
];

const emit = defineEmits(["update"]);

const organizationGroupUsers: Ref<TableResponse<OrganizationUserRead> | null> =
  ref(null);
const isConfirmDeleteDialogOpen: Ref<boolean> = ref(false);
const isAddUserDialogOpen: Ref<boolean> = ref(false);
const userToRemove: Ref<OrganizationUserRead | null> = ref(null);
const isLoading: Ref<boolean> = ref(true);
const description: string = "All users part of this group.";
const fetchUsers = async (params?: TableRequestParams) => {
  isLoading.value = true;
  organizationGroupUsers.value =
    await organizationsService.getOrganizationGroupUsers(
      props.orgId,
      props.group.id,
      params ? params : { limit: ITEMS_PER_PAGE[0], offset: "0" },
    );

  emit("update");
  isLoading.value = false;
};

const toggleConfirmDelete = () => {
  isConfirmDeleteDialogOpen.value = !isConfirmDeleteDialogOpen.value;
};

const toggleAddUser = () => {
  isAddUserDialogOpen.value = !isAddUserDialogOpen.value;
};

const tryToRemoveUser = (user: OrganizationUserRead) => {
  userToRemove.value = user;
  toggleConfirmDelete();
};

const loadingDelete = ref(false);

const removeUserFromGroup = async () => {
  if (userToRemove.value) {
    loadingDelete.value = true;
    await organizationsService.deleteUserFromOrganizationGroup(
      props.orgId as string,
      props.group.id as string,
      userToRemove.value?.user_id as string,
    );
    await fetchUsers();
    toggleConfirmDelete();
    userToRemove.value = null;
    loadingDelete.value = false;
  }
};

const handleUpdateParams = (params: TableRequestParams) => {
  fetchUsers(params);
};

const userName = computed(() => {
  if (userToRemove?.value?.first_name && userToRemove?.value?.last_name) {
    return `${userToRemove?.value.first_name} ${userToRemove?.value.last_name}`;
  } else {
    return `${userToRemove?.value?.email}`;
  }
});

const getUserDropdownItems: TypeDropdownItem = (row: OrganizationUserRead) => [
  {
    label: "View user",
    type: "link",
    to: `/sc/users/${row.id}`,
  },
  {
    label: "Remove from group",
    type: "button",
    isDisabled: props.isSCViewerOnly,
    color: "error",
    onClick: () => {
      tryToRemoveUser(row);
    },
  },
];

const userFullName = (
  firstName: Pick<OrganizationUserRead, "first_name">,
  lastName: Pick<OrganizationUserRead, "last_name">,
  email: Pick<OrganizationUserRead, "email">,
) => (firstName || lastName ? `${firstName} ${lastName}` : `${email}`);

onMounted(async () => {
  await fetchUsers();
});
</script>

<template>
  <m-m-table
    :headers="headers"
    :is-loading="isLoading"
    :rows="organizationGroupUsers?.results"
    :total-rows="organizationGroupUsers?.total"
    show-search
    :empty-state="emptyState"
    :description="description"
    @update-params="handleUpdateParams"
  >
    <template #empty-state-button>
      <m-m-button
        prepend-icon="plus-white"
        variant="elevated"
        size="small"
        class="mm-ml-auto"
        cy="empty-state-add-user-button"
        :is-disabled="isSCViewerOnly"
        @click="toggleAddUser"
      >
        Add users
      </m-m-button>
    </template>
    <template #name="{ row }">
      <m-m-link
        :to="`/sc/users/${row.id}`"
        font-weigth="500"
        :cy="`table-${row.id}`"
      >
        {{ userFullName(row.first_name, row.last_name, row.email) }}
      </m-m-link>
    </template>

    <template #status="{ row }">
      <m-m-badge :status="ORGANIZATION_USER_STATUS_MAP[row.status]" indicator />
    </template>
    <template #job_role="{ row }">
      {{ JOB_ROLES_MAP[row.job_role] }}
    </template>
    <template #actions="{ row }">
      <m-m-dropdown
        :cy="`dropdown-${row.id}`"
        :items="getUserDropdownItems(row)"
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
        prepend-icon="plus"
        variant="outlined"
        size="small"
        class="mm-ml-auto"
        cy="add-user-button"
        :is-disabled="isSCViewerOnly"
        @click="toggleAddUser"
      >
        Add users
      </m-m-button>
    </template>
  </m-m-table>

  <group-user-add
    v-if="organizationGroupUsers?.results"
    :is-open="isAddUserDialogOpen"
    :organization-id="props.orgId"
    :group="props.group"
    :group-users="organizationGroupUsers?.results"
    @remove-user="tryToRemoveUser"
    @submit="fetchUsers"
    @invited="fetchUsers"
    @close="toggleAddUser"
  />

  <m-m-dialog
    :is-open="isConfirmDeleteDialogOpen"
    title="Remove user"
    icon="warning"
    icon-color="error"
    :subtitle="`Are you sure you want to remove ${userName} from ${props?.group.name}?`"
    cy="confirm-delete-user"
    @close="toggleConfirmDelete"
  >
    <template #footer>
      <m-m-button
        variant="outlined"
        data-cy="button-cancel-delete-user"
        @click="toggleConfirmDelete"
      >
        No
      </m-m-button>
      <m-m-button
        variant="danger"
        :loading="loadingDelete"
        data-cy="button-confirm-delete-user"
        @click="removeUserFromGroup"
      >
        Yes, remove
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

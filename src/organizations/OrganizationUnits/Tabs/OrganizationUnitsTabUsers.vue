<script setup lang="ts">
import { OrganizationUnitRead, OrganizationUserRead } from "~/iam/iam.types";
import { PropType, ref, Ref } from "vue";
import {
  JOB_ROLES_MAP,
  ORGANIZATION_USER_STATUS_MAP,
} from "~/common/constants";
import OrganizationUnitDialogUserAdd from "../Dialogs/OrganizationUnitDialogUserAdd.vue";
import OrganizationUnitUserDialogDelete from "../Dialogs/OrganizationUnitUserDialogDelete.vue";
import { onMounted } from "vue";
import { organizationsService } from "~/organizations/organizations.service";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";

const props = defineProps({
  unit: {
    type: Object as PropType<OrganizationUnitRead>,
    default: () => ({}),
    required: true,
  },
  organizationId: {
    type: String,
    default: "",
    required: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update"]);

const isAddUserDialogOpened = ref(false);
const isLoading: Ref<boolean> = ref(true);

const isDeleteUserFromUnitDialogOpened = ref(false);
const description: string = "All users part of this organizational unit.";
const emptyState: EmptyStateType = {
  icon: sectionIcons["units"],
  title: "Add user to unit",
  description:
    "Add users to this organizational unit to manage access for all users part of it. ",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/set-up-your-organization#organizational-units",
};
const tableHeaders = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    sortName: "first_name",
    order: "asc",
    sortIcon: true,
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

const userToDelete: Ref<OrganizationUserRead | null> = ref(null);
const usersPaginated: Ref<TableResponse<OrganizationUserRead>> = ref(null);
const forceUpdate = ref(0);

const onOpenDeleteUserFromUnitDialog = (userId: string) => {
  userToDelete.value =
    usersPaginated?.value?.results.find((user) => user.id === userId) || null;
  isDeleteUserFromUnitDialogOpened.value = true;
};

const onCloseDeleteUserFromUnitDialog = () => {
  userToDelete.value = null;
  isDeleteUserFromUnitDialogOpened.value = false;
};

const actionsInDropdown = (id: string) => [
  {
    label: "View user",
    type: "link",
    to: `/sc/users/${id}`,
  },
  {
    label: "Remove user",
    type: "button",
    isDisabled: props.isSCViewerOnly,
    color: "error",
    onClick: () => onOpenDeleteUserFromUnitDialog(id),
  },
];

const openAddUserDialog = () => {
  isAddUserDialogOpened.value = true;
};

const closeAddUserDialog = () => {
  isAddUserDialogOpened.value = false;
};

const onOpenAddUserDialog = () => {
  openAddUserDialog();
};

const onCloseAddUserDialog = () => {
  closeAddUserDialog();
};

const onSubmit = () => {
  emit("update");
  forceUpdate.value++;
};

const onInvited = () => {
  emit("update");
  forceUpdate.value++;
};

const handleUpdateParams = async (params: TableRequestParams) => {
  await getUnitUsers(params);
};

const getUnitUsers = async (params?: TableRequestParams) => {
  isLoading.value = true;
  try {
    usersPaginated.value = await organizationsService.getOrganizationUnitUsers(
      props.organizationId,
      props.unit.id,
      params ? params : { limit: ITEMS_PER_PAGE[0], offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch users",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getUnitUsers();
});
</script>

<template>
  <m-m-table
    :key="forceUpdate"
    :is-loading="isLoading"
    :headers="tableHeaders"
    :rows="usersPaginated?.results"
    :description="description"
    :total-rows="usersPaginated?.total"
    show-search
    cy="table-organization-unit-users"
    :empty-state="emptyState"
    @update-params="handleUpdateParams"
  >
    <template #empty-state-button>
      <m-m-button
        variant="elevated"
        size="small"
        prepend-icon="plus-white"
        cy="empty-state-add-user-button"
        :is-disabled="isSCViewerOnly"
        @click="onOpenAddUserDialog"
        >Add user</m-m-button
      >
    </template>
    <template #name="{ row }">
      <m-m-link
        :to="`/sc/users/${row.id}`"
        font-weigth="500"
        :cy="`table-${row.id}`"
      >
        {{
          row.first_name || row.last_name
            ? [row.first_name, row.last_name].join(" ")
            : "-"
        }}
      </m-m-link>
    </template>
    <template #job_role="{ row }"> {{ JOB_ROLES_MAP[row.job_role] }} </template>
    <template #status="{ row }">
      <m-m-badge :status="ORGANIZATION_USER_STATUS_MAP[row.status]" indicator />
    </template>
    <template #actions="{ row }">
      <div class="mm-flex mm-flex-justify-end">
        <m-m-dropdown list-side="left" :items="actionsInDropdown(row.id)">
          <template #activator>
            <m-m-button
              prepend-icon="dots-vertical"
              variant="text"
              cy="button-organization-unit-user-dropdown"
            />
          </template>
        </m-m-dropdown>
      </div>
    </template>
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        prepend-icon="plus"
        cy="add-user-button"
        :is-disabled="isSCViewerOnly"
        @click="onOpenAddUserDialog"
        >Add user</m-m-button
      >
    </template>
  </m-m-table>
  <organization-unit-user-dialog-delete
    v-if="userToDelete"
    :is-open="isDeleteUserFromUnitDialogOpened"
    :organization-id="organizationId"
    :unit="unit"
    :user="userToDelete"
    @delete="
      emit('update');
      onCloseDeleteUserFromUnitDialog();
      forceUpdate++;
    "
    @close="onCloseDeleteUserFromUnitDialog"
  />
  <organization-unit-dialog-user-add
    :organization-id="organizationId"
    :organization-unit="unit"
    :unit-users="usersPaginated?.results"
    :is-open="isAddUserDialogOpened"
    @submit="onSubmit"
    @invited="onInvited"
    @close="onCloseAddUserDialog"
    @remove-user="
      onCloseAddUserDialog();
      onOpenDeleteUserFromUnitDialog($event.user_id);
    "
  />
</template>

<style scoped lang="scss">
.header {
  border-bottom: 1px solid #e5e7eb;

  &-action {
    margin-left: 100px;
  }
}

.action-button {
  width: 20px;
  height: 20px;
}
</style>

<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from "vue";
import { GetUsersRequest, usersService } from "~/users/users.service";
import { PaginationSchema_UserRead_, UserRead } from "~/iam/iam.types";
import { authService } from "~/auth/auth.service";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import {
  TypeDialogConfirmDeleteAdminUser,
  TypeDialogConfirmDisableUserData,
  TypeDialogConfirmEnableUserData,
  TypeDialogConfirmResetPasswordData,
  TypeDialogConfirmResetTOTPData,
} from "~/users/OrganizationUsers/Tabs/Users/types";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogConfirmRemoveUserFromMultipleOrganizations from "~/users/Dialogs/DialogConfirmRemoveUserFromMultipleOrganizations.vue";
import DialogConfirmDisableUser from "./Dialogs/DialogConfirmDisableUser.vue";
import DialogConfirmEnableUser from "./Dialogs/DialogConfirmEnableUser.vue";
import DialogConfirmResetPassword from "./Dialogs/DialogConfirmResetPassword.vue";
import DialogConfirmResetTOTP from "./Dialogs/DialogConfirmResetTOTP.vue";
import {
  TableHeader,
  TableRequestParams,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const isActive: Ref<boolean | null> = ref(null);
const userMe: Ref<UserRead | null> = ref(null);
const search: Ref<string | null> = ref(null);
const sort: Ref<string | null> = ref(null);
const users: Ref<PaginationSchema_UserRead_ | null> = ref(null);
const isOrgAdmin: Ref<boolean> = ref(false);
const isDialogConfirmResetTOTPOpen: Ref<boolean> = ref(false);
const pagination = reactive({ offset: "0", limit: ITEMS_PER_PAGE[0] });
const isDialogConfirmRemoveUserFromOrganizationOpen: Ref<boolean> = ref(false);
const isDialogConfirmResetPasswordOpen = ref(false);
const dialogConfirmRemoveUserFromOrganizationData: Ref<TypeDialogConfirmDeleteAdminUser | null> =
  ref(null);
const dialogConfirmResetPasswordData: Ref<TypeDialogConfirmResetPasswordData | null> =
  ref(null);
const dialogConfirmResetTOTPData: Ref<TypeDialogConfirmResetTOTPData | null> =
  ref(null);

const isLoading: Ref<boolean> = ref(true);
const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    order: "asc",
    sortIcon: true,
    sortName: "first_name",
  },
  { key: "email", label: "Email Address" },
  {
    key: "status",
    label: "Status",
    sortable: false,
    filter: {
      type: "select",
      options: [
        { label: "Active", value: "is_active" },
        { label: "Inactive", value: "is_not_active" },
      ],
    },
  },
  { key: "organization", label: "Organization", sortable: false },
  {
    key: "created_date",
    label: "Created Date",
    sortable: true,
    sortIcon: true,
    defaultSortItem: true,
    sortName: "created_date",
    order: "desc",
  },
  { key: "last_login_date", label: "Last login", sortable: false },
  { key: "actions", label: "", sortable: false },
];

const dropdownItems = (user: UserRead): TypeDropdownItem[] => {
  const items: TypeDropdownItem[] = [];

  const enableDisableTitle = user.is_active ? "Disable user" : "Enable user";
  const isDisabledDeleteUser = userMe.value?.id === user.id;
  const cannotDeleteUserMessage = isDisabledDeleteUser
    ? "You cannot delete this user"
    : "";
  const enableDisableFunction = user.is_active
    ? onOpenDialogConfirmDisableUser
    : onOpenDialogConfirmEnableUser;

  if (user.organization_users.length < 1) {
    items.push({
      label: "Delete user",
      type: "button",
      color: "error",
      isDisabled: isDisabledDeleteUser,
      hint: cannotDeleteUserMessage,
      onClick: () => onOpenDialogConfirmRemoveUserFromOrganization(user.id),
    });
  }

  items.push(
    {
      label: "Reset password",
      type: "button",
      onClick: () => onOpenDialogConfirmResetPassword(user),
    },
    {
      label: "Reset TOTP",
      type: "button",
      onClick: () => onOpenDialogConfirmResetTOTP(user),
    },
  );

  if (userMe.value?.id !== user.id) {
    items.push({
      label: enableDisableTitle,
      type: "button",
      onClick: () => enableDisableFunction(user),
    });
  }

  return items;
};

const onOpenDialogConfirmRemoveUserFromOrganization = (id: string) => {
  isDialogConfirmRemoveUserFromOrganizationOpen.value = true;
  const user = users.value?.results.find((orgUser) => id === orgUser.id);
  if (!user) return;

  dialogConfirmRemoveUserFromOrganizationData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
};

const getUsers = async () => {
  isLoading.value = true;
  const getUsersRequest: GetUsersRequest = {
    ...pagination,
    ...(search.value && { generic_email_name_search: search.value }),
    ...(sort.value && { sort: sort.value }),
    ...(isActive.value !== null ? { is_active: isActive.value } : {}),
  };

  try {
    isLoading.value = true;
    users.value = await usersService.getUsers(getUsersRequest);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching users",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const onCloseDialogConfirmRemoveUserFromOrganization = () => {
  isDialogConfirmRemoveUserFromOrganizationOpen.value = false;
};

onMounted(async () => {
  userMe.value = await usersService.getUserMe();
  isOrgAdmin.value = await authService.isUserOrgAdmin();
  await getUsers();
});

const isDialogConfirmDisableUserOpen = ref(false);
const dialogConfirmDisableUserData: Ref<TypeDialogConfirmDisableUserData | null> =
  ref(null);

const onOpenDialogConfirmDisableUser = (user: UserRead) => {
  isDialogConfirmDisableUserOpen.value = true;
  dialogConfirmDisableUserData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
};

const onCloseDialogConfirmDisableUser = () => {
  isDialogConfirmDisableUserOpen.value = false;
};

const onOpenDialogConfirmResetPassword = (user: UserRead) => {
  isDialogConfirmResetPasswordOpen.value = true;
  dialogConfirmResetPasswordData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
};

const onCloseDialogConfirmResetPassword = () => {
  isDialogConfirmResetPasswordOpen.value = false;
};

const onOpenDialogConfirmResetTOTP = (user: UserRead) => {
  isDialogConfirmResetTOTPOpen.value = true;
  dialogConfirmResetTOTPData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
};

const onCloseDialogConfirmResetTOTP = () => {
  isDialogConfirmResetTOTPOpen.value = false;
};

const isDialogConfirmEnableUserOpen = ref(false);
const dialogConfirmEnableUserData: Ref<TypeDialogConfirmEnableUserData | null> =
  ref(null);

const onOpenDialogConfirmEnableUser = (user: UserRead) => {
  isDialogConfirmEnableUserOpen.value = true;
  dialogConfirmEnableUserData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

const onCloseDialogConfirmEnableUser = () => {
  isDialogConfirmEnableUserOpen.value = false;
};

const handleUpdateParams = async ({
  limit,
  offset,
  query,
  status,
  sort: sortCriteria,
}: TableRequestParams & { status: string[] }) => {
  if (status?.length === 1) {
    if (status[0] === "is_active") {
      isActive.value = true;
    } else if (status[0] === "is_not_active") {
      isActive.value = false;
    } else {
      isActive.value = null;
    }
  } else {
    isActive.value = null;
  }

  pagination.limit = limit;
  pagination.offset = offset;
  search.value = query || "";
  sort.value = sortCriteria || "";

  await getUsers();
};

const statusMap = (userStatus: boolean) => {
  const status = userStatus ? "Active" : "Inactive";
  return BadgeTypes[status];
};
</script>

<template>
  <m-m-overview-page
    resource-id="admin_users.overview"
    :show-config-banner="false"
  >
    <m-m-table
      cy="users-overview-admin-table"
      :headers="headers"
      :is-loading="isLoading"
      :rows="users?.results || []"
      :total-rows="users?.total"
      show-search
      @update-params="handleUpdateParams"
    >
      <template #name="{ row }">
        <m-m-link :to="('/sc/admin/users/' + row.id) as string" cy="name-link">
          {{
            row.first_name || row.last_name
              ? [row.first_name, row.last_name].join(" ")
              : "-"
          }}
        </m-m-link>
      </template>
      <template #email="{ row }">
        {{ row.email }}
      </template>
      <template #created_date="{ row }">
        <m-m-formatted-date
          :raw-date="row.created_date"
          format="D MMM YYYY, HH:mm"
        />
      </template>
      <template #status="{ row }">
        <m-m-badge :status="statusMap(row.is_active)" cy="admin-user-status" />
      </template>
      <template #organization="{ row }">
        {{ row.organization_users[0]?.organization.name || "-" }}
      </template>
      <template #last_login="{ row }">
        {{ row?.organization_users[0]?.last_login_date || "-" }}
      </template>

      <template #actions="{ row }">
        <div class="mm-flex mm-flex-justify-end">
          <m-m-dropdown
            list-side="left"
            :items="dropdownItems(row)"
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
      </template> </m-m-table
  ></m-m-overview-page>
  <dialog-confirm-reset-password
    :is-open="isDialogConfirmResetPasswordOpen"
    :data="dialogConfirmResetPasswordData"
    :from-admin="true"
    @close="onCloseDialogConfirmResetPassword"
  />
  <dialog-confirm-reset-t-o-t-p
    :is-open="isDialogConfirmResetTOTPOpen"
    :data="dialogConfirmResetTOTPData"
    is-admin
    @close="onCloseDialogConfirmResetTOTP"
  />
  <dialog-confirm-disable-user
    :is-open="isDialogConfirmDisableUserOpen"
    :data="dialogConfirmDisableUserData"
    @close="onCloseDialogConfirmDisableUser"
    @update="getUsers"
  />
  <dialog-confirm-enable-user
    :is-open="isDialogConfirmEnableUserOpen"
    :data="dialogConfirmEnableUserData"
    @close="onCloseDialogConfirmEnableUser"
    @update="getUsers"
  />
  <dialog-confirm-remove-user-from-multiple-organizations
    :is-open="isDialogConfirmRemoveUserFromOrganizationOpen"
    mode="Delete"
    :data="dialogConfirmRemoveUserFromOrganizationData"
    @update="getUsers"
    @close="onCloseDialogConfirmRemoveUserFromOrganization"
  />
</template>

<style scoped lang="scss">
.users-header {
  max-width: 67%;
  display: flex;
  gap: 5px;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
  &-text-group {
    display: flex;
    flex-direction: column;
    font-weight: 400;
  }
  &-text {
    font-weight: 400;
  }
}
</style>

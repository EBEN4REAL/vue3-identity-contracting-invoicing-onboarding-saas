<script setup lang="ts">
import { PropType, ref, Ref, onMounted, computed, ComputedRef } from "vue";
import { useRouter } from "vue-router";
import { OrganizationUserRead, UserRead } from "~/iam/iam.types";
import { ITEMS_PER_PAGE, JOB_ROLES_MAP } from "~/common/constants";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import {
  TypeDialogAddUserToGroupsData,
  TypeDialogAddUserToUnitData,
  TypeDialogConfirmDisableOrgUserData,
  TypeDialogConfirmEnableOrgUserData,
  TypeDialogConfirmRemoveUserData,
  TypeDialogConfirmResetPasswordData,
  TypeDialogConfirmResetTOTPData,
} from "./types";
import tableHeaders from "./TableHeaders";
import DialogAddUserToGroups from "./Dialogs/DialogAddUserToGroups.vue";
import DialogAddUserToUnit from "./Dialogs/DialogAddUserToUnit.vue";
import DialogConfirmResetPassword from "../../../Dialogs/DialogConfirmResetPassword.vue";
import DialogConfirmResetTOTP from "../../../Dialogs/DialogConfirmResetTOTP.vue";
import DialogConfirmDisableUser from "../../../Dialogs/DialogConfirmDisableOrgUser.vue";
import DialogConfirmEnableUser from "../../../Dialogs/DialogConfirmEnableOrgUser.vue";
import DialogConfirmRemoveUserFromOrganization from "../../../Dialogs/DialogConfirmRemoveUserFromOrganization.vue";
import { usersService } from "~/users/users.service";
import type { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { authService } from "~/auth/auth.service";

const router = useRouter();

const props = defineProps({
  users: {
    type: Object as PropType<TableResponse<OrganizationUserRead>>,
    default: null,
  },
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update", "inviteUsers"]);
const userMe: Ref<UserRead | null> = ref(null);
const isOrgAdmin: Ref<boolean> = ref(false);

const userName = (row: OrganizationUserRead) => {
  return row.first_name && row.last_name
    ? `${row.first_name || ""} ${row.last_name || ""}`
    : "-";
};

const redirectToUserDetails = (userId: string) => {
  router.push(`/sc/users/${userId}`);
};

// Dialog Add User to Group

const isDialogAddUserToGroupsOpen = ref(false);
const isDialogConfirmResetTOTPOpen: Ref<boolean> = ref(false);
const dialogAddUserToGroupsData: Ref<TypeDialogAddUserToGroupsData | null> =
  ref(null);

const formattedUsers: ComputedRef<OrganizationUserRead> = computed(
  () => props.users?.results || [],
);

const totalRows: ComputedRef<number> = computed(() => props.users?.total || 0);

const onOpenDialogAddUserToGroups = (user: OrganizationUserRead) => {
  isDialogAddUserToGroupsOpen.value = true;
  dialogAddUserToGroupsData.value = {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    organization: user.organization,
  };
};

const onCloseDialogAddUserToGroups = () => {
  isDialogAddUserToGroupsOpen.value = false;
};

// Dialog Add User to Unit

const isDialogAddUserToUnitOpen = ref(false);
const dialogAddUserToUnitData: Ref<TypeDialogAddUserToUnitData | null> =
  ref(null);

const onOpenDialogAddUserToUnit = (user: OrganizationUserRead) => {
  isDialogAddUserToUnitOpen.value = true;
  dialogAddUserToUnitData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    unit: user.unit,
    organization: user.organization,
  };
};

const onCloseDialogAddUserToUnit = () => {
  isDialogAddUserToUnitOpen.value = false;
};

// Dialog confirm Reset Password

const isDialogConfirmResetPasswordOpen = ref(false);
const dialogConfirmResetPasswordData: Ref<TypeDialogConfirmResetPasswordData | null> =
  ref(null);
const dialogConfirmResetTOTPData: Ref<TypeDialogConfirmResetTOTPData | null> =
  ref(null);

const onOpenDialogConfirmResetPassword = (user: OrganizationUserRead) => {
  isDialogConfirmResetPasswordOpen.value = true;
  dialogConfirmResetPasswordData.value = {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
};

const onCloseDialogConfirmResetPassword = () => {
  isDialogConfirmResetPasswordOpen.value = false;
};

const onOpenDialogConfirmResetTOTP = (user: OrganizationUserRead) => {
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

// Dialog confirm Disable User

const isDialogConfirmDisableUserOpen = ref(false);
const dialogConfirmDisableUserData: Ref<TypeDialogConfirmDisableOrgUserData | null> =
  ref(null);

const onOpenDialogConfirmDisableUser = (user: OrganizationUserRead) => {
  isDialogConfirmDisableUserOpen.value = true;
  dialogConfirmDisableUserData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    organization: user.organization,
  };
};

const onCloseDialogConfirmDisableUser = () => {
  isDialogConfirmDisableUserOpen.value = false;
};

// Dialog confirm Enable User

const isDialogConfirmEnableUserOpen = ref(false);
const dialogConfirmEnableUserData: Ref<TypeDialogConfirmEnableOrgUserData | null> =
  ref(null);

const onOpenDialogConfirmEnableUser = (user: OrganizationUserRead) => {
  isDialogConfirmEnableUserOpen.value = true;
  dialogConfirmEnableUserData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    organization: user.organization,
  };
};

const onCloseDialogConfirmEnableUser = () => {
  isDialogConfirmEnableUserOpen.value = false;
};

// Dialog confirm Remove User

const isDialogConfirmRemoveUserFromOrganizationOpen = ref(false);
const dialogConfirmRemoveUserFromOrganizationData: Ref<TypeDialogConfirmRemoveUserData | null> =
  ref(null);

const onOpenDialogConfirmRemoveUserFromOrganization = (
  user: OrganizationUserRead,
) => {
  isDialogConfirmRemoveUserFromOrganizationOpen.value = true;
  dialogConfirmRemoveUserFromOrganizationData.value = {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    organization: user.organization,
    email: user.email,
  };
};

const onCloseDialogConfirmRemoveUserFromOrganization = () => {
  isDialogConfirmRemoveUserFromOrganizationOpen.value = false;
};

const actionsInDropdown = (user: OrganizationUserRead) => {
  const enableDisableTitle = user.is_active ? "Disable User" : "Enable User";
  const enableDisableFunction = user.is_active
    ? onOpenDialogConfirmDisableUser
    : onOpenDialogConfirmEnableUser;

  const list: TypeDropdownItem[] = [
    {
      label: "View details",
      type: "button",
      onClick: () => redirectToUserDetails(user.id),
    },
    {
      label: "Add to group",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      onClick: () => onOpenDialogAddUserToGroups(user),
    },
    {
      label: "Add to organization unit",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      onClick: () => onOpenDialogAddUserToUnit(user),
    },
    {
      label: "Reset password",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      onClick: () => onOpenDialogConfirmResetPassword(user),
    },
  ];

  if (isOrgAdmin.value) {
    list.push({
      label: "Reset TOTP",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      onClick: () => onOpenDialogConfirmResetTOTP(user),
    });
  }

  if (userMe.value?.id !== user.user_id) {
    list.push({
      label: enableDisableTitle,
      isDisabled: props.isSCViewerOnly,
      type: "button",
      onClick: () => enableDisableFunction(user),
    });
    list.push({
      label: "Remove user",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      color: "error",
      onClick: () => onOpenDialogConfirmRemoveUserFromOrganization(user),
    });
  }

  return list;
};

const handleUpdateParams = (
  params: TableRequestParams = { limit: ITEMS_PER_PAGE[0], offset: "0" },
) => {
  emit("update", params);
};

const statusMap = (userStatus: boolean) =>
  userStatus ? BadgeTypes.Active : BadgeTypes.Inactive;

onMounted(async () => {
  userMe.value = await usersService.getUserMe();
  isOrgAdmin.value = await authService.isUserOrgAdmin();
});
</script>

<template>
  <m-m-table
    :rows="formattedUsers"
    :is-loading="isLoading"
    :headers="tableHeaders"
    :total-rows="totalRows"
    show-search
    cy="organization-users-table"
    @update-params="handleUpdateParams"
  >
    <template #name="{ row }">
      <m-m-link :to="`/sc/users/${row.id}`" font-weigth="500">
        {{ userName(row) }}
      </m-m-link>
    </template>
    <template #status="{ row }">
      <m-m-badge
        :status="statusMap(row.is_active)"
        cy="organization-user-status"
        indicator
      />
    </template>
    <template #job_role="{ row }">
      {{ JOB_ROLES_MAP[row.job_role] }}
    </template>
    <template #unit="{ row }">
      {{ row.unit?.name || "-" }}
    </template>
    <template #actions="{ row }">
      <div class="mm-flex mm-flex-justify-end">
        <m-m-dropdown
          :items="actionsInDropdown(row)"
          :cy="`dropdown-${row.id}`"
        >
          <template #activator>
            <m-m-button
              prepend-icon="dots-vertical"
              variant="text"
              cy="button-dropdown-activator"
            />
          </template>
        </m-m-dropdown>
      </div>
    </template>
  </m-m-table>
  <dialog-add-user-to-groups
    v-if="dialogAddUserToGroupsData"
    :is-open="isDialogAddUserToGroupsOpen"
    :data="dialogAddUserToGroupsData"
    @update="emit('update')"
    @close="onCloseDialogAddUserToGroups"
  />
  <dialog-add-user-to-unit
    v-if="dialogAddUserToUnitData"
    :is-open="isDialogAddUserToUnitOpen"
    :data="dialogAddUserToUnitData"
    @update="emit('update')"
    @close="onCloseDialogAddUserToUnit"
  />
  <dialog-confirm-reset-password
    :is-open="isDialogConfirmResetPasswordOpen"
    :data="dialogConfirmResetPasswordData"
    @close="onCloseDialogConfirmResetPassword"
  />
  <dialog-confirm-reset-t-o-t-p
    :is-open="isDialogConfirmResetTOTPOpen"
    :data="dialogConfirmResetTOTPData"
    @close="onCloseDialogConfirmResetTOTP"
  />
  <dialog-confirm-disable-user
    :is-open="isDialogConfirmDisableUserOpen"
    :data="dialogConfirmDisableUserData"
    @close="onCloseDialogConfirmDisableUser"
    @update="emit('update')"
  />
  <dialog-confirm-enable-user
    :is-open="isDialogConfirmEnableUserOpen"
    :data="dialogConfirmEnableUserData"
    @close="onCloseDialogConfirmEnableUser"
    @update="emit('update')"
  />
  <dialog-confirm-remove-user-from-organization
    :is-open="isDialogConfirmRemoveUserFromOrganizationOpen"
    :data="dialogConfirmRemoveUserFromOrganizationData"
    @update="emit('update')"
    @close="onCloseDialogConfirmRemoveUserFromOrganization"
  />
</template>

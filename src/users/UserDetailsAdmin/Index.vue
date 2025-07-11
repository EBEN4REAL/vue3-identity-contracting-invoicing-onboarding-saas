<script setup lang="ts">
import { ref, onMounted, Ref, computed, ComputedRef } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usersService } from "~/users/users.service";
import ComponentUserDetails from "./Tabs/UserDetails.vue";
import ComponentUserOrganizations from "./Tabs/Organizations.vue";
import { UserRead } from "~/iam/iam.types";
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import DialogConfirmResetPassword from "../Dialogs/DialogConfirmResetPassword.vue";
import DialogConfirmResetTOTP from "../Dialogs/DialogConfirmResetTOTP.vue";
import DialogConfirmDisableUser from "../Dialogs/DialogConfirmDisableUser.vue";
import DialogConfirmEnableUser from "../Dialogs/DialogConfirmEnableUser.vue";
import DialogConfirmRemoveUserFromOrganization from "../Dialogs/DialogConfirmRemoveUserFromOrganization.vue";
import useActiveTab from "~/mm_ui_kit/src/composables/activeTabIndexBasedOnURL";
import {
  TypeDialogConfirmDisableUserData,
  TypeDialogConfirmEnableUserData,
  TypeDialogConfirmRemoveUserData,
  TypeDialogConfirmResetPasswordData,
  TypeDialogConfirmResetTOTPData,
} from "../OrganizationUsers/Tabs/Users/types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { useTranslation } from "i18next-vue";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";

defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();
const { t } = useTranslation();

const userMe: Ref<UserRead | null> = ref(null);
const isDialogConfirmResetTOTPOpen: Ref<boolean> = ref(false);
const user: Ref<UserRead | null> = ref(null);
const TABS: TypeTab[] = [
  { label: "Basic information", name: "Basic information", isRequired: false },
  { label: "Organizations", name: "Organizations", isRequired: false },
];
const activeTab = useActiveTab(TABS[0].label);
const mainHeaderDropdownItems = computed(() => {
  const enableDisableTitle = user.value?.is_active
    ? "Disable user"
    : "Enable user";
  const enableDisableFunction = user.value?.is_active
    ? onOpenDialogConfirmDisableUser
    : onOpenDialogConfirmEnableUser;

  const list = [
    {
      label: "Reset password",
      type: "button",
      onClick: () => onOpenDialogConfirmResetPassword(user.value),
    },
    {
      label: "Reset TOTP",
      type: "button",
      onClick: () => onOpenDialogConfirmResetTOTP(user.value),
    },
  ];

  if (userMe.value?.id === user.value?.id) {
    // Functionality not there yet
    list.push({
      label: enableDisableTitle,
      type: "button",
      onClick: () => enableDisableFunction(user.value),
    });
  }

  return list;
});

const userOrganizations = computed(() =>
  user.value?.organization_users!.map((user) => user.organization),
);

const adminUserDetailsTitle: ComputedRef<string> = computed(() =>
  t(
    "admin_users.admin_user_details.title",
    escapeObjectValuesForHtml({
      userName: userFullName.value,
    }),
  ),
);

const adminUserDetailsSubtitle: ComputedRef<string> = computed(() =>
  t(
    "admin_users.admin_user_details.subtitle",
    escapeObjectValuesForHtml({
      userEmail: user.value?.email || "",
    }),
  ),
);

// Dialog confirm Reset Password

const isDialogConfirmResetPasswordOpen = ref(false);
const dialogConfirmResetPasswordData: Ref<TypeDialogConfirmResetPasswordData | null> =
  ref(null);
const dialogConfirmResetTOTPData: Ref<TypeDialogConfirmResetTOTPData | null> =
  ref(null);

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

// Dialog confirm Enable User

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

// Dialog confirm Remove User

const isDialogConfirmRemoveUserFromOrganizationOpen = ref(false);
const dialogConfirmRemoveUserFromOrganizationData: Ref<TypeDialogConfirmRemoveUserData | null> =
  ref(null);

const onCloseDialogConfirmRemoveUserFromOrganization = () => {
  isDialogConfirmRemoveUserFromOrganizationOpen.value = false;
};

const initials = computed(() =>
  user.value?.first_name?.at(0) && user.value?.last_name?.at(0)
    ? `${user.value.first_name.at(0)}${user.value.last_name.at(0)}`
    : null,
);

const userFullName = computed(
  () => `${user.value?.first_name} ${user.value?.last_name}`,
);

const getUser = async () => {
  if (!route.params.user_id) {
    return;
  }

  user.value = await usersService.getUser(route.params.user_id as string);
};

const onOrganizationUserUpdate = (updatedUser: UserRead) => {
  user.value = updatedUser;
};

const redirectToUsersOverview = () => {
  router.push("/sc/users");
};

onMounted(async () => {
  await getUser();
  userMe.value = await usersService.getUserMe();
});
</script>

<template>
  <template v-if="user">
    <m-m-teleport to="common-page-layout-header-icon">
      <m-m-icon v-if="initials" :icon="`initials-${initials}`" />

      <m-m-icon v-else icon="user-circle" />
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-title">
      <div v-sanitize-html="adminUserDetailsTitle" />
      <m-m-badge
        v-if="!user.is_active"
        :status="BadgeTypes.Inactive"
        class="mm-ml-8"
      />
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-subtitle">
      <div v-sanitize-html="adminUserDetailsSubtitle" />
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-controls">
      <m-m-dropdown
        :items="mainHeaderDropdownItems"
        list-variant="shadow"
        cy="user-details-actions"
      />
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-tabs">
      <m-m-tabs v-model="activeTab" :items="TABS" />
    </m-m-teleport>

    <m-m-tab-items :current-tab="activeTab">
      <m-m-tab-item :name="TABS[0].name">
        <component-user-details
          :user="user"
          @update="onOrganizationUserUpdate"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[1].name">
        <component-user-organizations
          :user="user"
          :organizations="userOrganizations"
          @update="getUser"
        />
      </m-m-tab-item>
    </m-m-tab-items>
  </template>

  <dialog-confirm-reset-password
    :is-open="isDialogConfirmResetPasswordOpen"
    :data="dialogConfirmResetPasswordData"
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
  />
  <dialog-confirm-enable-user
    :is-open="isDialogConfirmEnableUserOpen"
    :data="dialogConfirmEnableUserData"
    @close="onCloseDialogConfirmEnableUser"
  />
  <dialog-confirm-remove-user-from-organization
    :is-open="isDialogConfirmRemoveUserFromOrganizationOpen"
    :data="dialogConfirmRemoveUserFromOrganizationData"
    @update="redirectToUsersOverview"
    @close="onCloseDialogConfirmRemoveUserFromOrganization"
  />
</template>

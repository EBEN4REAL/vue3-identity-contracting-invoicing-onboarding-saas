<script setup lang="ts">
import { ref, onMounted, Ref, computed, ComputedRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { organizationsService } from "~/organizations/organizations.service";
import { authService } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";
import { usersService } from "~/users/users.service";
import ComponentUserDetails from "./Tabs/UserDetails.vue";
import ComponentUserGroups from "./Tabs/Groups.vue";
import ComponentUserLoginHistories from "./Tabs/LoginHistories.vue";
import ComponentUserAccess from "./Tabs/Access.vue";
import { OrganizationUserRead, UserRead } from "~/iam/iam.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { policiesService } from "~/service-providers/policies.service";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import DialogConfirmResetPassword from "../Dialogs/DialogConfirmResetPassword.vue";
import DialogConfirmDisableOrgUser from "../Dialogs/DialogConfirmDisableOrgUser.vue";
import DialogConfirmEnableOrgUser from "../Dialogs/DialogConfirmEnableOrgUser.vue";
import DialogConfirmRemoveUserFromOrganization from "../Dialogs/DialogConfirmRemoveUserFromOrganization.vue";
import DialogConfirmResetTOTP from "../Dialogs/DialogConfirmResetTOTP.vue";

import {
  TypeDialogConfirmDisableOrgUserData,
  TypeDialogConfirmEnableOrgUserData,
  TypeDialogConfirmRemoveUserData,
  TypeDialogConfirmResetPasswordData,
  TypeDialogConfirmResetTOTPData,
} from "../OrganizationUsers/Tabs/Users/types";
import useActiveTab from "~/mm_ui_kit/src/composables/activeTabIndexBasedOnURL";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { PolicyReadWithOwnerName } from "~/policies/policies.types";
import { OrganizationUserStatus } from "../users.types";
import { useUiStore } from "~/stores/useUiStore";
import { useTranslation } from "i18next-vue";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";
import { showToast } from "~/mm_ui_kit/src/composables/useToast";
import { TypeToastStatuses } from "~/mm_ui_kit/src/types/toast.types";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();
const uiStore = useUiStore();
const { t } = useTranslation();

const userMe: Ref<UserRead | null> = ref(null);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const isDialogConfirmResetTOTPOpen: Ref<boolean> = ref(false);
const orgUser: Ref<OrganizationUserRead | null> = ref(null);
const isLoading: Ref<boolean> = ref(true);
const isOrgAdmin: Ref<boolean> = ref(false);
const isUserOrgEditor: Ref<boolean> = ref(false);
const policies: Ref<TableResponse<PolicyReadWithOwnerName> | null> = ref(null);
const isShowLoginHistory: ComputedRef<boolean> = computed(() =>
  Boolean(userProfile.value && route.query.tab !== "invites"),
);

const TABS: ComputedRef<TypeTab[]> = computed(() => {
  const baseTabs: TypeTab[] = [
    {
      label: "Basic information",
      name: "Basic information",
      isRequired: false,
    },
    { label: "Groups", name: "Groups", isRequired: false },
    { label: "Access", name: "Access", isRequired: false },
    {
      label: "Login history",
      name: "Login history",
      isRequired: false,
    },
  ];

  if (!isShowLoginHistory.value) {
    return baseTabs.filter((tab) => tab.name !== "Login history");
  }

  return baseTabs;
});

const activeTab = useActiveTab(TABS.value[0].name);

const isTabInvitesAndUserNotAccepted: ComputedRef<boolean> = computed(
  () => route.query.tab === "invites" && orgUser.value?.status !== "A",
);

const isUserFullNamePresent: ComputedRef<boolean> = computed(() =>
  Boolean(orgUser.value?.first_name && orgUser.value?.last_name),
);

const isUserInactive: ComputedRef<boolean> = computed(
  () => !orgUser.value?.is_active && route.query.tab !== "invites",
);

const mainHeaderDropdownItems = computed(() => {
  const enableDisableTitle = orgUser.value?.is_active
    ? "Disable user"
    : "Enable user";
  const enableDisableFunction = orgUser.value?.is_active
    ? onOpenDialogConfirmDisableUser
    : onOpenDialogConfirmEnableUser;

  const list: TypeDropdownItem[] = [];

  if (
    orgUser.value?.status === OrganizationUserStatus.CANCELLED ||
    orgUser.value?.status === OrganizationUserStatus.PENDING
  ) {
    list.push({
      label: "Resend invite",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () => onResendInviteToUser(orgUser.value),
    });
  }
  if (
    isUserOrgEditor.value &&
    orgUser.value?.status === OrganizationUserStatus.PENDING
  ) {
    list.push({
      label: "Cancel invite",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () => onCancelInviteToUser(orgUser.value),
    });
  }

  if (route.query.tab !== "invites") {
    list.push({
      label: "Reset password",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () =>
        onOpenDialogConfirmResetPassword(orgUser.value as OrganizationUserRead),
    });
  }

  if (isOrgAdmin.value && route.query.tab !== "invites") {
    list.push({
      label: "Reset TOTP",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () =>
        onOpenDialogConfirmResetTOTP(orgUser.value as OrganizationUserRead),
    });
  }

  if (
    userMe.value?.id !== orgUser.value?.user_id &&
    route.query.tab !== "invites"
  ) {
    list.push({
      label: enableDisableTitle,
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () =>
        enableDisableFunction(orgUser.value as OrganizationUserRead),
    });
    list.push({
      label: "Delete user",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () =>
        onOpenDialogConfirmRemoveUserFromOrganization(
          orgUser.value as OrganizationUserRead,
        ),
      color: "error",
    });
  }

  return list;
});

const userDetailsTitle: ComputedRef<string> = computed(() =>
  t(
    "users.user_details.title",
    escapeObjectValuesForHtml({
      userName: fullUserName.value || "",
    }),
  ),
);

const userDetailsSubtitle: ComputedRef<string> = computed(() =>
  t(
    "users.user_details.subtitle",
    escapeObjectValuesForHtml({
      userEmail: orgUser.value?.email || "",
    }),
  ),
);

const onResendInviteToUser = async (user: OrganizationUserRead) => {
  if (user.organization?.id) {
    try {
      await organizationsService.createInvitationEmailForOrganizationUser(
        user.organization.id,
        user.user_id,
      );
      showToast({
        text: "Invite resent successfully",
        status: "success",
        duration: 5000,
      });
      await getOrganizationUser();
    } catch (error) {
      if (error.response?.status === 429) {
        showToast({
          text: "You can only send one invite every two minutes, please try again later",
          status: TypeToastStatuses.Warning,
          duration: 5000,
        });
        return;
      }
      showToast({
        text: "Error resending user invite",
        status: TypeToastStatuses.Error,
      });
    }
  }
};

const onCancelInviteToUser = async (user: OrganizationUserRead) => {
  try {
    await organizationsService.updateOrganizationUserStatus(
      user.organization.id,
      user.user_id,
      { status: OrganizationUserStatus.CANCELLED },
    );
    showToast({
      text: "Invite cancelled successfully",
      status: "success",
      duration: 5000,
    });
    await getOrganizationUser();
  } catch (error) {
    showToast({
      text: "Failed to cancel user invite",
      status: TypeToastStatuses.Error,
      duration: 5000,
    });
  }
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
  };
};

const onCloseDialogConfirmRemoveUserFromOrganization = () => {
  isDialogConfirmRemoveUserFromOrganizationOpen.value = false;
};

const initials = computed(() =>
  orgUser.value?.first_name?.at(0) && orgUser.value?.last_name?.at(0)
    ? `${orgUser.value.first_name.at(0)}${orgUser.value.last_name.at(0)}`
    : null,
);

const fullUserName = computed(() =>
  orgUser.value?.first_name && orgUser.value?.last_name
    ? `${orgUser.value.first_name} ${orgUser.value.last_name}`
    : null,
);

const getOrganizationUser = async () => {
  isLoading.value = true;
  userProfile.value = await authService.getProfile();
  if (!userProfile.value?.org) {
    return;
  }
  orgUser.value = await organizationsService.getOrganizationUser(
    userProfile.value.org,
    props.id,
  );
  isLoading.value = false;
};

const getAssignedPolicies = async (params?: TableRequestParams) => {
  isLoading.value = true;
  if (!orgUser.value?.organization) {
    return;
  }

  const finalParams = {
    ...params,
    organization_user_id: orgUser.value?.id,
    limit: params?.limit || ITEMS_PER_PAGE[0],
    offset: params?.offset || "0",
  };

  policies.value = await policiesService.getServiceConsumerPolicies(
    orgUser?.value?.organization.id,
    finalParams,
  );
  isLoading.value = false;
};

const onOrganizationUserUpdate = (updatedOrgUser: OrganizationUserRead) => {
  orgUser.value = updatedOrgUser;
};

const redirectToUsersOverview = () => {
  router.push("/sc/users");
};

onMounted(async () => {
  isOrgAdmin.value = await authService.isUserOrgAdmin();
  isUserOrgEditor.value = await authService.isUserOrgEditor();
  userMe.value = await usersService.getUserMe();
  await getOrganizationUser();
  await getAssignedPolicies();
});
</script>

<template>
  <template v-if="orgUser">
    <m-m-teleport to="common-page-layout-header-icon">
      <m-m-icon v-if="initials" :icon="`initials-${initials}`" />
      <m-m-icon v-else icon="user-circle" />
    </m-m-teleport>
    <m-m-teleport
      v-if="isUserFullNamePresent"
      to="common-page-layout-header-title"
    >
      <div v-sanitize-html="userDetailsTitle" />
      <m-m-badge
        v-if="isUserInactive"
        :status="BadgeTypes.Inactive"
        class="mm-ml-8"
      />
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-subtitle">
      <div v-sanitize-html="userDetailsSubtitle" />
      <m-m-badge
        v-if="isTabInvitesAndUserNotAccepted"
        :status="BadgeTypes.Invited"
        class="mm-ml-8"
      />
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
      <m-m-tab-item :name="TABS[0]?.name">
        <component-user-details
          :user="orgUser"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          @update="onOrganizationUserUpdate"
        />
      </m-m-tab-item>
      <m-m-tab-item keep-alive :name="TABS[1]?.name">
        <component-user-groups
          v-if="userProfile !== null"
          :organization-id="userProfile.org"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          :user="orgUser"
          :user-id="orgUser.user_id"
        />
      </m-m-tab-item>
      <m-m-tab-item keep-alive :name="TABS[2]?.name">
        <component-user-access
          ::is-loading="isLoading"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          :policies="policies?.results"
          :user="orgUser"
          @update-policies="getAssignedPolicies"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[3]?.name">
        <component-user-login-histories
          v-if="isShowLoginHistory"
          :organization-id="userProfile.org"
          :user="orgUser"
          :user-id="id"
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
    @close="onCloseDialogConfirmResetTOTP"
  />
  <dialog-confirm-disable-org-user
    :is-open="isDialogConfirmDisableUserOpen"
    :data="dialogConfirmDisableUserData"
    @close="onCloseDialogConfirmDisableUser"
    @update="getOrganizationUser"
  />
  <dialog-confirm-enable-org-user
    :is-open="isDialogConfirmEnableUserOpen"
    :data="dialogConfirmEnableUserData"
    @close="onCloseDialogConfirmEnableUser"
    @update="getOrganizationUser"
  />
  <dialog-confirm-remove-user-from-organization
    :is-open="isDialogConfirmRemoveUserFromOrganizationOpen"
    :data="dialogConfirmRemoveUserFromOrganizationData"
    @update="redirectToUsersOverview"
    @close="onCloseDialogConfirmRemoveUserFromOrganization"
  />
</template>

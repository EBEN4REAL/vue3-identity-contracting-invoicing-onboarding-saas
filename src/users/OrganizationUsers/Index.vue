<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref } from "vue";
import { authService } from "~/auth/auth.service";
import TabsUsers from "./Tabs/Users/Index.vue";
import TabsInvites from "./Tabs/Invites/Index.vue";
import { organizationsService } from "~/organizations/organizations.service";
import { OrganizationUserRead } from "~/iam/iam.types";
import DialogInviteUsersToOrganization from "./Dialogs/DialogInviteUsersToOrganization.vue";
import DialogImportOrganizationUsers from "./Dialogs/DialogImportOrganizationUsers.vue";
import {
  TablePagination,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import {
  OrganizationUserStatus,
  TypeOrganizationUsersTabAdditionalQueryParams,
} from "~/users/users.types";
import { UserProfileMM } from "~/auth/auth.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import useActiveTab from "~/mm_ui_kit/src/composables/activeTabIndexBasedOnURL";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { useFlag } from "@unleash/proxy-client-vue";
import { Button } from "~/mm_ui_kit/src/types/overviewPage.types";
import { useUiStore } from "~/stores/useUiStore";

const uiStore = useUiStore();

const isActive: Ref<boolean | null> = ref(null);
const isDialogImportOrganizationUsersOpen: Ref<boolean> = ref(false);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const users: Ref<TableResponse<OrganizationUserRead> | null> = ref(null);
const TABS: TypeTab[] = [
  { label: "Users", name: "Users", isRequired: false },
  { label: "Invites", name: "Invites", isRequired: false },
];

const activeTab = useActiveTab(TABS[0].name);
const importOrganizationUsersEnabled = useFlag("import_organization_users");
const isDialogInviteUsersToOrganizationOpened = ref(false);
const isLoading: Ref<boolean> = ref(true);

const getOrganizationUsers = async (
  params?: TableRequestParams,
  additionalParams?: TypeOrganizationUsersTabAdditionalQueryParams,
) => {
  const initialQueryParams: TablePagination = {
    limit: ITEMS_PER_PAGE[0],
    offset: "0",
  };

  let queryParams: TableRequestParams & { active?: boolean } = Object.assign(
    initialQueryParams,
    params,
  );

  if (userProfile.value?.org) {
    queryParams = {
      ...queryParams,
      ...(isActive.value !== null ? { active: isActive.value } : {}),
    };
  }

  if (additionalParams) Object.assign(queryParams, additionalParams);

  if (userProfile.value?.org) {
    try {
      isLoading.value = true;
      users.value = await organizationsService.getOrganizationUsers(
        userProfile.value.org,
        queryParams,
      );
    } catch (error) {
      eventBus.$emit("onShowToast", {
        text: "Error fetching organization users",
        status: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const onDialogImportOrganizationUsersOpen = () => {
  isDialogImportOrganizationUsersOpen.value = true;
};

const onDialogImportOrganizationUsersClose = () => {
  isDialogImportOrganizationUsersOpen.value = false;
};

const updateTabUsers = async (
  params?: TableRequestParams & { status: boolean[] },
) => {
  if (params?.status) {
    isActive.value = params.status.length === 1 ? params?.status[0] : null;
  }
  await getOrganizationUsers(params, {
    status: OrganizationUserStatus.ACCEPTED,
  });
};

const updateTabInvites = async (params?: TableRequestParams): Promise<void> => {
  if (params?.status) {
    delete params.status;
  }
  await getOrganizationUsers(params, {
    invited: true,
    sort: "created_date:desc",
  });
  activeTab.value = TABS[1].name;
};

const onOpenDialogInviteUsersToOrganization = () => {
  isDialogInviteUsersToOrganizationOpened.value = true;
};

const onCloseDialogInviteUsersToOrganization = () => {
  isDialogInviteUsersToOrganizationOpened.value = false;
};

const buttons: ComputedRef<Button[]> = computed(() => [
  {
    key: "invite_users",
    action: onOpenDialogInviteUsersToOrganization,
    isDisabled: uiStore.isSCViewerOnly,
  },
  {
    key: "import_users",
    action: onDialogImportOrganizationUsersOpen,
    isVisible: importOrganizationUsersEnabled.value,
    isDisabled: uiStore.isSCViewerOnly,
  },
]);

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  const intialParams = {
    limit: "10",
    offset: "0",
    sort: "first_name:asc",
  };
  await updateTabUsers(intialParams);
});
</script>

<template>
  <m-m-overview-page
    resource-id="users.overview"
    :show-config-banner="false"
    :buttons="buttons"
  >
    <m-m-teleport to="common-page-layout-header-tabs">
      <m-m-tabs v-model="activeTab" :items="TABS" />
    </m-m-teleport>
    <m-m-tab-items :current-tab="activeTab">
      <m-m-tab-item :name="TABS[0].name">
        <tabs-users
          :users="users"
          :is-loading="isLoading"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          @invite-users="onOpenDialogInviteUsersToOrganization"
          @update="updateTabUsers"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[1].name">
        <tabs-invites
          :users="users"
          :is-loading="isLoading"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          @update="updateTabInvites"
          @invite-users="onOpenDialogInviteUsersToOrganization"
        />
      </m-m-tab-item> </m-m-tab-items
  ></m-m-overview-page>

  <dialog-invite-users-to-organization
    :is-open="isDialogInviteUsersToOrganizationOpened"
    cy="dialog-invite-organization-users"
    @close="onCloseDialogInviteUsersToOrganization"
    @submit="updateTabInvites"
  />

  <dialog-import-organization-users
    :is-open="isDialogImportOrganizationUsersOpen"
    :organization-id="userProfile?.org"
    @update="updateTabInvites"
    @close="onDialogImportOrganizationUsersClose"
  />
</template>

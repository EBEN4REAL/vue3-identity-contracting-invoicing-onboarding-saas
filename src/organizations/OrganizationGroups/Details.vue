<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { organizationsService } from "../organizations.service";
import { authService } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";
import { OrganizationGroupRead } from "~/iam/iam.types";
import ComponentGroupUsers from "./Tabs/Users/Index.vue";
import ComponentGroupSettings from "./Tabs/Settings.vue";
import Access from "./Tabs/Access.vue";
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import { useUiStore } from "~/stores/useUiStore";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";
import { useTranslation } from "i18next-vue";

const props = defineProps({
  group_id: {
    type: String,
    required: true,
  },
});
const router = useRouter();
const uiStore = useUiStore();
const { t } = useTranslation();

const TABS: TypeTab[] = [
  { label: "Basic Information", name: "Basic Information", isRequired: false },
  { label: "Users", name: "Users", isRequired: false },
  { label: "Access", name: "Access", isRequired: false },
];

const mainHeaderTab = ref(TABS[0].name);

const userProfile: Ref<UserProfileMM | null> = ref(null);
const orgGroup: Ref<OrganizationGroupRead | null> = ref(null);
const isOrgAdmin: Ref<boolean> = ref(false);
const isOrgEditor: Ref<boolean> = ref(false);
const isConfirmDeleteDialogOpen: Ref<boolean> = ref(false);

const canDeleteOrEditGroup: ComputedRef<boolean> = computed(
  () =>
    (isOrgAdmin.value || isOrgEditor.value) &&
    (!orgGroup?.value?.users || orgGroup.value.users.length <= 0) &&
    !orgGroup?.value?.role,
);

const cannotDeleteGroupMessage = computed(() => {
  if (orgGroup?.value?.role) {
    return "You cannot delete this group";
  } else if (orgGroup.value?.users?.length) {
    return `You cannot delete this group as it is associated with ${orgGroup.value.users.length} users`;
  }

  return "";
});

const mainHeaderDropdownItems = computed(() => [
  {
    label: "Delete group",
    type: "button",
    color: "error",
    isDisabled: !canDeleteOrEditGroup.value || uiStore.isSCViewerOnly,
    hint: cannotDeleteGroupMessage.value,
    onClick: () => {
      isConfirmDeleteDialogOpen.value = true;
    },
  },
]);

const title: ComputedRef<string> = computed(() =>
  t(
    "groups.group_details.title",
    escapeObjectValuesForHtml({ groupName: orgGroup.value?.name || "" }),
  ),
);

const subtitle: ComputedRef<string> = computed(() =>
  t(
    "groups.group_details.subtitle",
    escapeObjectValuesForHtml({
      groupDescription: orgGroup.value?.description || "",
    }),
  ),
);

const getOrganizationGroup = async () => {
  userProfile.value = await authService.getProfile();
  if (!userProfile.value?.org) {
    return;
  }

  orgGroup.value = (await organizationsService.getOrganizationGroup(
    props.group_id,
    userProfile.value.org,
  )) as OrganizationGroupRead;
};

const toggleConfirmDelete = () => {
  isConfirmDeleteDialogOpen.value = !isConfirmDeleteDialogOpen.value;
};

const loadingDelete = ref(false);

const onDeleteButtonClick = async () => {
  if (userProfile.value?.org && props.group_id) {
    loadingDelete.value = true;
    await organizationsService
      .deleteOrganizationGroup(props.group_id, userProfile.value.org)
      .catch((error) => {
        throw error;
      });
    toggleConfirmDelete();
    loadingDelete.value = false;
    router.push("/sc/groups");
  }
};

onMounted(async () => {
  isOrgAdmin.value = await authService.isUserOrgAdmin();
  isOrgEditor.value = await authService.isUserOrgEditor();

  await getOrganizationGroup();
});
</script>

<template>
  <template v-if="orgGroup">
    <m-m-teleport to="common-page-layout-header-icon">
      <m-m-icon icon="user-group" />
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-title">
      <div v-sanitize-html="title"></div>
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-subtitle">
      <div v-sanitize-html="subtitle"></div>
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-controls">
      <m-m-dropdown :items="mainHeaderDropdownItems" />
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-tabs">
      <m-m-tabs v-model="mainHeaderTab" :items="TABS" />
    </m-m-teleport>
    <m-m-tab-items :current-tab="mainHeaderTab">
      <m-m-tab-item :name="TABS[0].name">
        <component-group-settings
          :group="orgGroup"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          :organization-id="userProfile.org"
          :can-delete-or-edit-group="canDeleteOrEditGroup"
          @update="getOrganizationGroup"
        />
      </m-m-tab-item>

      <m-m-tab-item keep-alive :name="TABS[1].name">
        <component-group-users
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          :org-id="userProfile.org"
          :group="orgGroup"
          @update="getOrganizationGroup"
        />
      </m-m-tab-item>

      <m-m-tab-item :name="TABS[2].name">
        <access
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          :group="orgGroup"
        />
      </m-m-tab-item>
    </m-m-tab-items>

    <m-m-dialog
      :is-open="isConfirmDeleteDialogOpen"
      :title="`Delete ${orgGroup.name}?`"
      icon="warning"
      icon-color="error"
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
          Yes, delete
        </m-m-button>
      </template>
    </m-m-dialog>
  </template>
</template>

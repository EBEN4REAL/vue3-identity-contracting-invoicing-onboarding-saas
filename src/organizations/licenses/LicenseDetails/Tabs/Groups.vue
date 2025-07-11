<script setup lang="ts">
import {
  computed,
  ComputedRef,
  onMounted,
  PropType,
  ref,
  Ref,
  watch,
} from "vue";
import {
  EmptyStateType,
  TableHeader,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { OrganizationGroupIDRead } from "~/organizations/licenses/licenses.types";
import { organizationsService } from "~/organizations/organizations.service";
import { OrganizationGroupRead } from "~/iam/iam.types";
import { authService } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { TypeOrganizationGroupForTable } from "~/organizations/licenses/LicenseDetails/Tabs/types";
import DialogUnassignLicenseFromGroup from "../Dialogs/DialogUnassignLicenseFromGroup.vue";
import DialogManageOptionalPoliciesForGroup from "../Dialogs/DialogManageOptionalPoliciesForGroup.vue";
import { PolicyTypeRead } from "~/policies/policies.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { useUiStore } from "~/stores/useUiStore";

const uiStore = useUiStore();

const emit = defineEmits(["assignment-change", "open-assignment-dialog"]);

const props = defineProps({
  groups: {
    type: Object as PropType<TableResponse<OrganizationGroupIDRead>>,
    default: () => ({}),
  },
  isUserBasedRecurring: {
    type: Boolean,
    required: true,
    default: false,
  },
  isLicenseCancelled: {
    type: Boolean,
    default: false,
  },
  serviceConsumerId: {
    type: String,
    default: "",
  },
  licenseId: {
    type: String,
    default: "",
  },
  optionalPolicies: {
    type: Array as PropType<PolicyTypeRead[]>,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
  isAccessLicense: {
    type: Boolean,
    default: false,
  },
});

const isAddGroupDisabled: ComputedRef<boolean> = computed(
  () => uiStore.isSCViewerOnly || props.isUserBasedRecurring,
);
const licenseType = computed(() =>
  props.isAccessLicense ? "license" : "subscription",
);
const emptyState: ComputedRef<EmptyStateType> = computed(() => ({
  icon: sectionIcons["licenses"],
  title: `Add ${props.isAccessLicense ? "access license" : "subscription"} to groups`,
  description: `All users in these groups can then access and use this ${licenseType.value}.`,
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/provide-access-to-employees#manage-license-from-licenses-overview",
}));
const headers: TableHeader[] = [
  {
    key: "name",
    label: "Group name",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "users",
    label: "Number of users",
  },
  {
    key: "actions",
    label: "",
  },
];

const userProfile: Ref<UserProfileMM | null> = ref(null);
const organizationGroups: Ref<TypeOrganizationGroupForTable[]> = ref([]);
const isDialogUnassignLicenseFromGroupOpen: Ref<boolean> = ref(false);
const selectedGroup: Ref<{ id: string; name: string } | null> = ref(null);
const isDialogManageOptionalPoliciesOpen: Ref<boolean> = ref(false);

watch(
  () => props.groups,
  async () => await getOrganizationGroups(),
);

const getOrganizationGroups = async () => {
  if (props.groups?.results && userProfile.value?.org) {
    const organizationGroupsRes: OrganizationGroupRead[] = await Promise.all(
      props.groups?.results.map((group: OrganizationGroupIDRead) =>
        organizationsService.getOrganizationGroup(
          group.organization_group_id,
          userProfile.value?.org as string,
        ),
      ),
    );

    organizationGroups.value = organizationGroupsRes.map(
      (group: OrganizationGroupRead) => ({
        ...group,
        users: group.users?.length || 0,
      }),
    );
  }
};

const dropdownItems = (groupId: string): TypeDropdownItem[] => {
  const items: TypeDropdownItem[] = [];

  if (props.optionalPolicies.length) {
    items.push({
      isDisabled: uiStore.isSCViewerOnly,
      label: "Manage optional policies",
      type: "button",
      onClick: () => onDialogManageOptionalPoliciesOpen(groupId),
    });
  }

  items.push(
    {
      label: "View group",
      type: "link",
      to: `/sc/groups/${groupId}`,
    },
    {
      label: "Remove group",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      color: "error",
      onClick: () => onDialogUnassignLicenseFromGroupOpen(groupId),
    },
  );

  return items;
};

const onDialogManageOptionalPoliciesOpen = (groupId: string) => {
  const group = organizationGroups.value.find(
    (organizationGroup) => organizationGroup.id === groupId,
  );
  if (group) {
    selectedGroup.value = {
      id: group.id,
      name: group.name,
    };
  }
  isDialogManageOptionalPoliciesOpen.value = true;
};

const onDialogManageOptionalPoliciesClose = () => {
  isDialogManageOptionalPoliciesOpen.value = false;
};

const onDialogUnassignLicenseFromGroupOpen = (groupId: string) => {
  const group = organizationGroups.value.find(
    (organizationGroup) => organizationGroup.id === groupId,
  );
  if (group) {
    selectedGroup.value = {
      id: group.id,
      name: group.name,
    };
  }
  isDialogUnassignLicenseFromGroupOpen.value = true;
};

const onDialogUnassignLicenseFromGroupClose = () => {
  isDialogUnassignLicenseFromGroupOpen.value = false;
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  if (userProfile.value?.org && !props.isLicenseCancelled)
    await getOrganizationGroups();
  else organizationGroups.value = [];
});
</script>

<template>
  <m-m-table
    :is-loading="isLoading"
    :headers="headers"
    :rows="organizationGroups"
    cy="empty-state-table-groups"
    :empty-state="emptyState"
    @update-params="getOrganizationGroups"
  >
    <template #empty-state-button>
      <m-m-button
        variant="elevated"
        size="small"
        data-cy="empty-state-button-assign-license"
        prepend-icon="plus-white"
        :disabled="isAddGroupDisabled"
        @click="emit('open-assignment-dialog')"
      >
        Add group
      </m-m-button>
      <m-m-tooltip
        v-if="isUserBasedRecurring"
        display-position="toLeft"
        max-width="300px"
      >
        Subscription is charged per user and can therefore only be added to
        individual users not to groups
      </m-m-tooltip></template
    >
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        data-cy="button-assign-license"
        prepend-icon="plus"
        :disabled="isAddGroupDisabled"
        @click="emit('open-assignment-dialog')"
      >
        Add group
      </m-m-button>
      <m-m-tooltip
        v-if="isUserBasedRecurring"
        display-position="toLeft"
        max-width="300px"
      >
        Subscription is charged per user and can therefore only be added to
        individual users not to groups
      </m-m-tooltip></template
    >
    <template #actions="{ row }">
      <m-m-dropdown list-side="left" :items="dropdownItems(row.id as string)">
        <template #activator>
          <m-m-button
            prepend-icon="dots-vertical"
            variant="text"
            :cy="`actions-${row.id}`"
          />
        </template>
      </m-m-dropdown>
    </template>
  </m-m-table>
  <dialog-unassign-license-from-group
    :is-open="isDialogUnassignLicenseFromGroupOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="licenseId"
    :group="selectedGroup"
    @unassigned="emit('assignment-change', selectedGroup?.id)"
    @close="onDialogUnassignLicenseFromGroupClose"
  />
  <dialog-manage-optional-policies-for-group
    :is-open="isDialogManageOptionalPoliciesOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="licenseId"
    :group="selectedGroup"
    :optional-policies="optionalPolicies"
    @close="onDialogManageOptionalPoliciesClose"
  />
</template>

<style scoped lang="scss"></style>

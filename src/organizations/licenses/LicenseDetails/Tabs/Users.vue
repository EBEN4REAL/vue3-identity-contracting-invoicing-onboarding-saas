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
import { OrganizationUserPolicyAssignmentUserIDRead } from "~/organizations/licenses/licenses.types";
import { OrganizationUserRead } from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogUnassignLicenseFromUser from "../Dialogs/DialogUnassignLicenseFromUser.vue";
import DialogManageOptionalPoliciesForUser from "../Dialogs/DialogManageOptionalPoliciesForUser.vue";
import { PolicyTypeRead } from "~/policies/policies.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { useUiStore } from "~/stores/useUiStore";

const uiStore = useUiStore();

const emit = defineEmits(["open-assignment-dialog", "assignment-change"]);

const props = defineProps({
  users: {
    type: Object as PropType<
      TableResponse<OrganizationUserPolicyAssignmentUserIDRead>
    >,
    default: () => ({}),
  },
  serviceConsumerId: {
    type: String,
    default: "",
  },
  licenseId: {
    type: String,
    default: "",
  },
  isLicenseCancelled: {
    type: Boolean,
    default: false,
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

const licenseType = computed(() =>
  props.isAccessLicense ? "license" : "subscription",
);
const emptyState: ComputedRef<EmptyStateType> = computed(() => ({
  icon: sectionIcons["licenses"],
  title: `Assign ${props.isAccessLicense ? "access license" : "subscription"} to users`,
  description: `These individual users can then access and use this ${licenseType.value}.`,
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/provide-access-to-employees#manage-license-from-licenses-overview",
}));

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "User email",
  },
  {
    key: "actions",
    label: "",
  },
];

const userProfile: Ref<UserProfileMM | null> = ref(null);
const organizationUsers: Ref<OrganizationUserRead[]> = ref([]);
const isDialogUnassignLicenseFromUserOpen: Ref<boolean> = ref(false);
const selectedUser: Ref<{ id: string; name: string } | null> = ref(null);
const isDialogManageOptionalPoliciesOpen: Ref<boolean> = ref(false);

const getOrganizationUsers = async () => {
  if (userProfile.value?.org && props.users?.results) {
    const getOrganizationUserRequests: Promise<OrganizationUserRead>[] =
      props.users?.results?.map((user) =>
        organizationsService.getOrganizationUser(
          userProfile.value?.org as string,
          user.organization_user_id as string,
        ),
      );
    organizationUsers.value = await Promise.all(getOrganizationUserRequests);
  }
};

const rows: ComputedRef<
  Pick<OrganizationUserRead, "id" | ("email" & { name: string })>[]
> = computed(() =>
  organizationUsers.value.map((organizationUser: OrganizationUserRead) => {
    const name =
      organizationUser.first_name && organizationUser.last_name
        ? `${organizationUser.first_name || ""} ${organizationUser.last_name || ""}`
        : "-";
    return {
      id: organizationUser.id,
      name,
      email: organizationUser.email,
    };
  }),
);

const dropdownItems = (user: {
  id: string;
  name: string;
}): TypeDropdownItem[] => {
  const items: TypeDropdownItem[] = [];

  if (props.optionalPolicies.length) {
    items.push({
      label: "Manage optional policies",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () => onDialogManageOptionalPoliciesOpen(user),
    });
  }

  items.push(
    {
      label: "View user",
      type: "link",
      to: `/sc/users/${user.id}`,
    },
    {
      label: "Remove user",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      color: "error",
      onClick: () => onDialogUnassignLicenseFromUserOpen(user),
    },
  );

  return items;
};

watch(
  () => props.users,
  async () => {
    await getOrganizationUsers();
  },
);

const onDialogUnassignLicenseFromUserOpen = (user: {
  id: string;
  name: string;
}) => {
  selectedUser.value = user;
  isDialogUnassignLicenseFromUserOpen.value = true;
};

const onDialogUnassignLicenseFromUserClose = () => {
  isDialogUnassignLicenseFromUserOpen.value = false;
  emit("assignment-change");
};

const onDialogManageOptionalPoliciesOpen = (user: {
  id: string;
  name: string;
}) => {
  selectedUser.value = user;
  isDialogManageOptionalPoliciesOpen.value = true;
};

const onDialogManageOptionalPoliciesClose = () => {
  isDialogManageOptionalPoliciesOpen.value = false;
};
const onDialogAssignLicenseToUser = () => {
  emit("open-assignment-dialog");
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  if (userProfile.value?.org && !props.isLicenseCancelled)
    await getOrganizationUsers();
});
</script>

<template>
  <m-m-table
    :is-loading="isLoading"
    :headers="headers"
    :rows="rows || []"
    :total-rows="users?.total"
    cy="empty-state-table-users"
    show-search
    :empty-state="emptyState"
    @update-params="getOrganizationUsers"
  >
    <template #empty-state-button>
      <m-m-button
        variant="elevated"
        size="small"
        data-cy="empty-state-button-assign-license"
        prepend-icon="plus-white"
        :is-disabled="uiStore.isSCViewerOnly"
        @click="onDialogAssignLicenseToUser"
      >
        Add user
      </m-m-button></template
    >
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        data-cy="button-assign-license"
        prepend-icon="plus"
        :is-disabled="uiStore.isSCViewerOnly"
        @click="onDialogAssignLicenseToUser"
      >
        Add user
      </m-m-button></template
    >
    <template #name="{ row }">
      <m-m-link :to="`/sc/users/${row.id}`" font-weigth="500">
        {{ row.name || row.email }}
      </m-m-link>
    </template>
    <template #actions="{ row }">
      <m-m-dropdown list-side="left" :items="dropdownItems(row)">
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
  <dialog-unassign-license-from-user
    :is-open="isDialogUnassignLicenseFromUserOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="licenseId"
    :user="selectedUser"
    @unassigned="emit('assignment-change', selectedUser?.id)"
    @close="onDialogUnassignLicenseFromUserClose"
  />
  <dialog-manage-optional-policies-for-user
    :is-open="isDialogManageOptionalPoliciesOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="licenseId"
    :user="selectedUser"
    :optional-policies="optionalPolicies"
    @close="onDialogManageOptionalPoliciesClose"
  />
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { computed } from "vue";
import { ComputedRef } from "vue";
import { PropType, Ref, onMounted, ref } from "vue";
import { authService } from "~/auth/auth.service";
import DialogConfirmRemoveUserFromOrganization from "~/users/Dialogs/DialogConfirmRemoveUserFromOrganization.vue";
import { OrganizationReadBase, OrganizationUserRead } from "~/iam/iam.types";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { TypeDialogConfirmRemoveUserFromOrganizationData } from "~/users/OrganizationUsers/Tabs/Users/types";

const props = defineProps({
  organizations: {
    type: Array as PropType<OrganizationReadBase[]>,
    default: () => [],
  },
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: () => ({}),
  },
});
const emit = defineEmits(["update"]);

const serviceProviderId: Ref<string> = ref("");
const isRemoveUserFromOrganizationDialogOpen: Ref<boolean> = ref(false);
const selectedOrganization: Ref<{ id: string; name: string } | null> =
  ref(null);

const userName: ComputedRef<string> = computed(
  () => `${props.user.first_name} ${props.user.last_name}`,
);
const subtitleLastLetter: ComputedRef<string> = computed(() =>
  props.organizations!.length > 1 ? "s" : "",
);
const headers = [
  {
    key: "org_name",
    label: "Organization name",
  },
  {
    key: "actions",
    label: "",
  },
];

const tableRowActionsDropdownItems = (
  organization: OrganizationReadBase,
): TypeDropdownItem[] => {
  return [
    {
      label: "View organization",
      type: "link",
      to: `/sc/organizations/${organization.id}`,
    },
    {
      label: "Remove user from organization",
      type: "button",
      onClick: () => toggleRemoveUserFromOrganizationDialog(organization),
    },
  ];
};

const deleteUserFromOrganizationDialogData: ComputedRef<TypeDialogConfirmRemoveUserFromOrganizationData> =
  computed(() => ({
    first_name: props.user.first_name,
    last_name: props.user.last_name,
    user_id: props.user.id,
    organization: selectedOrganization.value!,
  }));
const toggleRemoveUserFromOrganizationDialog = (
  organization: OrganizationReadBase,
) => {
  selectedOrganization.value = organization;

  isRemoveUserFromOrganizationDialogOpen.value =
    !isRemoveUserFromOrganizationDialogOpen.value;
};

const handleRemoveUserFromOrganization = () => {
  emit("update");
};
onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.sp) {
    serviceProviderId.value = userProfile.sp;
  }
});
</script>

<template>
  <div class="mm-flex">
    <div class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-8">
      {{ userName }} is part of
      <strong>{{ organizations!.length }}</strong> Organization{{
        subtitleLastLetter
      }}
    </div>
  </div>
  <m-m-table
    :headers="headers"
    :rows="props.organizations"
    cy="users-organizations-table"
  >
    <template #org_name="{ row }">
      <div class="mm-flex mm-flex-align-center">
        <span class="font-weight-500" :data-cy="`column-name-${row.id}`">{{
          row.name
        }}</span>
      </div>
    </template>
    <template #description="{ row }">
      <div class="mm-flex mm-flex-align-center">
        <span :data-cy="`column-description-${row.id}`">{{
          row.description
        }}</span>
      </div>
    </template>
    <template #actions="{ row }">
      <div class="mm-flex mm-flex-justify-end">
        <m-m-dropdown
          list-side="left"
          :cy="`actions-dropdown-${row.id}`"
          :items="tableRowActionsDropdownItems(row)"
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
    </template>
  </m-m-table>
  <dialog-confirm-remove-user-from-organization
    :is-open="isRemoveUserFromOrganizationDialogOpen"
    :data="deleteUserFromOrganizationDialogData"
    @update="handleRemoveUserFromOrganization"
    @close="toggleRemoveUserFromOrganizationDialog"
  />
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { onMounted, ref, ComputedRef, Ref, computed } from "vue";
import { authService } from "~/auth/auth.service";
import { usersService } from "~/users/users.service";
import { UserProfileMM } from "~/auth/auth.types";
import { TypeIconDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { OrganizationRead } from "~/iam/iam.types";
import {
  useUnsavedChanges,
  useUnsavedChangesState,
} from "~/mm_ui_kit/src/composables/useUnsavedChanges";
const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});
const {
  hasUnsavedChanges,
  warnUnsavedChanges,
  isDialogUnsavedChangesOpen,
  doNotShowNextTime,
  confirmLeave,
  onCancelDialogUnsavedChanges,
  updateDoNotShowNextTime,
} = useUnsavedChanges();
const targetOrganizationId: Ref<string | null> = ref(null);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const organizationId: Ref<string | null> = ref(null);
const organizations: Ref<OrganizationRead[]> = ref([]);
const shouldResetDropdown: Ref<boolean> = ref(false);
const initialOrganizations: Ref<TypeIconDropdownItem[]> = ref([]);

const dropdownWidth: ComputedRef<string> = computed(() =>
  props.isMobile ? "200px" : "280px",
);
const orgSwitcherClassList = computed(() => [
  "mm-app-bar--org",
  props.isMobile && `mm-app-bar--org-white`,
]);
const organizationSelectionActivator: Ref<HTMLElement | null> = ref(null);
const dropdownItems: Ref<TypeIconDropdownItem[]> = computed(() => {
  let items = [];

  if (userProfile.value?.aao && userProfile.value?.aao === "None") {
    items = organizations.value.map((org) => ({
      label: org.name,
      icon: generateOrganizationIcon(org.name),
      isSelected: org.id === organizationId.value,
      onClick: () => loginToOrganization(org.id.toString()),
    }));
  } else {
    items = [
      {
        label: userProfile.value?.aao_name as string,
        icon: generateOrganizationIcon(userProfile.value?.aao_name as string),
        isSelected: true,
      },
    ];
  }

  return items;
});
const confirmLoginToOrganization = () => {
  confirmLeave(null);
  authService.loginToOrganization(targetOrganizationId.value);
};

const cancelLoginToOrganization = () => {
  organizations.value = JSON.parse(JSON.stringify(initialOrganizations.value));
  shouldResetDropdown.value = true;
  onCancelDialogUnsavedChanges();
};

const loginToOrganization = (organization_id: string) => {
  shouldResetDropdown.value = false;
  if (useUnsavedChangesState.hasUnsavedChanges) {
    hasUnsavedChanges.value = useUnsavedChangesState.hasUnsavedChanges;
    if (doNotShowNextTime.valueOf())
      authService.loginToOrganization(organization_id);
    else {
      targetOrganizationId.value = organization_id;
      warnUnsavedChanges();
    }
  } else {
    authService.loginToOrganization(organization_id);
  }
};
const generateOrganizationIcon = (organization_name: string) => {
  if (!organization_name) return "domain";
  return (
    "initials-" +
      organization_name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("") || "domain"
  );
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  if (userProfile.value) {
    organizationId.value = userProfile.value.org || null;
    const userInfo = await usersService.getUserMe();
    organizations.value = userInfo.organization_users
      .filter((organization_user) => organization_user.is_active)
      .map((organization_user) => ({
        ...organization_user.organization,
        created_date: "",
        domains: null,
        industry: null,
        number_of_employees_range: null,
      }));
    initialOrganizations.value = JSON.parse(
      JSON.stringify(organizations.value),
    );
  }
});

const showOrganizations: ComputedRef<boolean> = computed(
  () => dropdownItems.value.length > 0,
);
const enableOrganizationSelection: ComputedRef<boolean> = computed(
  () => dropdownItems.value.length > 1,
);
</script>
<template>
  <div
    v-if="showOrganizations"
    ref="organizationSelectionActivator"
    :class="orgSwitcherClassList"
  >
    <m-m-icon-dropdown
      :remove-background-color="props.isMobile"
      cy="organizations-dropdown-items"
      :items="dropdownItems"
      :is-disabled="!enableOrganizationSelection"
      :should-reset="shouldResetDropdown"
      display-position="toRight"
      list-variant="shadow"
      :width="dropdownWidth"
      :activator-element="organizationSelectionActivator"
    />
  </div>
  <m-m-dialog-unsaved-changes
    :is-open="isDialogUnsavedChangesOpen"
    @cancel="cancelLoginToOrganization"
    @confirm="confirmLoginToOrganization"
    @update-do-not-show-next-time="updateDoNotShowNextTime"
  />
</template>

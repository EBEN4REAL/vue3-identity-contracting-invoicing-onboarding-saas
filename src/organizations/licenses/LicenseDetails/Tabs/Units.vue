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
import { OrganizationUnitIDRead } from "~/organizations/licenses/licenses.types";
import { OrganizationUnitReadWithUsers } from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogUnassignLicenseFromUnit from "../Dialogs/DialogUnassignLicenseFromUnit.vue";
import DialogManageOptionalPoliciesForUnit from "../Dialogs/DialogManageOptionalPoliciesForUnit.vue";
import { PolicyTypeRead } from "~/policies/policies.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { useUiStore } from "~/stores/useUiStore";

const emit = defineEmits(["assignment-change", "open-assignment-dialog"]);

const props = defineProps({
  units: {
    type: Object as PropType<TableResponse<OrganizationUnitIDRead>>,
    default: () => ({}),
  },
  isUserBasedRecurring: {
    type: Boolean,
    required: true,
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

const uiStore = useUiStore();

const isAddOrganizationUnitDisabled: ComputedRef<boolean> = computed(
  () => props.isUserBasedRecurring || uiStore.isSCViewerOnly,
);

const licenseType = computed(() =>
  props.isAccessLicense ? "license" : "subscription",
);
const emptyState: ComputedRef<EmptyStateType> = computed(() => ({
  icon: sectionIcons["licenses"],
  title: `Assign ${props.isAccessLicense ? "access license" : "subscription"} to organizational units.`,
  description: `All users in these units can access and use this ${licenseType.value}.`,
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/provide-access-to-employees#manage-license-from-licenses-overview",
}));
const headers: TableHeader[] = [
  {
    key: "name",
    label: "Organization unit",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "actions",
    label: "",
  },
];

const userProfile: Ref<UserProfileMM | null> = ref(null);
const organizationUnits: Ref<OrganizationUnitReadWithUsers[]> = ref([]);
const isDialogUnassignLicenseFromUnitOpen: Ref<boolean> = ref(false);
const selectedUnit: Ref<{ id: string; name: string } | null> = ref(null);
const isDialogManageOptionalPoliciesOpen: Ref<boolean> = ref(false);

watch(
  () => props.units,
  async () => await getOrganizationUnits(),
);

const getOrganizationUnits = async () => {
  if (props.units?.results && userProfile.value?.org) {
    organizationUnits.value = await Promise.all(
      props.units?.results.map((unit: OrganizationUnitIDRead) =>
        organizationsService.getOrganizationUnit(
          userProfile.value?.org as string,
          unit.organization_unit_id as string,
        ),
      ),
    );
  }
};

const dropdownItems = (
  unit: OrganizationUnitReadWithUsers,
): TypeDropdownItem[] => {
  const items: TypeDropdownItem[] = [];

  if (props.optionalPolicies.length) {
    items.push({
      label: "Manage optional policies",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      onClick: () => onDialogManageOptionalPoliciesOpen(unit),
    });
  }

  items.push(
    {
      label: "View unit",
      type: "link",
      to: `/sc/units/${unit.id}`,
    },
    {
      label: "Remove unit",
      type: "button",
      isDisabled: uiStore.isSCViewerOnly,
      color: "error",
      onClick: () => onDialogUnassignLicenseFromUnitOpen(unit),
    },
  );

  return items;
};

const onDialogUnassignLicenseFromUnitOpen = (unit: {
  id: string;
  name: string;
}) => {
  selectedUnit.value = unit;
  isDialogUnassignLicenseFromUnitOpen.value = true;
};

const onDialogUnassignLicenseFromUnitClose = () => {
  isDialogUnassignLicenseFromUnitOpen.value = false;
};

const onDialogManageOptionalPoliciesOpen = (unit: {
  id: string;
  name: string;
}) => {
  selectedUnit.value = unit;
  emit("open-assignment-dialog");
};

const onDialogManageOptionalPoliciesClose = () => {
  isDialogManageOptionalPoliciesOpen.value = false;
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  if (userProfile.value?.org && !props.isLicenseCancelled)
    await getOrganizationUnits();
});
</script>

<template>
  <m-m-table
    :headers="headers"
    :is-loading="isLoading"
    :rows="organizationUnits"
    :total-rows="units?.total"
    cy="table-units"
    :empty-state="emptyState"
    @update-params="getOrganizationUnits"
  >
    <template #empty-state-button>
      <m-m-button
        variant="elevated"
        size="small"
        data-cy="empty-state-button-assign-license"
        prepend-icon="plus-white"
        :disabled="isAddOrganizationUnitDisabled"
        @click="onDialogManageOptionalPoliciesOpen"
      >
        Add organizational unit
      </m-m-button>
      <m-m-tooltip
        v-if="isUserBasedRecurring"
        display-position="toLeft"
        max-width="300px"
      >
        Subscription is charged per user and can therefore only be assigned to
        individual users not to organizational units
      </m-m-tooltip>
    </template>
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        data-cy="button-assign-license"
        prepend-icon="plus"
        :disabled="isAddOrganizationUnitDisabled"
        @click="onDialogManageOptionalPoliciesOpen"
      >
        Add organizational unit
      </m-m-button>
      <m-m-tooltip
        v-if="isUserBasedRecurring"
        display-position="toLeft"
        max-width="300px"
      >
        Subscription is charged per user and can therefore only be assigned to
        individual users not to organizational units
      </m-m-tooltip></template
    >
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
  <dialog-unassign-license-from-unit
    :is-open="isDialogUnassignLicenseFromUnitOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="licenseId"
    :unit="selectedUnit"
    @unassigned="emit('assignment-change', selectedUnit?.id)"
    @close="onDialogUnassignLicenseFromUnitClose"
  />
  <dialog-manage-optional-policies-for-unit
    :is-open="isDialogManageOptionalPoliciesOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="licenseId"
    :unit="selectedUnit"
    :optional-policies="optionalPolicies"
    @close="onDialogManageOptionalPoliciesClose"
  />
</template>

<style scoped lang="scss"></style>

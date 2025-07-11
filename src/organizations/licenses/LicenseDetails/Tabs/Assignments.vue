<script setup lang="ts">
import { ComputedRef, Ref, computed, onMounted, ref } from "vue";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import Users from "./Users.vue";
import Units from "./Units.vue";
import Groups from "./Groups.vue";
import {
  AgreementReadExtended,
  OrganizationGroupIDRead,
  OrganizationUnitIDRead,
  OrganizationUserPolicyAssignmentUserIDRead,
} from "../../licenses.types";
import { PolicyUsageRead } from "~/policies/policies.types";
import { policiesService } from "~/service-providers/policies.service";
import { useRoute } from "vue-router";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { authService } from "~/auth/auth.service";
import DialogAssignLicenseToUser from "../Dialogs/DialogAssignLicenseToUser.vue";
import DialogAssignLicenseToGroup from "../Dialogs/DialogAssignLicenseToGroup.vue";
import DialogAssignLicenseToUnit from "../Dialogs/DialogAssignLicenseToUnit.vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const props = defineProps({
  isUserBasedRecurring: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAccessLicense: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const route = useRoute();
const isLoading: Ref<boolean> = ref(true);
const service_consumer_id: Ref<string> = ref("");
const license: Ref<AgreementReadExtended | null> = ref(null);
const licensePolicies: Ref<PolicyUsageRead[]> = ref([]);
const users: Ref<TableResponse<OrganizationUserPolicyAssignmentUserIDRead> | null> =
  ref(null);
const orgName: Ref<string> = ref("");
const groups: Ref<TableResponse<OrganizationGroupIDRead> | null> = ref(null);
const units: Ref<TableResponse<OrganizationUnitIDRead> | null> = ref(null);
const isAssignLicenseToUserDialogOpen: Ref<boolean> = ref(false);
const isAssignLicenseToGroupDialogOpen: Ref<boolean> = ref(false);
const isAssignLicenseToUnitDialogOpen: Ref<boolean> = ref(false);
const initialTableRequestParams = {
  limit: ITEMS_PER_PAGE[0],
  offset: "0",
};

const subtitle: ComputedRef<string> = computed(() =>
  props.isUserBasedRecurring && !props.isAccessLicense
    ? "You can add individual users to this subscription. The price is per user therefor groups and organizational units cannot be added."
    : props.isAccessLicense
      ? "You can add individual users, groups of users or organizational units to this access license"
      : "You can add individual users, groups of users or organizational units to this subscription",
);

const tabs: ComputedRef = computed(() => [
  {
    key: "individuals",
    label: "Individuals",
    isActive: activeTab.value === "individuals",
  },
  { key: "groups", label: "Groups", isActive: activeTab.value === "groups" },
  {
    key: "organization_units",
    label: "Organizational Units",
    isActive: activeTab.value === "organization_units",
  },
]);
const activeTab: Ref<"individuals" | "groups" | "organization_units"> =
  ref("individuals");

const isUsersTabActive = computed(
  () => activeTab.value === "individuals" && !isLoading.value,
);
const isGroupsTabActive = computed(
  () => activeTab.value === "groups" && !isLoading.value,
);
const isOrganizationUnitsTabActive = computed(
  () => activeTab.value === "organization_units" && !isLoading.value,
);
const assignedUsersIds: ComputedRef<string[]> = computed(() => {
  return users.value
    ? users.value.results.map(
        (user: OrganizationUserPolicyAssignmentUserIDRead) =>
          user.organization_user_id as string,
      )
    : [];
});

const assignedGroupsIds: ComputedRef<string[]> = computed(() => {
  return groups.value
    ? groups.value.results.map(
        (group: OrganizationGroupIDRead) =>
          group.organization_group_id as string,
      )
    : [];
});

const assignedUnitsIds: ComputedRef<string[]> = computed(() => {
  return units.value
    ? units.value.results.map(
        (unit: OrganizationUnitIDRead) => unit.organization_unit_id as string,
      )
    : [];
});

const onOpenDialogAssignLicenseToUser = () => {
  isAssignLicenseToUserDialogOpen.value = true;
};

const onOpenDialogAssignLicenseToGroup = () => {
  isAssignLicenseToGroupDialogOpen.value = true;
};

const onOpenDialogAssignLicenseToUnit = () => {
  isAssignLicenseToUnitDialogOpen.value = true;
};

const onCloseDialogAssignLicenseToUser = () => {
  isAssignLicenseToUserDialogOpen.value = false;
};

const onCloseDialogAssignLicenseToGroup = () => {
  isAssignLicenseToGroupDialogOpen.value = false;
};

const onCloseDialogAssignLicenseToUnit = () => {
  isAssignLicenseToUnitDialogOpen.value = false;
};

const fetchInitialUsers = async () => {
  try {
    users.value =
      await policiesService.getServiceConsumerAgreementOrganizationUsers(
        service_consumer_id.value,
        route.params.license_id.toString(),
        initialTableRequestParams,
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch users",
      status: "error",
    });
  }
};
const fetchInitialGroups = async () => {
  try {
    groups.value =
      await policiesService.getServiceConsumerAgreementOrganizationGroups(
        service_consumer_id.value,
        route.params.license_id.toString(),
        initialTableRequestParams,
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch groups",
      status: "error",
    });
  }
};

const fetchInitialUnits = async () => {
  try {
    units.value =
      await policiesService.getServiceConsumerAgreementOrganizationUnits(
        service_consumer_id.value,
        route.params.license_id.toString(),
        initialTableRequestParams,
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch units",
      status: "error",
    });
  }
};

const fetchLicensePolicies = async () => {
  try {
    licensePolicies.value =
      await policiesService.getServiceConsumerAgreementPolicies(
        service_consumer_id.value,
        route.params.license_id.toString(),
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch license policies",
      status: "error",
    });
  }
};

const fetchInitialTabsData = async () => {
  isLoading.value = true;

  await fetchLicense();
  await Promise.all([
    fetchInitialUsers(),
    fetchInitialGroups(),
    fetchInitialUnits(),
    fetchLicensePolicies(),
  ]);

  isLoading.value = false;
};

const fetchLicense = async () => {
  try {
    license.value = await policiesService.getServiceConsumerAgreement(
      service_consumer_id.value,
      route.params.license_id.toString(),
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch license",
      status: "error",
    });
  }
};

const onLicenseAssignmentChange = async (
  assignedTo: "users" | "groups" | "units",
) => {
  await fetchLicense();

  switch (assignedTo) {
    case "users":
      await fetchInitialUsers();
      break;
    case "groups":
      await fetchInitialGroups();
      break;
    case "units":
      await fetchInitialUnits();
      break;
  }
};

onMounted(async () => {
  const userProfile = await authService.getProfile();
  service_consumer_id.value = userProfile?.org || "";
  orgName.value = userProfile?.org_name || "";

  if (userProfile?.org) {
    await fetchInitialTabsData();
  }
});
</script>

<template>
  <m-m-expandable-card title="Users" cy="users-expandable">
    <div class="subtitle">{{ subtitle }}</div>
    <div class="assignments-tabs-container">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :data-cy="`assignment-tab-${tab.key}`"
        :class="[
          'assignments-tabs',
          { 'assignments-tabs--active': tab.isActive },
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <Users
      v-if="isUsersTabActive"
      :users="users"
      :license-id="license?.id"
      :is-loading="isLoading"
      :is-license-cancelled="license?.cancelled"
      :optional-policies="licensePolicies"
      :service-consumer-id="license?.service_consumer_id"
      :is-access-license="isAccessLicense"
      @assignment-change="onLicenseAssignmentChange('users')"
      @open-assignment-dialog="onOpenDialogAssignLicenseToUser"
    />

    <Groups
      v-if="isGroupsTabActive"
      :groups="groups"
      :is-user-based-recurring="isUserBasedRecurring"
      :is-loading="isLoading"
      :license-id="license?.id"
      :is-license-cancelled="license?.cancelled"
      :optional-policies="licensePolicies"
      :service-consumer-id="license?.service_consumer_id"
      :is-access-license="isAccessLicense"
      @assignment-change="onLicenseAssignmentChange('groups')"
      @open-assignment-dialog="onOpenDialogAssignLicenseToGroup"
    />

    <Units
      v-if="isOrganizationUnitsTabActive"
      :units="units"
      :is-user-based-recurring="isUserBasedRecurring"
      :is-loading="isLoading"
      :license-id="license?.id"
      :is-license-cancelled="license?.cancelled"
      :optional-policies="licensePolicies"
      :service-consumer-id="license?.service_consumer_id"
      :is-access-license="isAccessLicense"
      @assignment-change="onLicenseAssignmentChange('units')"
      @open-assignment-dialog="onOpenDialogAssignLicenseToUnit"
    />
  </m-m-expandable-card>

  <dialog-assign-license-to-user
    v-if="isAssignLicenseToUserDialogOpen"
    :is-open="isAssignLicenseToUserDialogOpen"
    :license="license"
    :assigned-users-ids="assignedUsersIds"
    :policies="licensePolicies"
    @assigned="onLicenseAssignmentChange('users')"
    @close="onCloseDialogAssignLicenseToUser"
  />
  <dialog-assign-license-to-group
    v-if="isAssignLicenseToGroupDialogOpen"
    :is-open="isAssignLicenseToGroupDialogOpen"
    :license="license"
    :assigned-groups-ids="assignedGroupsIds"
    :policies="licensePolicies"
    @assigned="onLicenseAssignmentChange('groups')"
    @close="onCloseDialogAssignLicenseToGroup"
  />
  <dialog-assign-license-to-unit
    v-if="units?.results"
    :is-open="isAssignLicenseToUnitDialogOpen"
    :license="license"
    :assigned-units-ids="assignedUnitsIds"
    :policies="licensePolicies"
    @assigned="onLicenseAssignmentChange('units')"
    @close="onCloseDialogAssignLicenseToUnit"
  />
</template>

<style scoped lang="scss">
.assignments-tabs-container {
  height: 32px;
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  margin-left: 24px;
  margin-bottom: 32px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  border: 1px solid #d3d7dc;
  border-radius: 8px;
  background-color: #fafbfc;
  cursor: pointer;
  padding: 1px;
}
.subtitle {
  height: 32px;
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  margin-left: 24px;
  align-items: center;
  justify-content: center;
  padding: 1px;
  font-weight: 400;
  font-size: 14px;
  color: #475467;
}
.assignments-tabs {
  padding: 4px 12px 4px 12px;
  gap: 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;
  color: #6d7480;
  transition:
    background-color 0.3s,
    color 0.3s;

  will-change: background-color, color;
  &--active {
    background-color: #d3d7dc;
    color: #072e51;
  }
}
</style>

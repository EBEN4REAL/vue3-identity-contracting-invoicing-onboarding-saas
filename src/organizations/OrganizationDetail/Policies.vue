<script setup lang="ts">
import { PropType, Ref, onMounted, ref } from "vue";
import { authService } from "~/auth/auth.service";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { OrganizationRead } from "~/iam/iam.types";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { policiesService } from "~/service-providers/policies.service";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { PolicyReadWithOwnerName } from "~/policies/policies.types";

const props = defineProps({
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
  },
});

const serviceConsumerId: Ref<string> = ref("");
const policies: Ref<TableResponse<PolicyReadWithOwnerName> | null> = ref(null);
const description: string =
  "All policies directly assigned to this organization.";

const emptyState: EmptyStateType = {
  icon: sectionIcons["organizationDetails"],
  title: "No policies",
  description:
    "No providers have assigned policies to your entire organization",
};

const headers = [
  {
    key: "name",
    label: "Policy name",
    sortLabel: "Policy name",
  },
  {
    key: "owner_name",
    label: "Organization name",
  },
];

const handleUpdateParams = (params: TableRequestParams) => {
  getOrgPolicies(params);
};

const getOrgPolicies = async (params?: TableRequestParams) => {
  policies.value = await policiesService.getServiceConsumerOrgPolicies(
    props.organization.id,
    params ? params : { limit: ITEMS_PER_PAGE[0], offset: "0" },
  );
};

onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.org) {
    serviceConsumerId.value = userProfile.org;
    await getOrgPolicies();
  }
});
</script>
<template>
  <m-m-table
    cy="policies-table"
    :headers="headers"
    :rows="policies?.results || []"
    :total-rows="policies?.total"
    :description="description"
    show-search
    :empty-state="emptyState"
    @update-params="handleUpdateParams"
  >
    <template #name="{ row }">
      <span class="mm-fw-500" :data-cy="`policy-name-${row.id}`">
        {{ row.name }}
      </span>
    </template>
    <template #owner_name="{ row }">
      <span :data-cy="`policy-organization-name-${row.id}`">
        {{ row.owner_name }}
      </span>
    </template>
  </m-m-table>
</template>
<style scoped></style>

<script setup lang="ts">
import { computed } from "vue";
import { ComputedRef } from "vue";
import { PropType, Ref, onMounted, ref } from "vue";
import { authService } from "~/auth/auth.service";
import { OrganizationUserRead } from "~/iam/iam.types";
import {
  EmptyStateType,
  TableRequestParams,
} from "~/mm_ui_kit/src/types/table.types";
import { PolicyReadWithOwnerName } from "~/policies/policies.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";

const props = defineProps({
  policies: {
    type: Array as PropType<PolicyReadWithOwnerName[]>,
    default: () => [],
  },
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: () => ({}),
  },
  isLoading: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["updatePolicies"]);
const serviceProviderId: Ref<string> = ref("");
const isSPAdmin: Ref<boolean> = ref(false);
const isSPEditor: Ref<boolean> = ref(false);
const description: ComputedRef<string> = computed(
  () =>
    `All policies assigned to ${props.user.first_name} ${props.user.last_name} by providers.`,
);
const emptyState: EmptyStateType = {
  icon: sectionIcons["users"],
  title: "No policies",
  description: "No providers have assigned policies to this user.",
};
const headers = [
  {
    key: "name",
    label: "Policy name",
  },
  {
    key: "owner_name",
    label: "Organization name",
  },
];

const handleUpdateParams = (params: TableRequestParams) => {
  emit("updatePolicies", params);
};

onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.sp) {
    serviceProviderId.value = userProfile.sp;
  }
  isSPAdmin.value = await authService.isUserSPAdmin();
  isSPEditor.value = await authService.isUserSPEditor();
});
</script>

<template>
  <m-m-table
    :headers="headers"
    :is-loading="isLoading"
    :rows="policies"
    :description="description"
    cy="users-policies-table"
    show-search
    :empty-state="emptyState"
    @update-params="handleUpdateParams"
  >
    <template #name="{ row }">
      <div class="mm-flex mm-flex-align-center">
        <span class="font-weight-500" :data-cy="`column-name-${row.id}`">{{
          row.name
        }}</span>
      </div>
    </template>
    <template #owner_name="{ row }">
      {{ row.owner_name }}
    </template>
  </m-m-table>
</template>

<style scoped lang="scss"></style>

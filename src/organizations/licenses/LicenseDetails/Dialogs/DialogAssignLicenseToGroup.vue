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
import { useRoute } from "vue-router";
import { organizationsService } from "~/organizations/organizations.service";
import { AgreementReadExtended } from "~/organizations/licenses/licenses.types";
import { TableRequestParams } from "~/mm_ui_kit/src/types/table.types";
import { OrganizationGroupRead } from "~/iam/iam.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { policiesService } from "~/service-providers/policies.service";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { PolicyUsageRead } from "~/policies/policies.types";

const route = useRoute();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  license: {
    type: Object as PropType<AgreementReadExtended | null>,
    default: null,
  },
  assignedGroupsIds: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  policies: {
    type: Array as PropType<PolicyUsageRead[]>,
    default: () => [],
  },
});

const emit = defineEmits(["close", "assigned", "open-assignment-dialog"]);
const isLoading: Ref<boolean> = ref(false);
const selectedGroupsIds: Ref<string[]> = ref([]);
const organizationsGroups: Ref<OrganizationGroupRead[]> = ref([]);
const isSubmitButtonLoading: Ref<boolean> = ref(false);
const isSubmitButtonDisabled: Ref<boolean> = ref(true);
const optional_policy_ids: Ref<string[]> = ref([]);

const title: ComputedRef<string> = computed(
  () => `Assign ${props.license?.agreement_type.name} to group(s)`,
);

const organizationGroupsForSelects = computed(() =>
  organizationsGroups.value.map((organizationGroup: OrganizationGroupRead) => ({
    name: organizationGroup.name,
    subtitle: organizationGroup.description,
    value: organizationGroup.id,
    disabled: !!props.assignedGroupsIds.find(
      (selectedOrganizationUserId: string) =>
        selectedOrganizationUserId === organizationGroup.id,
    ),
  })),
);

const onDialogClose = () => {
  emit("close");
};

const fetchOrganizationGroups = async (params: TableRequestParams) => {
  isLoading.value = true;

  const organizationsGroupsRes =
    await organizationsService.getOrganizationGroups(
      props.license?.service_consumer_id as string,
      params,
    );

  isLoading.value = false;

  organizationsGroups.value = organizationsGroupsRes?.results || [];
};

const requestAssignAgreementToGroup = async (organizationGroupId: string) => {
  return policiesService.assignServiceConsumerAgreementToGroup(
    props.license?.service_consumer_id as string,
    route.params.license_id.toString(),
    organizationGroupId,
    optional_policy_ids.value,
  );
};

const onSubmit = async () => {
  try {
    isSubmitButtonDisabled.value = true;
    isSubmitButtonLoading.value = true;
    const requests = selectedGroupsIds.value.map((selectedGroupsId: string) =>
      requestAssignAgreementToGroup(selectedGroupsId),
    );
    await Promise.all(requests);
    emit("assigned");
    emit("close");
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to add license to group",
      status: "error",
    });
  } finally {
    isSubmitButtonDisabled.value = false;
    isSubmitButtonLoading.value = false;
  }
};

const selectGroupOptionClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

watch(
  () => selectedGroupsIds.value,
  () => {
    isSubmitButtonDisabled.value = !Boolean(selectedGroupsIds.value.length);
  },
);

onMounted(async () => {
  await fetchOrganizationGroups({
    limit: ITEMS_PER_PAGE[0],
    offset: "0",
  });
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    icon="document-check"
    cy="dialog-assign-license-to-group"
    @close="onDialogClose"
  >
    <m-m-autocomplete
      id="autocomplete-multiple"
      v-model="selectedGroupsIds"
      placeholder="Click to add group"
      label="Search & add group"
      cy="select-organization-groups"
      icon-prepended="search-lg"
      clear-button="x-circle"
      :items="organizationGroupsForSelects"
      :total-items="organizationsGroups.length"
      item-title="name"
      item-value="value"
      multiple
      :loading="isLoading"
      @update-params="fetchOrganizationGroups"
    >
      <template #option="{ item }">
        <div :class="selectGroupOptionClassList(item.disabled)">
          {{ item.name }}
          <div
            v-if="item.disabled"
            class="mm-flex mm-flex-justify-between mm-flex-grow"
          >
            <m-m-badge
              class="mm-ml-3"
              :status="BadgeTypes.Inactive"
              text="Already added"
            />
            <m-m-icon icon="check-thin-primary" width="12px" />
          </div>
        </div>
      </template>
    </m-m-autocomplete>
    <template v-if="policies?.length">
      <div class="mm-page-form-label mm-mt-10">Assign optional policies</div>
      <div v-for="policy in policies" :key="policy.id" class="mm-mt-8">
        <m-m-checkbox
          v-model="optional_policy_ids"
          :value="policy.id"
          name="optional_policy_ids"
          :data-cy="`checkbox-policy-${policy.id}`"
        >
          {{ policy.name }}
        </m-m-checkbox>
      </div>
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" color="gray" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button
          cy="button-add-license-to-groups"
          prepend-icon="plus-white"
          :loading="isSubmitButtonLoading"
          :disabled="isSubmitButtonDisabled"
          @click="onSubmit"
        >
          Add license
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

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
import { OrganizationUserRead } from "~/iam/iam.types";
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
  assignedUsersIds: {
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
const totalItems: Ref<number> = ref(0);
const selectedUsersIds: Ref<string[]> = ref([]);
const organizationsUsers: Ref<OrganizationUserRead[]> = ref([]);
const isSubmitButtonLoading: Ref<boolean> = ref(false);
const isSubmitButtonDisabled: Ref<boolean> = ref(true);
const optional_policy_ids: Ref<string[]> = ref([]);
const title: ComputedRef<string> = computed(
  () => `Add ${props.license?.agreement_type.name} to user(s)`,
);

const organizationUsersForSelects = computed(() =>
  organizationsUsers.value.map((organizationUser: OrganizationUserRead) => ({
    name:
      organizationUser.first_name && organizationUser.last_name
        ? `${organizationUser.first_name} ${organizationUser.last_name}`
        : organizationUser.email,
    email: organizationUser.email,
    id: organizationUser.id,
    disabled: !!props.assignedUsersIds.find(
      (selectedOrganizationUserId: string) =>
        selectedOrganizationUserId === organizationUser.id,
    ),
  })),
);

const onDialogClose = () => {
  emit("close");
};

const fetchOrganizationUsers = async (params: TableRequestParams) => {
  isLoading.value = true;

  const organizationsUsersRes = await organizationsService.getOrganizationUsers(
    props.license?.service_consumer_id as string,
    params,
  );

  isLoading.value = false;

  organizationsUsers.value = organizationsUsersRes?.results || [];
  totalItems.value = organizationsUsersRes?.total || 0;
};

const requestAssignAgreementToUser = async (organizationUserId: string) => {
  return policiesService.assignServiceConsumerAgreementToOrgUser(
    props.license?.service_consumer_id as string,
    route.params.license_id.toString(),
    organizationUserId,
    optional_policy_ids.value,
  );
};

const onSelectAgreementScrolledToEnd = async (params: TableRequestParams) => {
  await fetchOrganizationUsers(params);
};

const onSubmit = async () => {
  try {
    isSubmitButtonDisabled.value = true;
    isSubmitButtonLoading.value = true;
    const requests = selectedUsersIds.value.map((selectedUsersId: string) =>
      requestAssignAgreementToUser(selectedUsersId),
    );
    await Promise.all(requests);
    emit("assigned");
    emit("close");
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to add license to user",
      status: "error",
    });
  } finally {
    isSubmitButtonDisabled.value = false;
    isSubmitButtonLoading.value = false;
  }
};

const selectUserOptionClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

watch(
  () => selectedUsersIds.value,
  () => {
    isSubmitButtonDisabled.value = !Boolean(selectedUsersIds.value.length);
  },
);

onMounted(async () => {
  await fetchOrganizationUsers({
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
    cy="dialog-assign-license-to-user"
    @close="onDialogClose"
  >
    <m-m-autocomplete
      id="autocomplete-multiple"
      v-model="selectedUsersIds"
      placeholder="Click to add user"
      label="Search and add user"
      data-cy="select-organization-users"
      icon-prepended="search-lg"
      clear-button="x-circle"
      :items="organizationUsersForSelects"
      :total-items="totalItems"
      item-title="name"
      item-value="id"
      multiple
      :loading="isLoading"
      @update-params="onSelectAgreementScrolledToEnd"
    >
      <template #option="{ item }">
        <div :class="selectUserOptionClassList(item.disabled)">
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
      <div class="mm-page-form-label mm-mt-10">Assign Optional Policies</div>
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
          cy="button-assign-license-to-users"
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

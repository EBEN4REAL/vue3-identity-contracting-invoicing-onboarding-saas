<script lang="ts" setup>
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import { authService } from "~/auth/auth.service";
import { policiesService } from "~/service-providers/policies.service";
import { OrganizationUserRead, ServiceProviderRead } from "~/iam/iam.types";
import { default as AssignSubscriptionToUser } from "../Dialogs/AssignLicenseToUser.vue";
import { default as UnassignSubscriptionFromUser } from "../Dialogs/UnassignLicenseFromUser.vue";
import {
  AgreementTypeRead,
  ErrorAlertProp,
  SubmitType,
} from "~/service-providers/Licenses/licenses.types";
import { organizationsService } from "~/organizations/organizations.service";
import {
  ServiceConsumerAgreementRead,
  ServiceConsumerAgreementsRead_,
} from "~/organizations/licenses/licenses.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import {
  EmptyStateType,
  TablePagination,
  TableRequestParams,
} from "~/mm_ui_kit/src/types/table.types";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogManageOptionalPoliciesForUser from "~/organizations/licenses/LicenseDetails/Dialogs/DialogManageOptionalPoliciesForUser.vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { getServiceProviderName } from "~/mm_ui_kit/src/helpers/serviceProviderUtils";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";

const emptyState: EmptyStateType = {
  icon: sectionIcons["users"],
  title: "No subscriptions",
  description: "No subscriptions have been assigned to this user.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/provide-access-to-employees#manage-license-for-specific-user",
};

const headers = [
  {
    key: "agreement_type_name",
    label: "Subscription Name",
    sortable: true,
    sortIcon: true,
    order: "asc",
    sortName: "agreement_type.name",
  },
  {
    key: "service_provider_name",
    label: "Organization Name",
  },
  {
    key: "actions",
    label: "",
  },
];

const props = defineProps({
  user: {
    type: Object as PropType<OrganizationUserRead>,
    required: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const serviceConsumerId: Ref<string> = ref("");
const subscriptions: Ref<ServiceConsumerAgreementsRead_ | null> = ref(null);
const isConfirmUnassignDialogOpen: Ref<boolean> = ref(false);
const isAssignDialogOpen: Ref<boolean> = ref(false);
const subscriptionToUnassign: Ref<ServiceConsumerAgreementsRead_ | null> =
  ref(null);
const loadingUnassign: Ref<boolean> = ref(false);
const isSaving: Ref<boolean> = ref(false);
const isInErrorState: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const serviceProviders: Ref<ServiceProviderRead[]> = ref([]);
const agreements: Ref<ServiceConsumerAgreementRead[]> = ref([]);
const selectedUser: Ref<{ id: string; name: string } | null> = ref(null);
const isDialogManageOptionalPoliciesOpen: Ref<boolean> = ref(false);
const selectedSubscription: Ref<ServiceConsumerAgreementRead | null> =
  ref(null);
const isLoading: Ref<boolean> = ref(true);

const tryUnassign = (row: ServiceConsumerAgreementsRead_) => {
  subscriptionToUnassign.value = row;
  toggleConfirmUnassign();
};

const resetErrorState = () => {
  isInErrorState.value = false;
  alertText.value = "";
};

const errorAlert: Ref<ErrorAlertProp> = ref({
  resetErrorState,
  alertText,
  isInErrorState,
});

const isSubscriptionBtnDisabled: ComputedRef<boolean> = computed(
  () => agreements.value.length === 0 || props.isSCViewerOnly,
);

const fullName: ComputedRef<string> = computed(
  () => `${props.user?.first_name} ${props.user?.last_name}`,
);

const displayName: ComputedRef<string> = computed(() => {
  const name = fullName.value;
  const email = props?.user?.email;
  return name && name !== "null null" ? name : email;
});

const description: ComputedRef<string> = computed(
  () => `All subscriptions directly assigned to ${displayName.value}.`,
);

const toggleConfirmUnassign = () => {
  isConfirmUnassignDialogOpen.value = !isConfirmUnassignDialogOpen.value;
};

const toggleAssignDialog = () => {
  isAssignDialogOpen.value = !isAssignDialogOpen.value;
};

const getSubscriptionAgreements = async (params?: TableRequestParams) => {
  const initialQueryParams: TablePagination = {
    limit: ITEMS_PER_PAGE[0],
    offset: "0",
  };
  try {
    isLoading.value = true;
    const fetchedSubscriptions =
      await policiesService.getServiceConsumerAgreements(
        serviceConsumerId.value,
        {
          ...initialQueryParams,
          ...params,
          assigned_organization_user_id: props.user.id,
          category: "SUBSCRIPTION",
        },
      );
    subscriptions.value = fetchedSubscriptions;
    await getServiceProviders();
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch subscriptions",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const onUnassignButtonClick = async () => {
  loadingUnassign.value = true;
  await policiesService.unassignServiceConsumerAgreementFromOrgUser(
    serviceConsumerId.value,
    subscriptionToUnassign!.value!.id,
    props.user.id,
  );
  loadingUnassign.value = false;
  await getSubscriptionAgreements();
  toggleConfirmUnassign();
};
const submit = async (payload: SubmitType) => {
  try {
    isSaving.value = true;
    await policiesService.assignServiceConsumerAgreementToOrgUser(
      serviceConsumerId.value,
      payload.agreement_id,
      props.user.id,
      payload.optional_policy_ids,
    );
    isSaving.value = false;
    await getSubscriptionAgreements();
  } catch (error) {
    isSaving.value = false;
    isInErrorState.value = true;
    alertText.value = "Failed to add subscription";
  }
};

const getServiceProviders = async () => {
  if (!subscriptions.value?.results) return;
  const service_provider_ids = subscriptions.value.results.map(
    (subscription: ServiceConsumerAgreementsRead_) =>
      subscription.service_provider_id,
  );
  serviceProviders.value =
    await organizationsService.getOrganizationServiceProvidersDetails(
      props.user.organization.id,
      service_provider_ids,
    );
};

const dropdownItems = (
  row: ServiceConsumerAgreementRead,
): TypeDropdownItem[] => {
  selectedSubscription.value = row;
  const items: TypeDropdownItem[] = [];

  const userInfo = {
    id: props.user.id,
    name: `${props.user.first_name} ${props.user.last_name}`,
  };

  if (row.has_optional_policies) {
    items.push({
      label: "Manage optional policies",
      type: "button",
      isDisabled: props.isSCViewerOnly,
      onClick: () => onDialogManageOptionalPoliciesOpen(userInfo),
    });
  }

  items.push({
    label: "Remove subscription",
    type: "button",
    color: "error",
    onClick: () => {
      tryUnassign(row);
    },
  });

  return items;
};

const updateOrgSubscriptions = (
  subscriptions: ServiceConsumerAgreementRead[],
) => {
  agreements.value = subscriptions;
};

const onDialogManageOptionalPoliciesOpen = async (user: {
  id: string;
  name: string;
}) => {
  selectedUser.value = user;
  isDialogManageOptionalPoliciesOpen.value = true;
};

const onDialogManageOptionalPoliciesClose = () => {
  isDialogManageOptionalPoliciesOpen.value = false;
};

const detailedViewLink = (row: AgreementTypeRead) =>
  `/sc/subscriptions/${row?.id}`;

onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.org) {
    serviceConsumerId.value = userProfile.org as string;
  }
});
</script>
<template>
  <m-m-table
    v-if="serviceConsumerId"
    :is-loading="isLoading"
    :headers="headers"
    :rows="subscriptions?.results"
    :total-rows="subscriptions?.total"
    cy="user-details-subscriptions-table"
    :description="description"
    show-search
    :empty-state="emptyState"
    @update-params="getSubscriptionAgreements"
  >
    <template #empty-state-button>
      <m-m-button
        variant="elevated"
        size="small"
        prepend-icon="plus-white"
        class="mm-ml-auto"
        cy="empty-state-assign-subscription-to-user-button"
        :disabled="isSubscriptionBtnDisabled"
        @click="toggleAssignDialog"
      >
        Add subscription
      </m-m-button>
    </template>
    <template #agreement_type_name="{ row }">
      <m-m-link
        :to="detailedViewLink(row)"
        font-weigth="500"
        :data-cy="`column-name-${row.id}`"
      >
        {{ row.agreement_type_name }}
      </m-m-link>
    </template>
    <template #actions="{ row }">
      <m-m-dropdown :cy="`dropdown-${row.id}`" :items="dropdownItems(row)">
        <template #activator>
          <m-m-button
            prepend-icon="dots-vertical"
            variant="text"
            :cy="`actions-button-${row.id}`"
          />
        </template>
      </m-m-dropdown>
    </template>
    <template #service_provider_name="{ row }">
      <span class="font-weight-500">
        {{ getServiceProviderName(serviceProviders, row.service_provider_id) }}
      </span>
    </template>
    <template #action>
      <m-m-button
        variant="outlined"
        size="small"
        prepend-icon="plus"
        class="mm-ml-auto"
        cy="assign-subscription-button"
        :disabled="isSubscriptionBtnDisabled"
        @click="toggleAssignDialog"
      >
        Add subscription
      </m-m-button>
    </template>
  </m-m-table>

  <assign-subscription-to-user
    v-if="serviceConsumerId"
    :is-open="isAssignDialogOpen"
    :user="user"
    :service-consumer-id="serviceConsumerId"
    :error-alert="errorAlert"
    :is-saving="isSaving"
    :assigned-licenses="subscriptions?.results"
    category="SUBSCRIPTION"
    @update-org-licenses="updateOrgSubscriptions"
    @close="toggleAssignDialog"
    @submit="submit"
  />

  <unassign-subscription-from-user
    v-if="subscriptionToUnassign"
    :license-to-unassign="subscriptionToUnassign"
    :loading-unassign="loadingUnassign"
    :is-open="isConfirmUnassignDialogOpen"
    :user="user"
    category="SUBSCRIPTION"
    @close="toggleConfirmUnassign"
    @submit="onUnassignButtonClick"
  />

  <dialog-manage-optional-policies-for-user
    :is-open="isDialogManageOptionalPoliciesOpen"
    :service-consumer-id="serviceConsumerId"
    :license-id="selectedSubscription?.id"
    :user="selectedUser"
    @close="onDialogManageOptionalPoliciesClose"
  />
</template>

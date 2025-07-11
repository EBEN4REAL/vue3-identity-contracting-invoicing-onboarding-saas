<script setup lang="ts">
import { Ref, ref } from "vue";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { ServiceConsumerAgreementRead } from "../licenses/licenses.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { policiesService } from "~/service-providers/policies.service";
import { authService } from "~/auth/auth.service";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { organizationsService } from "../organizations.service";
import { ServiceProviderRead } from "~/iam/iam.types";
import { getServiceProviderName } from "~/mm_ui_kit/src/helpers/serviceProviderUtils";
import {
  statusMap,
  getStatusText,
} from "~/mm_ui_kit/src/helpers/agreementUtils";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
const serviceProviders: Ref<ServiceProviderRead[] | null> = ref(null);
const serviceConsumerId: Ref<string> = ref("");
const isLoading: Ref<boolean> = ref(true);
const emptyState: EmptyStateType = {
  icon: "arrow-rounded-outline",
  title: "No subscriptions available",
  description:
    "Once your organization gets a subscription from a Veriam powered provider it will be displayed here.",
};
const subscriptions: Ref<TableResponse<ServiceConsumerAgreementRead> | null> =
  ref(null);

const headers = [
  {
    key: "agreement_type_name",
    label: "Subscription name",
    sortable: true,
    sortName: "agreement_type.name",
    order: "asc",
    sortIcon: true,
  },
  {
    key: "service_provider_name",
    label: "Organization name",
  },

  {
    key: "effective_from_date",
    label: "Effective from",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
  {
    key: "valid_until",
    label: "Effective to",
  },
  {
    key: "cancelled",
    label: "Status",
  },
  {
    label: "",
    key: "actions",
  },
];

//future possible improvement
// const handleActivateSubscription = async (subscription_id: string) => {
//   isActivateSubscriptionDialogOpen.value = true;
//   subscriptionId.value = subscription_id;
// };

// const isSubscriptionPending = (row: ServiceConsumerAgreementRead) => {
//   if (!row.cancelled && !row.active) {
//     return true;
//   }
//   return false;
// };

const tableRowActionsDropdownItems = (
  row: ServiceConsumerAgreementRead,
): TypeDropdownItem[] => [
  // {
  //   isHidden: !isSubscriptionPending(row) || !activateSubscriptionEnabled.value,
  //   label: "Activate Subscription",
  //   type: "button",
  //   onClick: () => {
  //     handleActivateSubscription(row.id);
  //   },
  // },
  {
    label: "View subscription",
    type: "link",
    to: `/sc/subscriptions/${row.id}`,
  },
];

const handleUpdateParams = async (params: TableRequestParams) => {
  if (serviceConsumerId.value == "") {
    const userProfile = await authService.getProfile();
    if (userProfile?.org) {
      serviceConsumerId.value = userProfile.org;
    }
  }
  getSubscriptions(params);
};

const getServiceProviders = async () => {
  if (!subscriptions.value?.results) return;

  try {
    const uniqueNewProviderIds = [
      ...new Set(
        subscriptions.value.results.map(
          (subscription) => subscription.service_provider_id,
        ),
      ),
    ];
    const newServiceProviders = await Promise.all(
      uniqueNewProviderIds.map((id) =>
        organizationsService.getOrganizationServiceProvider(
          id,
          serviceConsumerId.value,
        ),
      ),
    );
    serviceProviders.value = [
      ...(serviceProviders.value || []),
      ...newServiceProviders,
    ];
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch service providers",
      status: "error",
    });
  }
};

const getSubscriptions = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    if (serviceConsumerId.value) {
      subscriptions.value = await policiesService.getServiceConsumerAgreements(
        serviceConsumerId.value,
        params
          ? { category: "SUBSCRIPTION", ...params }
          : { category: "SUBSCRIPTION", limit: ITEMS_PER_PAGE[0], offset: "0" },
      );
    }
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
</script>

<template>
  <m-m-overview-page
    resource-id="subscriptions.overview"
    :show-config-banner="false"
  >
    <m-m-table
      cy="subscriptions-table"
      :headers="headers"
      :is-loading="isLoading"
      :rows="subscriptions?.results || []"
      :total-rows="subscriptions?.total"
      show-search
      :empty-state="emptyState"
      @update-params="handleUpdateParams"
    >
      <template #agreement_type_name="{ row }">
        <m-m-link
          :to="`/sc/subscriptions/${row.id}`"
          font-weigth="500"
          :cy="`subscription-name-${row.id}`"
        >
          {{ row.agreement_type_name || "-" }}
        </m-m-link>
      </template>
      <template #service_provider_name="{ row }">
        <span class="font-weight-500">
          {{
            getServiceProviderName(serviceProviders, row.service_provider_id)
          }}
        </span>
      </template>
      <template #effective_from_date="{ row }">
        <m-m-formatted-date
          v-if="row.effective_from_date"
          :raw-date="row.effective_from_date"
        />
        <span v-else>-</span>
      </template>
      <template #valid_until="{ row }">
        <m-m-formatted-date
          v-if="row.valid_until"
          :raw-date="row.valid_until"
        />
        <span v-else>-</span>
      </template>
      <template #cancelled="{ row }">
        <span>
          {{ row.status }}
        </span>
        <m-m-badge
          v-if="row.cancel_at_period_end"
          :status="BadgeTypes.Warning"
          indicator
          text="Non Renewing"
        />
        <m-m-badge
          v-else
          :status="statusMap(row.cancelled as boolean, row.active as boolean)"
          :text="getStatusText(row)"
          indicator
        />
      </template>
      <template #actions="{ row }">
        <div class="mm-flex mm-flex-justify-end">
          <m-m-dropdown
            list-side="left"
            :items="tableRowActionsDropdownItems(row)"
            :cy="`actions-dropdown-${row.id}`"
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
      </template> </m-m-table
  ></m-m-overview-page>
</template>

<style scoped></style>

<script lang="ts" setup>
import { ref, onMounted, Ref, computed, ComputedRef, PropType } from "vue";

import { OrganizationUserRead, LoginAttemptRead } from "~/iam/iam.types";
import {
  ITEMS_PER_PAGE,
  HISTORY_LOGIN_ACCESS_MAP,
  HISTORY_LOGIN_OUTCOME_MAP,
} from "~/common/constants";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { organizationsService } from "~/organizations/organizations.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const props = defineProps({
  organizationId: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    default: "",
  },
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: () => ({}),
  },
});

const isLoading: Ref<boolean> = ref(false);
const userLoginHistoriesResponse: Ref<TableResponse<LoginAttemptRead>> =
  ref(null);

const LOGIN_HISTORIES_TABLE_HEADERS = [
  {
    key: "date",
    label: "Date & time",
    sortLabel: "Newest first",
    sortable: true,
    sortIcon: true,
    sortName: "attempt_date",
    order: "asc",
  },
  { key: "url", label: "Application URL", sortable: true },
  { key: "login_outcome", label: "Authentication" },
  { key: "login_access", label: "Access" },
  { key: "ip_address", label: "IP Address" },
];

const description: ComputedRef<string> = computed(
  () =>
    `An overview of all logins of ${props.user.first_name} ${props.user.last_name} for ${props.user.organization.name}.`,
);

const getUserLoginHistories = async (params: TableRequestParams) => {
  isLoading.value = true;

  try {
    userLoginHistoriesResponse.value =
      await organizationsService.getOrganizationUserLoginHistories(
        props.organizationId,
        props.userId,
        params,
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch user login history",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateLoginHistoryTableParams = async (
  params: TableRequestParams,
) => {
  const { limit, offset, query, sort } = params;
  await getUserLoginHistories({
    limit,
    offset,
    ...(query && { query }),
    ...(sort && { sort }),
  });
};

const getAccessStatus = (status: string) => {
  switch (status) {
    case "ALLOW":
      return {
        badgeType: BadgeTypes.Active,
        toolTipTextContent: "Access was granted to the application",
      };
    default:
      return {
        badgeType: BadgeTypes.Cancelled,
        toolTipTextContent: "Access was denied to the application",
      };
  }
};

const getOutcomeStatus = (status: string) => {
  switch (status) {
    case "S":
      return {
        badgeType: BadgeTypes.Active,
        toolTipTextContent: "Authentication was successful",
      };
    case "P":
      return {
        badgeType: BadgeTypes.Warning,
        toolTipTextContent: "Authentication started but not completed",
      };
    default:
      return {
        badgeType: BadgeTypes.Cancelled,
        toolTipTextContent: "Authentication failed",
      };
  }
};

onMounted(async () => {
  await getUserLoginHistories({ limit: ITEMS_PER_PAGE[0], offset: "0" });
});
</script>
<template>
  <div>
    <div class="mm-mb-4">
      <h2 class="mm-page-title mm-page-title--h2">Login History</h2>
    </div>

    <m-m-table
      :is-loading="isLoading"
      :headers="LOGIN_HISTORIES_TABLE_HEADERS"
      :rows="userLoginHistoriesResponse?.results ?? []"
      :total-rows="userLoginHistoriesResponse?.total ?? 0"
      :description="description"
      show-header
      cy="user-login-histories"
      @update-params="handleUpdateLoginHistoryTableParams"
    >
      <template #date="{ row }">
        <m-m-text-ellipsis max-width="200px">
          <m-m-formatted-date :raw-date="row.date" format="D MMM YYYY, HH:mm" />
        </m-m-text-ellipsis>
      </template>
      <template #url="{ row }">
        <m-m-text-ellipsis max-width="200px"
          >{{ row.oauth_client?.url }}
        </m-m-text-ellipsis>
      </template>
      <template #login_outcome="{ row }">
        <m-m-text-ellipsis max-width="200px"
          ><m-m-badge
            :text="HISTORY_LOGIN_OUTCOME_MAP[row.login_outcome ?? 'F']"
            :status="getOutcomeStatus(row.login_outcome).badgeType"
            indicator
          >
            <m-m-tooltip max-width="212px" display-position="toRight">
              {{
                getOutcomeStatus(row.login_outcome as string).toolTipTextContent
              }}
            </m-m-tooltip>
          </m-m-badge>
        </m-m-text-ellipsis>
      </template>
      <template #login_access="{ row }">
        <m-m-text-ellipsis max-width="200px"
          ><m-m-badge
            :text="HISTORY_LOGIN_ACCESS_MAP[row.login_access ?? 'F']"
            :status="getAccessStatus(row.login_access as string).badgeType"
            indicator
          >
            <m-m-tooltip max-width="212px" display-position="toRight">
              {{
                getAccessStatus(row.login_access as string).toolTipTextContent
              }}
            </m-m-tooltip>
          </m-m-badge>
        </m-m-text-ellipsis>
      </template>
      <template #organization="{ row }">
        <m-m-text-ellipsis max-width="200px"
          >{{ row.organization?.name }}
        </m-m-text-ellipsis>
      </template>
      <template #ip_address="{ row }">
        <m-m-text-ellipsis max-width="200px"
          >{{ row.ip_address }}
        </m-m-text-ellipsis>
      </template>
    </m-m-table>
  </div>
</template>

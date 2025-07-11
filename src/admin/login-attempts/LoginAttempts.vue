<script setup lang="ts">
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { onMounted, ref, Ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { LoginAttemptRead } from "~/iam/iam.types";
import { loginAttemptsService } from "~/admin/login-attempts/login-attempts.service";
import {
  LoginOutcome,
  LoginSource,
} from "~/admin/login-attempts/login-attempts.types";

const headers: TableHeader[] = [
  {
    key: "date",
    label: "Attempted On",
    sortable: true,
    order: "desc",
    sortIcon: true,
    sortName: "attempt_date",
  },
  {
    key: "ip_address",
    label: "IP Address",
  },
  {
    key: "user",
    label: "User",
  },
  {
    key: "application",
    label: "Application",
  },
  {
    key: "source",
    label: "Source",
  },
  {
    key: "outcome",
    label: "Outcome",
  },
  {
    key: "login_access",
    label: "Access",
  },
];

const isLoading: Ref<boolean> = ref(false);
const loginAttempts: Ref<TableResponse<LoginAttemptRead> | null> = ref(null);

const getLoginAttempts = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    loginAttempts.value = await loginAttemptsService.getLoginAttempts(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting login attempts",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getLoginAttempts();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_login_attempts"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="loginAttempts?.results"
      :total-rows="loginAttempts?.total"
      show-search
      cy="table-login-attempts"
      @update-params="getLoginAttempts"
    >
      <template #date="{ row }">
        <m-m-formatted-date :raw-date="row.date" format="D MMM YYYY, HH:mm" />
      </template>
      <template #user="{ row }">
        {{ row.user?.name }}
      </template>
      <template #application="{ row }">
        {{ row.oauth_client?.name }}
      </template>
      <template #source="{ row }">
        {{ LoginSource[row.login_source] }}
      </template>
      <template #outcome="{ row }">
        {{ LoginOutcome[row.login_outcome] }}
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>

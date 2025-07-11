<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import {
  auditEventsService,
  GetAuditEventsRequest,
} from "~/audit-events/audit-events.service";
import { authService } from "~/auth/auth.service";
import { eventsService } from "~/events/events.service";
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import { EventRead } from "~/events/events.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { UserProfileMM } from "~/auth/auth.types";
import { AuditEventRead } from "~/audit-events/audit-events.types";
import useActiveTab from "~/mm_ui_kit/src/composables/activeTabIndexBasedOnURL";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

import AuditLog from "./Tabs/AuditLog/Index.vue";
import EventLog from "./Tabs/EventLog/Index.vue";
import AccessLog from "./Tabs/AccessLog/Index.vue";
import {
  accessEvaluationsService,
  TypeAccessEvaluationsParams,
} from "~/access-logs/access-logs.service";
import { AccessEvaluationBaseRead } from "~/iam/iam.types";

const isLoading: Ref<boolean> = ref(true);
const events: Ref<TableResponse<EventRead>> = ref(null);
const auditEvents: Ref<TableResponse<AuditEventRead>> = ref(null);
const accessLogs: Ref<TableResponse<AccessEvaluationBaseRead>> = ref(null);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const organization_id: Ref<string> = ref("");

const TABS: TypeTab[] = [
  { label: "Event Log", name: "Event Log", isRequired: false },
  { label: "Audit Log", name: "Audit Log", isRequired: false },
  {
    label: "Access Log",
    name: "Access Log",
    isRequired: false,
  },
];

const activeTab = useActiveTab(TABS[0].name);

const getUser = async () => {
  userProfile.value = await authService.getProfile();
};

const getEventLog = async (params: TableRequestParams) => {
  try {
    isLoading.value = true;
    const getAuditEventsRequest = {
      ...params,
      organization_id: organization_id.value,
    };
    events.value = await eventsService.getEvents(getAuditEventsRequest);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching event log",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const getAuditLog = async (params: GetAuditEventsRequest) => {
  try {
    isLoading.value = true;
    const getAuditEventsRequest = {
      ...params,
      organization_id: organization_id.value,
    };
    auditEvents.value = await auditEventsService.getAuditEvents(
      getAuditEventsRequest,
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching audit events",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const getAccessEvaluations = async (params: TypeAccessEvaluationsParams) => {
  try {
    isLoading.value = true;
    accessLogs.value = await accessEvaluationsService.getAccessEvaluations({
      organization_id: organization_id.value,
      ...params,
    });
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching access logs",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const updateTabEvents = async (params: TableRequestParams) => {
  activeTab.value = TABS[0].name;
  await getEventLog({ ...params });
};

const updateTabAudits = async (params: TableRequestParams) => {
  activeTab.value = TABS[1].name;
  await getAuditLog({ ...params });
};

const updateTabAccessLogs = async (params: TableRequestParams) => {
  activeTab.value = TABS[2].name;
  await getAccessEvaluations({ ...params });
};

onMounted(async () => {
  await getUser();
  organization_id.value = userProfile.value?.org || "";
});
</script>

<template>
  <m-m-overview-page resource-id="logs" :show-config-banner="false">
    <m-m-teleport to="common-page-layout-header-tabs">
      <m-m-tabs v-model="activeTab" :items="TABS" />
    </m-m-teleport>
    <m-m-tab-items v-if="organization_id" :current-tab="activeTab">
      <m-m-tab-item :name="TABS[0].name">
        <event-log
          :events="events"
          :is-loading="isLoading"
          @update="updateTabEvents"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[1].name">
        <audit-log
          :audit-events="auditEvents"
          :is-loading="isLoading"
          @update="updateTabAudits"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[2].name">
        <access-log
          :access-logs="accessLogs"
          :is-loading="isLoading"
          @update="updateTabAccessLogs"
        />
      </m-m-tab-item> </m-m-tab-items
  ></m-m-overview-page>
</template>

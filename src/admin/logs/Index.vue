<script setup lang="ts">
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import useActiveTab from "~/mm_ui_kit/src/composables/activeTabIndexBasedOnURL";
import EventLog from "~/logs/OrganizationLogs/Tabs/EventLog/Index.vue";
import { ref, Ref } from "vue";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { EventRead } from "~/events/events.types";
import { eventsService } from "~/events/events.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import AccessLog from "~/logs/OrganizationLogs/Tabs/AccessLog/Index.vue";
import AuditLog from "~/logs/OrganizationLogs/Tabs/AuditLog/Index.vue";
import { AuditEventRead } from "~/audit-events/audit-events.types";
import { AccessEvaluationBaseRead } from "~/iam/iam.types";
import {
  auditEventsService,
  GetAuditEventsRequest,
} from "~/audit-events/audit-events.service";
import {
  accessEvaluationsService,
  TypeAccessEvaluationsParams,
} from "~/access-logs/access-logs.service";

const TABS: TypeTab[] = [
  { label: "Event Log", name: "Event Log", isRequired: false },
  { label: "Audit Log", name: "Audit Log", isRequired: false },
  { label: "Access Log", name: "Access Log", isRequired: false },
];

const activeTab = useActiveTab(TABS[0].name);

const isLoading: Ref<boolean> = ref(true);
const events: Ref<TableResponse<EventRead>> = ref(null);
const auditEvents: Ref<TableResponse<AuditEventRead>> = ref(null);
const accessEvaluations: Ref<TableResponse<AccessEvaluationBaseRead>> =
  ref(null);

const getEvents = async (params: TableRequestParams) => {
  try {
    isLoading.value = true;
    const getEventsRequest = {
      ...params,
    };
    events.value = await eventsService.getEvents(getEventsRequest);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching event log",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const getAuditEvents = async (params: GetAuditEventsRequest) => {
  try {
    isLoading.value = true;
    const getAuditEventsRequest = {
      ...params,
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
    accessEvaluations.value =
      await accessEvaluationsService.getAccessEvaluations({
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
  await getEvents({ ...params });
};

const updateTabAuditEvents = async (params: TableRequestParams) => {
  activeTab.value = TABS[1].name;
  await getAuditEvents({ ...params });
};

const updateTabAccessEvaluations = async (params: TableRequestParams) => {
  activeTab.value = TABS[2].name;
  await getAccessEvaluations({ ...params });
};
</script>

<template>
  <m-m-overview-page resource-id="admin_logs" :show-config-banner="false">
    <m-m-teleport to="common-page-layout-header-tabs">
      <m-m-tabs v-model="activeTab" :items="TABS" />
    </m-m-teleport>
    <m-m-tab-items :current-tab="activeTab">
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
          @update="updateTabAuditEvents"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[2].name">
        <access-log
          :access-logs="accessEvaluations"
          :is-loading="isLoading"
          @update="updateTabAccessEvaluations"
        />
      </m-m-tab-item>
    </m-m-tab-items>
  </m-m-overview-page>
</template>

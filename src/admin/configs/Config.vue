<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import { ConfigExtendedRead } from "~/configuration/configuration.types";
import { useRoute } from "vue-router";
import { TableHeader } from "~/mm_ui_kit/src/types/table.types";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";
import { configsService } from "~/admin/configs/configs.service";

const isLoading: Ref<boolean> = ref(true);
const config: Ref<ConfigExtendedRead | null> = ref(null);

const route = useRoute();
const configId = route.params.config_id as string;

const configDetails = computed((): TypeDataIteratorItem[] => {
  return [
    {
      label: "Status",
      text: config.value?.status || "",
      isEmpty: !config.value?.status,
    },
    {
      label: "Created On",
      text: config.value?.created_date || "",
      isEmpty: !config.value?.created_date,
    },
    {
      label: "Status Updated On",
      text: config.value?.status_updated_date || "",
      isEmpty: !config.value?.status_updated_date,
    },
    {
      label: "Service Provider",
      text: config.value?.service_provider.name || "",
      to: `/sc/organizations/${config.value?.service_provider.id}`,
      isEmpty: !config.value?.service_provider,
    },
  ];
});

const changesHeaders: TableHeader[] = [
  {
    key: "action",
    label: "Action",
  },
  {
    key: "object_type_external",
    label: "Object Name",
  },
  {
    key: "object_id",
    label: "Object ID",
  },
  {
    key: "changed_attributes",
    label: "Changed Attributes",
  },
];

const servicesHeaders: TableHeader[] = [
  {
    key: "service",
    label: "Service",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "ping_date",
    label: "Ping",
  },
  {
    key: "pong_date",
    label: "Pong",
  },
  {
    key: "error",
    label: "Error",
  },
];

onMounted(async () => {
  config.value = await configsService.getConfig(configId);
  isLoading.value = false;
});
</script>

<template>
  <template v-if="config">
    <m-m-teleport to="common-page-layout-header-title">
      Config {{ config.id }}
    </m-m-teleport>
    <m-m-data-iterator :data="configDetails" :columns="2" />
    <m-m-divider class="mm-my-12" />
    <h2 class="mm-page-title mm-page-title--h2">Changes</h2>
    <div class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8">
      This config has
      <span class="mm-fw-700">{{ config.changes.length }}</span> Changes
    </div>
    <m-m-table
      :is-loading="isLoading"
      :headers="changesHeaders"
      :rows="config.changes"
      :total-rows="config.changes.length"
      cy="table-section-changes"
      @update-params="config.changes"
    />
    <m-m-divider class="mm-my-12" />
    <h2 class="mm-page-title mm-page-title--h2">Services</h2>
    <div class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8">
      This config has
      <span class="mm-fw-700">{{ config.services.length }}</span> Services
    </div>
    <m-m-table
      :is-loading="isLoading"
      :headers="servicesHeaders"
      :rows="config.services"
      :total-rows="config.services.length"
      cy="table-services-changes"
      @update-params="config.services"
    />
  </template>
</template>

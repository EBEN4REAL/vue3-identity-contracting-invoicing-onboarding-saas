<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import { WizardExtendedRead } from "~/configuration/configuration.types";
import { useRoute } from "vue-router";
import { wizardsService } from "~/admin/wizards/wizards.service";
import { TableHeader } from "~/mm_ui_kit/src/types/table.types";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";

const isLoading: Ref<boolean> = ref(true);
const wizard: Ref<WizardExtendedRead | null> = ref(null);

const route = useRoute();
const wizardId = route.params.wizard_id as string;

const wizardDetails = computed((): TypeDataIteratorItem[] => {
  return [
    {
      label: "Type",
      text: wizard.value?.type.name || "",
      to: `/sc/admin/wizard-types/${wizard.value?.type.id}`,
      isEmpty: !wizard.value?.type,
    },
    {
      label: "Service Provider",
      text: wizard.value?.service_provider.name || "",
      to: `/sc/organizations/${wizard.value?.service_provider.id}`,
      isEmpty: !wizard.value?.service_provider,
    },
  ];
});

const sectionHeaders: TableHeader[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "sync_status",
    label: "Sync Status",
  },
  {
    key: "publish_status",
    label: "Publish Status",
  },
];

onMounted(async () => {
  wizard.value = await wizardsService.getWizard(wizardId);
  isLoading.value = false;
});
</script>

<template>
  <template v-if="wizard">
    <m-m-teleport to="common-page-layout-header-title">{{
      wizard.name
    }}</m-m-teleport>
    <m-m-teleport to="common-page-layout-header-subtitle">{{
      wizard.description
    }}</m-m-teleport>
    <m-m-data-iterator :data="wizardDetails" :columns="2" />
    <m-m-divider class="mm-my-12" />
    <h2 class="mm-page-title mm-page-title--h2">Sections</h2>
    <div class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8">
      This wizard has
      <span class="mm-fw-700">{{ wizard.sections.length }}</span> Sections
    </div>
    <m-m-table
      :is-loading="isLoading"
      :headers="sectionHeaders"
      :rows="wizard.sections"
      :total-rows="wizard.sections.length"
      cy="table-wizard-sections"
      @update-params="wizard.sections"
    >
      <template #type="{ row }">{{ row.type.name }}</template>
    </m-m-table>
  </template>
</template>

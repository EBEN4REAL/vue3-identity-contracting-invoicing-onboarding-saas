<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";
import { OAuthClientRead } from "~/admin/applications/applications.types";
import { applicationsService } from "~/admin/applications/applications.service";

const isLoading: Ref<boolean> = ref(true);
const application: Ref<OAuthClientRead | null> = ref(null);

const route = useRoute();
const applicationId = route.params.application_id as string;

const applicationDetails = computed((): TypeDataIteratorItem[] => {
  return [
    {
      label: "Service Provider",
      text: application.value?.service_provider.name || "",
      to: `/sc/organizations/${application.value?.service_provider.id}`,
      isEmpty: !application.value?.service_provider,
    },
  ];
});

const getApplication = async () => {
  application.value = await applicationsService.getApplication(applicationId);
  isLoading.value = false;
};

onMounted(async () => {
  await getApplication();
});
</script>

<template>
  <template v-if="application">
    <m-m-teleport to="common-page-layout-header-title">
      {{ application.name }}
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-subtitle">
      {{ application.description }}
    </m-m-teleport>
    <m-m-data-iterator :data="applicationDetails" :columns="2" />
  </template>
</template>

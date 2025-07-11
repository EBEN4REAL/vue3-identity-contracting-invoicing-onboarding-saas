<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { SectionTypeExtendedRead } from "~/configuration/configuration.types";
import { useRoute } from "vue-router";
import { sectionTypesService } from "~/admin/section-types/section-types.service";

const sectionType: Ref<SectionTypeExtendedRead | null> = ref(null);

const route = useRoute();
const sectionTypeId = route.params.section_type_id as string;

onMounted(async () => {
  sectionType.value = await sectionTypesService.getSectionType(sectionTypeId);
});
</script>

<template>
  <template v-if="sectionType">
    <m-m-teleport to="common-page-layout-header-title"
      >{{ sectionType.name }}
    </m-m-teleport>
    <m-m-teleport to="common-page-layout-header-subtitle"
      >There are {{ sectionType.sections_count }} instances of this Section Type
    </m-m-teleport>
  </template>
</template>

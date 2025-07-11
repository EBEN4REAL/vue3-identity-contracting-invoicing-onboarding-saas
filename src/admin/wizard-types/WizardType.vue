<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { WizardTypeExtendedRead } from "~/configuration/configuration.types";
import { wizardTypesService } from "~/admin/wizard-types/wizard-types.service";
import { useRoute } from "vue-router";

const wizardType: Ref<WizardTypeExtendedRead | null> = ref(null);

const route = useRoute();
const wizardTypeId = route.params.wizard_type_id as string;

onMounted(async () => {
  wizardType.value = await wizardTypesService.getWizardType(wizardTypeId);
});
</script>

<template>
  <template v-if="wizardType">
    <m-m-teleport to="common-page-layout-header-title">{{
      wizardType.name
    }}</m-m-teleport>
    <m-m-teleport to="common-page-layout-header-subtitle"
      >There are {{ wizardType.wizards_count }} instances of this Wizard Type
    </m-m-teleport>
  </template>
</template>

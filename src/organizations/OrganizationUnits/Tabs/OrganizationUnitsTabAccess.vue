<script setup lang="ts">
import { PropType } from "vue";
import { OrganizationUnitRead } from "~/iam/iam.types";
import OrganizationUnitsTabLicenses from "./OrganizationUnitsTabLicenses.vue";
import OrganizationUnitsTabSubscriptions from "./OrganizationUnitsTabSubscriptions.vue";
import { useFlag } from "@unleash/proxy-client-vue";

const isSubscriptionsEnabled = useFlag("org_subscriptions");
const orgLicensesEnabled = useFlag("org_licenses");

defineProps({
  unit: {
    type: Object as PropType<OrganizationUnitRead>,
    default: () => ({}),
    required: true,
  },
  organizationId: { type: String, default: "" },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <organization-units-tab-licenses
    v-if="orgLicensesEnabled"
    :unit="unit"
    :organization-id="organizationId"
    :is-s-c-viewer-only="isSCViewerOnly"
  />
  <m-m-divider class="mm-mt-20 mm-mb-10" />
  <organization-units-tab-subscriptions
    v-if="isSubscriptionsEnabled"
    :unit="unit"
    :is-s-c-viewer-only="isSCViewerOnly"
    :organization-id="organizationId"
  />
</template>

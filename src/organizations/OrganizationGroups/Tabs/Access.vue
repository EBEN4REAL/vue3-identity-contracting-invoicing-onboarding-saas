<script setup lang="ts">
import { PropType } from "vue";
import { OrganizationGroupRead } from "~/iam/iam.types";
import Licenses from "./Licenses.vue";
import SubscriptionAgreements from "./SubscriptionAgreements.vue";
import { useFlag } from "@unleash/proxy-client-vue";

const isSubscriptionsEnabled = useFlag("org_subscriptions");
const orgLicensesEnabled = useFlag("org_licenses");
defineProps({
  group: {
    type: Object as PropType<OrganizationGroupRead>,
    required: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <licenses
    v-if="orgLicensesEnabled"
    :is-s-c-viewer-only="isSCViewerOnly"
    :group="group"
  />
  <m-m-divider class="mm-mt-20 mm-mb-10" />
  <subscription-agreements
    v-if="isSubscriptionsEnabled"
    :is-s-c-viewer-only="isSCViewerOnly"
    :group="group"
  />
</template>

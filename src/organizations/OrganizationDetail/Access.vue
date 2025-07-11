<script setup lang="ts">
import { PropType } from "vue";
import { OrganizationRead } from "~/iam/iam.types";
import Licenses from "./Licenses.vue";
import Policies from "./Policies.vue";
import SubscriptionAgreements from "./SubscriptionAgreements.vue";
import { useFlag } from "@unleash/proxy-client-vue";
import { useUiStore } from "~/stores/useUiStore";

const uiStore = useUiStore();

const isSubscriptionsEnabled = useFlag("org_subscriptions");
const orgLicensesEnabled = useFlag("org_licenses");
defineProps({
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
  },
});
</script>
<template>
  <policies :organization="organization" />
  <m-m-divider class="mm-mt-20 mm-mb-10" />
  <licenses
    v-if="orgLicensesEnabled"
    :is-s-c-viewer-only="uiStore.isSCViewerOnly"
    :organization="organization"
  />
  <m-m-divider class="mm-mt-20 mm-mb-10" />
  <subscription-agreements
    v-if="isSubscriptionsEnabled"
    :is-s-c-viewer-only="uiStore.isSCViewerOnly"
    :organization="organization"
  />
</template>

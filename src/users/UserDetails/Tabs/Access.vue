<script setup lang="ts">
import ComponentUserPolicies from "./Policies.vue";
import ComponentUserLicenses from "./Licenses.vue";
import { PropType } from "vue";
import { OrganizationUserRead } from "~/iam/iam.types";
import { PolicyReadWithOwnerName } from "~/policies/policies.types";
import SubscriptionAgreements from "./SubscriptionAgreements.vue";
import { useFlag } from "@unleash/proxy-client-vue";

const isSubscriptionsEnabled = useFlag("org_subscriptions");
const orgLicensesEnabled = useFlag("org_licenses");
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  policies: {
    type: Array as PropType<PolicyReadWithOwnerName[]>,
    default: () => null,
  },
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: () => ({}),
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update-policies"]);
</script>

<template>
  <component-user-policies
    v-if="policies"
    :is-loading="isLoading"
    :policies="policies"
    :user="user"
    @update-policies="emit('update-policies')"
  />
  <m-m-divider class="mm-mt-20 mm-mb-10" />
  <component-user-licenses
    v-if="orgLicensesEnabled"
    :user="user"
    :is-s-c-viewer-only="isSCViewerOnly"
  />
  <m-m-divider class="mm-mt-20 mm-mb-10" />
  <subscription-agreements
    v-if="isSubscriptionsEnabled"
    :user="user"
    :is-s-c-viewer-only="isSCViewerOnly"
  />
</template>

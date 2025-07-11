<script setup lang="ts">
import { onMounted, Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { organizationsService } from "~/organizations/organizations.service";
import { billingAndInvoicingService } from "~/billing_and_invoicing/billing_and_invoicing.service";
import { OrganizationReadWithAttributes } from "~/iam/iam.types";
import OrganizationDetails from "./Details.vue";
import SubOrganizations from "./SubOrganizations.vue";
import Access from "./Access.vue";
import Consents from "./Consents.vue";
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import { BillingAddressRead } from "~/billing_and_invoicing/billing_and_invoicing.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { useFlag } from "@unleash/proxy-client-vue";
import useActiveTab from "~/mm_ui_kit/src/composables/activeTabIndexBasedOnURL";

const route = useRoute();
const billingAddressEnabled = useFlag("billing_and_invoicing");
const consentsOrganizationEnabled = useFlag("consents_organization");
const TABS: TypeTab[] = [
  { label: "Basic information", name: "Basic information", isRequired: false },
  { label: "Sub-organizations", name: "Sub-organizations", isRequired: false },
  { label: "Access", name: "Access", isRequired: false },
  {
    label: "Consents",
    name: "Consents",
    isRequired: false,
    isHidden: !consentsOrganizationEnabled.value,
  },
];
const tabActive = useActiveTab(TABS[0].name);
const isLoading: Ref<boolean> = ref(true);
const organization: Ref<OrganizationReadWithAttributes | null> = ref(null);
const billing_address: Ref<BillingAddressRead | null> = ref(null);
const organizationName: Ref<string> = ref("");
const getOrganizationDetails = async (orgId: string) => {
  if (orgId) {
    organization.value = await organizationsService.getOrganization(
      orgId.toString(),
    );

    organizationName.value =
      organization.value?.name || "Organization doesn't exist";
  }
};
const getBillingAddress = async (orgId: string) => {
  try {
    if (orgId) {
      billing_address.value =
        await billingAndInvoicingService.getBillingAddress(orgId);
    }
  } catch (error) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status !== 404) {
      eventBus.$emit("onShowToast", {
        text: "Error fetching billing address",
        status: "error",
      });
    }
  }
};

const fetchInitialData = async (orgId: string) => {
  try {
    isLoading.value = true;

    const fetchPromises = [getOrganizationDetails(orgId)];

    if (billingAddressEnabled.value) {
      fetchPromises.push(getBillingAddress(orgId));
    }

    await Promise.all(fetchPromises);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const orgId = route.params.org_id.toString();
  await fetchInitialData(orgId);
});

// watch org_id change
watch(
  () => route.params.org_id.toString(),
  (orgId) => {
    getOrganizationDetails(orgId);
  },
);
</script>

<template>
  <m-m-overview-page
    resource-id="organization"
    :show-config-banner="false"
    :params="{ organizationName }"
  />
  <div data-cy="organization-page-main">
    <m-m-teleport to="common-page-layout-header-tabs">
      <m-m-tabs
        v-if="organization"
        v-model="tabActive"
        :items="TABS"
        cy="organization-tabs"
      />
    </m-m-teleport>
    <template v-if="!isLoading">
      <m-m-tab-items v-if="organization" :current-tab="tabActive">
        <m-m-tab-item keep-alive :name="TABS[0].name">
          <organization-details
            :organization="organization"
            :billing-address="billing_address"
            @update="fetchInitialData"
          />
        </m-m-tab-item>
        <m-m-tab-item keep-alive :name="TABS[1].name">
          <sub-organizations :organization="organization" />
        </m-m-tab-item>
        <m-m-tab-item keep-alive :name="TABS[2].name">
          <access :organization="organization" />
        </m-m-tab-item>
        <m-m-tab-item :name="TABS[3].name">
          <consents />
        </m-m-tab-item>
      </m-m-tab-items>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.organization-page {
  &-header {
    padding: 64px 32px 0;
    background: linear-gradient(
      180deg,
      rgba(7, 46, 81, 0) 0%,
      rgba(7, 46, 81, 0.07) 100%
    );

    &-info {
      display: flex;
      align-items: center;
      padding-bottom: 32px;
    }
  }

  .header {
    &-info {
      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        margin-right: 12px;
        border-radius: 8px;
        background: #072e511a;

        img {
          width: 20px;
          height: 20px;
        }
      }

      &-title {
        display: flex;
        align-items: center;
      }

      &-name {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: 0;
        margin-right: 8px;
      }

      &-subtitle {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
      }
    }
  }

  .main {
    &-header {
      display: flex;
      margin-bottom: 16px;
    }
  }
}
</style>

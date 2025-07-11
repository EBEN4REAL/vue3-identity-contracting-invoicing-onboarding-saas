<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import { UserAccess } from "~/iam/iam.types";
import { usersService } from "../users.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { policiesService } from "~/service-providers/policies.service";
import { PoliciesUserAccess } from "~/policies/policies.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { useFlag } from "@unleash/proxy-client-vue";

const orgLicensesEnabled = useFlag("org_licenses");
const userAccess: Ref<UserAccess | null> = ref(null);
const userAccessDetails: Ref<PoliciesUserAccess[] | null> = ref([]);
const loading: Ref<boolean> = ref(true);

const getUserAccess = async () => {
  try {
    userAccess.value = await usersService.getUserAccess();
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting user access details",
      status: "error",
    });
  }
};

const getUserAccessDetails = async () => {
  if (!userAccess.value) {
    return;
  }

  try {
    loading.value = true;
    const details = await Promise.all(
      userAccess.value.user_access.map((access) =>
        policiesService.getUserAccess(
          access.organization_id,
          access.organization_user_id,
        ),
      ),
    );
    userAccessDetails.value = details;
  } finally {
    loading.value = false;
  }
};

const getLogoFromDetails = (
  serviceProviderId: string,
  detail: PoliciesUserAccess,
) => {
  const logo = detail.service_provider_logos?.find(
    (logo) => logo.service_provider_id === serviceProviderId,
  );
  return logo ? logo.logo_url : "";
};

const flatSubscriptions = computed(() => {
  if (!userAccessDetails.value) {
    return [];
  }
  return userAccessDetails.value.flatMap((detail) =>
    (detail.subscriptions || []).map((subscription) => {
      const logoUrl = getLogoFromDetails(
        subscription.service_provider_id,
        detail,
      );
      return {
        ...subscription,
        organization_name: detail.organization_name,
        organization_logo_url: logoUrl || "",
      };
    }),
  );
});

const flatLicenses = computed(() => {
  if (!userAccessDetails.value) {
    return [];
  }
  return userAccessDetails.value.flatMap((detail) =>
    (detail.access_licenses || []).map((license) => {
      const logoUrl = getLogoFromDetails(license.service_provider_id, detail);
      return {
        ...license,
        organization_name: detail.organization_name,
        organization_logo_url: logoUrl || "",
      };
    }),
  );
});

const flatPolicies = computed(() => {
  if (!userAccessDetails.value) {
    return [];
  }
  return userAccessDetails.value.flatMap((detail) =>
    (detail.policies || []).map((policy) => {
      const logoUrl = getLogoFromDetails(policy.service_provider_id, detail);
      return {
        ...policy,
        organization_name: detail.organization_name,
        organization_logo_url: logoUrl || "",
      };
    }),
  );
});

onMounted(async () => {
  loading.value = true;
  await getUserAccess();
  await getUserAccessDetails();
  loading.value = false;
});
</script>
<template>
  <m-m-overview-page resource-id="my_access" :show-config-banner="false" />
  <div>
    <div>
      <div v-if="loading"><m-m-skeleton-loader /></div>
      <div v-else>
        <div class="mm-page-title mm-page-title--h2 mm-mb-6">Subscriptions</div>
        <div
          v-sanitize-html="$t('my_access.subscriptions.subtitle')"
          class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8"
        ></div>
        <div
          v-if="flatSubscriptions.length"
          class="mm-flex mm-flex-row mm-flex-gap-10 mm-flex-wrap"
        >
          <MMAccessCard
            v-for="(detail, index) in flatSubscriptions"
            :key="index"
            :detail-name="detail.agreement_type_name"
            :detail-description="detail.agreement_type_description"
            :service-provider-name="detail.service_provider_name"
            :organization-name="detail.organization_name"
            :detail-logo="detail.organization_logo_url"
          />
        </div>
        <div v-else>
          <MMAccessCard
            :detail-icon="sectionIcons['licenses']"
            no-results-message="No subscriptions available"
          />
        </div>
        <div v-if="orgLicensesEnabled" class="mm-mt-10">
          <div class="mm-page-title mm-page-title--h2 mm-mb-6">
            Access Licenses
          </div>
          <div
            v-sanitize-html="$t('my_access.access_licenses.subtitle')"
            class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8"
          ></div>
          <div
            v-if="flatLicenses.length"
            class="mm-flex mm-flex-row mm-flex-gap-10 mm-flex-wrap"
          >
            <MMAccessCard
              v-for="(license, index) in flatLicenses"
              :key="index"
              :detail-name="license.agreement_type_name"
              :detail-description="license.agreement_type_description"
              :service-provider-name="license.service_provider_name"
              :organization-name="license.organization_name"
              :detail-logo="license.organization_logo_url"
            />
          </div>
          <div v-else>
            <MMAccessCard
              :detail-icon="sectionIcons['accessLicense']"
              no-results-message="No access licenses available"
            />
          </div>
        </div>
        <div class="mm-mt-10">
          <div class="mm-page-title mm-page-title--h2 mm-mb-6">Policies</div>
          <div
            v-sanitize-html="$t('my_access.policies.subtitle')"
            class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8"
          ></div>
          <div
            v-if="flatPolicies.length"
            class="mm-flex mm-flex-row mm-flex-gap-10 mm-flex-wrap"
          >
            <MMAccessCard
              v-for="(policy, index) in flatPolicies"
              :key="index"
              :detail-name="policy.policy_type_name"
              :detail-description="policy.policy_type_description"
              :service-provider-name="policy.service_provider_name"
              :organization-name="policy.organization_name"
              :detail-logo="policy.organization_logo_url"
            />
          </div>
          <div v-else>
            <MMAccessCard
              :detail-icon="sectionIcons['policies']"
              no-results-message="No policies available"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>

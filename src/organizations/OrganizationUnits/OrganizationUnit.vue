<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import { authService } from "~/auth/auth.service";
import { OrganizationUnitRead } from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const organizationUnits: Ref<OrganizationUnitRead[] | null> = ref(null);

const firstUnitIdInList = computed(
  () => organizationUnits.value?.[0]?.id ?? null,
);

const handleRedirects = () => {
  if (!organizationUnits.value?.length) {
    // Redirect to empty units page if there are no units
    router.replace({
      name: "OrganizationUnitsEmpty",
    });
  } else if (organizationUnits.value && !route.params.unitId) {
    // Redirect to first unit in list if user tries to navigate to empty units page manually
    router.replace({
      name: "OrganizationUnitDetails",
      params: {
        unitId: firstUnitIdInList.value,
      },
    });
  }
};

onMounted(async () => {
  const profile = await authService.getProfile();
  if (profile?.org) {
    organizationUnits.value = await organizationsService.getOrganizationUnits(
      profile.org,
    );

    handleRedirects();
  }
});
</script>

<template><div></div></template>

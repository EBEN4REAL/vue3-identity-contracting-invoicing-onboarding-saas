<script setup lang="ts">
import { onMounted, Ref, ref, computed } from "vue";
import { OrganizationRead, OrganizationUnitRead } from "~/iam/iam.types";
import { authService } from "~/auth/auth.service";
import { organizationsService } from "~/organizations/organizations.service";
import { useRouter } from "vue-router";
import OrganizationUnitDialogCreate from "./Dialogs/OrganizationUnitDialogCreate.vue";
import { useUiStore } from "~/stores/useUiStore";

const uiStore = useUiStore();
const router = useRouter();

const organization: Ref<OrganizationRead | null> = ref(null);
const isCreateOrganizationUnitDialogOpen = ref(false);
const isPageReadyForRender = ref(false);

const onCreateOrganizationUnit = async (unit: OrganizationUnitRead) => {
  await router.replace({
    name: "OrganizationUnitDetails",
    params: {
      unitId: unit.id,
    },
  });
};

const fetchOrganization = async (
  organizationId: string,
): Promise<OrganizationRead> => {
  return await organizationsService.getOrganization(organizationId);
};

const onOpenCreateOrganizationUnitDialog = () => {
  isCreateOrganizationUnitDialogOpen.value = true;
};

const onCloseCreateOrganizationUnitDialog = () => {
  isCreateOrganizationUnitDialogOpen.value = false;
};

const units = computed(() => [
  {
    parent_organization_unit_id: null,
    name: organization.value?.name || "",
    description: null,
    id: organization.value?.id || "",
    users: null,
  },
]);

onMounted(async () => {
  const profile = await authService.getProfile();
  if (profile?.org) {
    const organizationUnits = await organizationsService.getOrganizationUnits(
      profile.org,
    );
    if (organizationUnits.length)
      await onCreateOrganizationUnit(organizationUnits[0]);
    else organization.value = await fetchOrganization(profile.org);
  }
  isPageReadyForRender.value = true;
});
</script>

<template>
  <div
    v-if="isPageReadyForRender"
    class="mm-flex mm-flex-justify-center mm-flex-align-center mm-flex-column mm-w-10 mm-h-10"
  >
    <div
      class="icon-wrapper mm-flex mm-flex-justify-center mm-flex-align-center mm-mb-12"
    >
      <m-m-icon icon="building-office" height="30px" />
    </div>
    <div class="mm-page-title mm-page-title--h2">
      You don’t have any organizational unit
    </div>
    <div class="mm-page-subtitle mm-page-subtitle--h1">
      Get started by creating a new one.
    </div>
    <m-m-button
      size="small"
      class="mm-mt-12"
      @click="onOpenCreateOrganizationUnitDialog"
    >
      Create organizational unit
    </m-m-button>
    <!-- :is-disabled="uiStore.isSCViewerOnly" -->
  </div>
  <organization-unit-dialog-create
    v-if="organization?.id"
    :is-s-c-viewer-only="uiStore.isSCViewerOnly"
    :is-open="isCreateOrganizationUnitDialogOpen"
    :organization-id="organization.id"
    :units="units"
    @create="onCreateOrganizationUnit"
    @close="onCloseCreateOrganizationUnitDialog"
  />
</template>

<style scoped lang="scss">
.icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: #f3f4f6;
}
</style>

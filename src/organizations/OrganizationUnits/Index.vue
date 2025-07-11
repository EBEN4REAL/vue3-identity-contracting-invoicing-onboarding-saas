<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, Ref, computed, ComputedRef, watch } from "vue";
import { authService } from "~/auth/auth.service";
import { organizationsService } from "~/organizations/organizations.service";
import {
  OrganizationRead,
  OrganizationUnitRead,
  OrganizationUnitReadWithUsers,
} from "~/iam/iam.types";
import { TypeOrganizationUnitsWithParent } from "~/organizations/OrganizationUnits/types";
import OrganizationUnitsTree from "./OrganizationUnitsTree.vue";
import OrganizationUnitsTabUsers from "./Tabs/OrganizationUnitsTabUsers.vue";
import OrganizationUnitsTabSettings from "./Tabs/OrganizationUnitsTabSettings.vue";
import OrganizationUnitDialogCreate from "~/organizations/OrganizationUnits/Dialogs/OrganizationUnitDialogCreate.vue";
import OrganizationUnitDialogDelete from "~/organizations/OrganizationUnits/Dialogs/OrganizationUnitDialogDelete.vue";
import OrganizationUnitsTabAccess from "./Tabs/OrganizationUnitsTabAccess.vue";
import { TypeTab } from "~/mm_ui_kit/src/types/types";
import type { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import useActiveTab from "~/mm_ui_kit/src/composables/activeTabIndexBasedOnURL";
import { useUiStore } from "~/stores/useUiStore";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";
import { useTranslation } from "i18next-vue";

const uiStore = useUiStore();
const route = useRoute();
const router = useRouter();

const organization: Ref<OrganizationRead | null> = ref(null);
const isSCEditor: Ref<boolean> = ref(false);
const organizationUnits: Ref<OrganizationUnitRead[] | null> = ref(null);
const organizationUnitActive: Ref<OrganizationUnitReadWithUsers | null> =
  ref(null);
const isLoading: Ref<boolean> = ref(true);
const TABS: TypeTab[] = [
  { label: "Basic information", name: "Basic information", isRequired: false },
  { label: "Users", name: "Users", isRequired: false },
  { label: "Access", name: "Access", isRequired: false },
];
const { t } = useTranslation();

const activeTab = useActiveTab(TABS[0].name);
const isCreateOrganizationUnitDialogOpen = ref(false);
const isDeleteOrganizationUnitDialogOpen = ref(false);

watch(
  () => route.params.unitId,
  async () => {
    await fetchAndSetActiveOrganizationUnit();
  },
);

const firstUnitIdInList = computed(
  () => organizationUnits.value?.[0]?.id ?? null,
);

const title: ComputedRef<string> = computed(() =>
  t(
    "org_units.org_unit_details.title",
    escapeObjectValuesForHtml({
      organizationUnitName: organizationUnitActive.value?.name || "",
    }),
  ),
);

const subtitle: ComputedRef<string> = computed(() =>
  t(
    "org_units.org_unit_details.subtitle",
    escapeObjectValuesForHtml({
      organizationUnitDescription:
        organizationUnitActive.value?.description || "",
    }),
  ),
);

const fetchAndSetActiveOrganizationUnit = async () => {
  isLoading.value = true;
  if (organization.value) {
    organizationUnitActive.value =
      await organizationsService.getOrganizationUnit(
        organization.value.id,
        `${route.params.unitId}`,
      );
  }
  isLoading.value = false;
};

const fetchOrganization = async (
  organizationId: string,
): Promise<OrganizationRead> => {
  isLoading.value = true;
  const response = await organizationsService.getOrganization(organizationId);
  isLoading.value = false;
  return response;
};

const fetchOrganizationUnits = async (
  organizationId: string,
): Promise<OrganizationUnitRead[]> => {
  isLoading.value = true;
  const response =
    await organizationsService.getOrganizationUnits(organizationId);
  isLoading.value = false;
  return response;
};

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

// Disable delete Unit button if unit has children units or unit has users or does not have the required permissions
const isDeleteOrgUnitInDropdownDisabled: ComputedRef<boolean> = computed(() =>
  Boolean(!organizationUnitActive.value?.deletable || !isSCEditor.value),
);

const deleteOrgUnitHintText = computed(() =>
  isDeleteOrgUnitInDropdownDisabled.value
    ? "You cannot delete this unit because it has sub-units or users or you do not have the required permissions"
    : null,
);

const onOpenCreateOrganizationUnitDialog = () => {
  isCreateOrganizationUnitDialogOpen.value = true;
};

const onCloseCreateOrganizationUnitDialog = () => {
  isCreateOrganizationUnitDialogOpen.value = false;
};

const onCreateOrganizationUnit = async (unit: OrganizationUnitRead) => {
  if (organizationUnits.value) organizationUnits.value.push(unit);
  await fetchAndSetActiveOrganizationUnit();
};

const onOpenDeleteOrganizationUnitDialog = () => {
  isDeleteOrganizationUnitDialogOpen.value = true;
};

const onCloseDeleteOrganizationUnitDialog = () => {
  isDeleteOrganizationUnitDialogOpen.value = false;
};

const onDeleteOrganizationUnit = async (unitId: string) => {
  if (organizationUnits.value) {
    // Filter out organization unit from list by unitId
    organizationUnits.value = organizationUnits.value?.filter(
      (unit: OrganizationUnitRead) => unit.id !== unitId,
    );
  }
  if (!organizationUnits.value?.length) {
    // If after deleting unit, there are no more units left - redirect user to the empty page
    await router.replace({
      name: "OrganizationUnitsEmpty",
    });
  } else {
    // In other case - find deleted unit...
    const unitFromList: OrganizationUnitRead | undefined =
      organizationUnits.value?.find(
        (unit: OrganizationUnitRead) => unit.id === unitId,
      );

    // ... and redirect to parent unit OR to the first unit in list
    await router.replace({
      name: "OrganizationUnitDetails",
      params: {
        unitId: unitFromList?.parent_organization_unit_id
          ? unitFromList?.parent_organization_unit_id
          : firstUnitIdInList.value,
      },
    });
  }
};

const handleClickDeleteOrgUnitInDropdown = () => {
  if (!isDeleteOrgUnitInDropdownDisabled.value) {
    onOpenDeleteOrganizationUnitDialog();
  }
};

const mainHeaderDropdownItems: ComputedRef<TypeDropdownItem[]> = computed(
  (): TypeDropdownItem[] => [
    {
      key: "delete-org-unit",
      label: "Delete Organizational Unit",
      hint: deleteOrgUnitHintText.value,
      isDisabled:
        isDeleteOrgUnitInDropdownDisabled.value || uiStore.isSCViewerOnly,
      type: "button",
      color: "error",
      onClick: handleClickDeleteOrgUnitInDropdown,
    },
  ],
);

// After user successfully edited unit
const onOrganizationUnitUpdate = async (
  updatedOrganizationUnitData: OrganizationUnitRead,
) => {
  if (organizationUnits.value) {
    // Find unit that has been edited
    const unitToUpdate: OrganizationUnitRead | null =
      organizationUnits.value.find(
        (organizationUnit: OrganizationUnitRead) =>
          organizationUnit.id === updatedOrganizationUnitData.id,
      ) || null;
    if (unitToUpdate && organizationUnitActive.value) {
      // Update units data with new data
      Object.assign(unitToUpdate, updatedOrganizationUnitData);
      Object.assign(organizationUnitActive.value, updatedOrganizationUnitData);
    }
  }
};

const getUserPermissions = async () => {
  isSCEditor.value = await authService.isUserOrgEditor();
};

onMounted(async () => {
  const profile = await authService.getProfile();
  if (profile?.org) {
    organization.value = await fetchOrganization(profile.org);
    organizationUnits.value = await fetchOrganizationUnits(profile.org);
    await fetchAndSetActiveOrganizationUnit();
    await getUserPermissions();
    handleRedirects();
  }
});

// This is helper function that needed to add level of deepness to each unit to make margins in <m-m-select>
const addLevel = (
  units: OrganizationUnitRead[],
  parent_organization_unit_id: string | null = null,
  level = 0,
): TypeOrganizationUnitsWithParent[] => {
  return units
    .map((unit) => {
      if (unit.parent_organization_unit_id === parent_organization_unit_id) {
        const newUnit = { ...unit, level };
        const children: TypeOrganizationUnitsWithParent[] = addLevel(
          units,
          unit.id,
          level + 1,
        );
        if (children.length > 0) {
          return [newUnit, ...children];
        } else {
          return newUnit;
        }
      }
      return [];
    })
    .flat()
    .filter(Boolean);
};

// Create list of organization units with levels
const organizationUnitsWithLevels: ComputedRef<
  TypeOrganizationUnitsWithParent[]
> = computed((): TypeOrganizationUnitsWithParent[] => {
  const organizationUnitWithParent: TypeOrganizationUnitsWithParent[] = [];

  organizationUnitWithParent.push({
    parent_organization_unit_id: organization.value?.id || "",
    name: organization.value?.name || "",
    description: null,
    id: organization.value?.id || "",
    level: 0,
  });

  if (organizationUnits.value && organization.value?.id) {
    return organizationUnitWithParent.concat(
      addLevel(organizationUnits.value, organization.value?.id, 1),
    );
  }

  return [];
});
</script>

<template>
  <template v-if="organizationUnits?.length">
    <m-m-teleport to="common-page-with-aside-layout-header-icon">
      <m-m-icon icon="building-office" width="16px" height="16px" />
    </m-m-teleport>
    <m-m-teleport to="common-page-with-aside-layout-header-title">
      <div v-sanitize-html="title" />
    </m-m-teleport>
    <m-m-teleport to="common-page-with-aside-layout-header-subtitle">
      <div v-sanitize-html="subtitle" />
    </m-m-teleport>
    <m-m-teleport to="common-page-with-aside-layout-header-controls">
      <m-m-dropdown
        :items="mainHeaderDropdownItems"
        list-variant="shadow"
        max-width="218px"
        cy="organization-unit-dropdown"
      />
    </m-m-teleport>
    <m-m-teleport to="common-page-with-aside-layout-header-tabs">
      <m-m-tabs v-model="activeTab" :items="TABS" />
    </m-m-teleport>
    <m-m-teleport to="common-page-with-aside-layout-aside">
      <div
        class="mm-flex mm-flex-column mm-h-10"
        data-cy="organization-units-aside"
      >
        <div class="organizational-units-tree-title mm-ma-12">
          <div v-sanitize-html="$t('org_units.overview.title')"></div>
          <div class="organizational-units-tree-subtitle">
            <div v-sanitize-html="$t('org_units.overview.subtitle')"></div>
          </div>
        </div>
        <div
          class="organizational-units-tree-wrapper mm-flex mm-px-12 mm-mb-auto"
        >
          <organization-units-tree
            v-if="organization"
            data-cy="organization-units-tree"
            :organization="organization"
            :organization-units="organizationUnits"
          />
        </div>
        <div class="organizational-units-tree-footer">
          <m-m-button
            size="small"
            prepend-icon="plus-white"
            variant="elevated"
            class="mm-mr-auto mm-my-8 mm-ml-8"
            cy="button-create-organization-unit"
            :is-disabled="uiStore.isSCViewerOnly"
            @click="onOpenCreateOrganizationUnitDialog"
          >
            Create organizational unit
          </m-m-button>
        </div>
      </div>
    </m-m-teleport>
    <m-m-tab-items :current-tab="activeTab">
      <m-m-tab-item :name="TABS[0].name">
        <organization-units-tab-settings
          v-if="
            organizationUnitActive &&
            organizationUnitsWithLevels &&
            organization
          "
          :key="organizationUnitActive?.id"
          :units="organizationUnitsWithLevels"
          :unit="organizationUnitActive"
          :organization="organization"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          @update="onOrganizationUnitUpdate"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[1].name">
        <organization-units-tab-users
          v-if="organizationUnitActive"
          :is-loading="isLoading"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          :unit="organizationUnitActive"
          :organization-id="organization?.id"
          @update="fetchAndSetActiveOrganizationUnit"
        />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[2].name">
        <organization-units-tab-access
          v-if="organizationUnitActive"
          :is-s-c-viewer-only="uiStore.isSCViewerOnly"
          :unit="organizationUnitActive"
          :organization-id="organization?.id"
        />
      </m-m-tab-item>
    </m-m-tab-items>

    <organization-unit-dialog-create
      :is-open="isCreateOrganizationUnitDialogOpen"
      :organization-id="organization?.id"
      :units="organizationUnitsWithLevels"
      cy="organization-unit-dialog-create"
      @create="onCreateOrganizationUnit"
      @close="onCloseCreateOrganizationUnitDialog"
    />
    <organization-unit-dialog-delete
      v-if="organizationUnitActive"
      :is-open="isDeleteOrganizationUnitDialogOpen"
      :organization-id="organization?.id"
      :unit="organizationUnitActive"
      cy="organization-unit-dialog-delete"
      @delete="onDeleteOrganizationUnit"
      @close="onCloseDeleteOrganizationUnitDialog"
    />
  </template>
</template>

<style scoped lang="scss">
.organizational-units-tree {
  &-wrapper {
    overflow: auto;
    height: 100%;
  }
  &-footer {
    border-top: 1px solid #e5e7eb;
  }
  &-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0;
    text-align: left;
    color: #101828;
  }
  &-subtitle {
    color: #475467;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>

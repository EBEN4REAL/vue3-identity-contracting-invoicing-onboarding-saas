<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { authService } from "~/auth/auth.service";
import {
  OrganizationRead,
  PaginationSchema_OrganizationRead_,
} from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import {
  TableHeader,
  TableRequestParams,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogDeleteOrganization from "./Dialogs/DialogDeleteOrganization.vue";

const organizations: Ref<PaginationSchema_OrganizationRead_ | null> = ref(null);
const isOrgAdmin: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(true);
const isDialogDeleteOrganizationOpen: Ref<boolean> = ref(false);
const currentlyDeletingOrganization: Ref<OrganizationRead | null> = ref(null);

const getOrganizations = async (params: TableRequestParams) => {
  try {
    isLoading.value = true;
    organizations.value = await organizationsService.getOrganizations(params);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching organizations",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const headers: TableHeader[] = [
  {
    label: "Org name",
    key: "name",
    sortable: true,
    order: "asc",
    sortIcon: true,
    width: "30%",
  },
  {
    label: "Domain",
    key: "domain_name",
    sortable: false,
  },
  {
    label: "Created on",
    key: "created_date",
    sortable: true,
    order: "desc",
    sortIcon: true,
    defaultSortItem: true,
  },
  {
    label: "",
    key: "actions",
    sortable: false,
  },
];

const dropdownItems = (organization: OrganizationRead): TypeDropdownItem[] => {
  const items: TypeDropdownItem[] = [
    {
      label: "Edit",
      type: "link",
      to: `/sc/organizations/${organization.id}`,
    },
  ];

  if (organization.deletable) {
    items.push({
      label: "Delete",
      type: "button",
      onClick: () => onOpenDialogDeleteOrganization(organization),
    });
  }
  return items;
};

const onOpenDialogDeleteOrganization = (organization: OrganizationRead) => {
  currentlyDeletingOrganization.value = organization;
  isDialogDeleteOrganizationOpen.value = true;
};

const onDialogDeleteOrganizationClose = () => {
  isDialogDeleteOrganizationOpen.value = false;
};

const getAllOrganizations = async () => {
  await getOrganizations({
    limit: "10",
    offset: "0",
    sort: "created_date:desc",
  });
};

onMounted(async () => {
  isOrgAdmin.value = await authService.isUserOrgAdmin();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_organizations"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      cy="organizations-table"
      :headers="headers"
      :rows="organizations?.results || []"
      :total-rows="organizations?.total || 0"
      show-search
      @update-params="getOrganizations"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/organizations/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #domain_name="{ row }">
        {{
          row.domains!.length
            ? row!
                .domains!.map((domain: { name: string }) => domain.name)
                .join(",")
            : "-"
        }}
      </template>
      <template #created_date="{ row }">
        <m-m-formatted-date
          :raw-date="row.created_date"
          format="D MMM YYYY, HH:mm"
        />
      </template>

      <template v-if="isOrgAdmin" #actions="{ row }">
        <div class="mm-flex mm-flex-justify-end">
          <m-m-dropdown
            list-side="left"
            :items="dropdownItems(row)"
            :cy="`actions-dropdown-${row.id}`"
          >
            <template #activator>
              <m-m-button
                prepend-icon="dots-vertical"
                variant="text"
                :cy="`actions-${row.id}`"
              />
            </template>
          </m-m-dropdown>
        </div>
      </template> </m-m-table
  ></m-m-overview-page>

  <dialog-delete-organization
    :is-open="isDialogDeleteOrganizationOpen"
    :organization="currentlyDeletingOrganization"
    @close="onDialogDeleteOrganizationClose"
    @delete="getAllOrganizations"
  />
</template>

<style scoped lang="scss">
.organization-header {
  max-width: 67%;
  display: flex;
  gap: 5px;
  flex-direction: column;
  margin-bottom: 10px;
  &-text {
    font-weight: 400;
  }
}
</style>

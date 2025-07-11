<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import {
  TypeAttributeTypeEditInfo,
  TypeBadgeTableData,
  TypeRestrictions,
} from "~/attribute-types/types";
import { onboardingServiceAuth } from "~/onboarding/onboarding.service";
import {
  AttributeOf,
  AttributeTypeRead,
  AttributeTypeUpdate,
} from "~/onboarding/onboarding.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import DialogCreateAttributeType from "./Dialogs/DialogCreateAttributeType.vue";
import DialogEditAttributeType from "./Dialogs/DialogEditAttributeType.vue";
import DialogDeleteAttributeType from "./Dialogs/DialogDeleteAttributeType.vue";
import { Button } from "~/mm_ui_kit/src/types/overviewPage.types";

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "claim_name",
    label: "Claim name",
  },
  {
    key: "attribute_of",
    label: "Attribute of",
  },
  {
    key: "data_type",
    label: "Data type",
  },
  {
    key: "enabled",
    label: "Status",
  },
  {
    key: "organization_attribute",
    label: "Organization specific",
  },
  {
    key: "restrictions",
    label: "Restrictions",
  },
  {
    key: "actions",
    label: "",
  },
];

const isLoading: Ref<boolean> = ref(false);
const isDialogCreateAttributeTypeOpened: Ref<boolean> = ref(false);
const isDialogEditAttributeTypeOpened: Ref<boolean> = ref(false);
const isDialogDeleteAttributeTypeOpened: Ref<boolean> = ref(false);
const allAttributeTypes: Ref<TableResponse<AttributeTypeRead> | null> =
  ref(null);
const currentlyEditingAttributeType: Ref<
  TypeAttributeTypeEditInfo & AttributeTypeUpdate
> = ref({
  id: "",
  name: "",
  enabled: false,
  attribute_of: "",
});
const currentlyDeletingAttributeType: Ref<AttributeTypeRead | null> = ref(null);

const dropdownList = (attributeType: AttributeTypeRead): TypeDropdownItem[] => {
  const actions = [];

  if (attributeType.editable) {
    actions.push({
      label: "Edit",
      type: "button",
      onClick() {
        onOpenDialogEditAttributeType(attributeType);
      },
    });
  }

  if (attributeType.deletable) {
    actions.push({
      label: "Delete",
      type: "button",
      color: "error",
      onClick() {
        onOpenDialogDeleteAttributeType(attributeType);
      },
    });
  }

  return actions;
};

const onOpenDialogCreateAttributeType = () => {
  isDialogCreateAttributeTypeOpened.value = true;
};

const onDialogCreateAttributeTypeClose = () => {
  isDialogCreateAttributeTypeOpened.value = false;
};

const onOpenDialogEditAttributeType = (attributeType: AttributeTypeRead) => {
  currentlyEditingAttributeType.value = attributeType;

  if ("organization_attribute" in attributeType) {
    currentlyEditingAttributeType.value.organization_attribute =
      attributeType.organization_attribute;
  }
  isDialogEditAttributeTypeOpened.value = true;
};

const onDialogEditAttributeTypeClose = () => {
  isDialogEditAttributeTypeOpened.value = false;
};

const onOpenDialogDeleteAttributeType = (attributeType: AttributeTypeRead) => {
  currentlyDeletingAttributeType.value = attributeType;
  isDialogDeleteAttributeTypeOpened.value = true;
};

const onDialogDeleteAttributeTypeClose = () => {
  isDialogDeleteAttributeTypeOpened.value = false;
};

const getAllAttributeTypes = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    allAttributeTypes.value = await onboardingServiceAuth.getAllAttributeTypes(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting attribute types",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const generateBadgeData = (enabled: boolean): TypeBadgeTableData => {
  return {
    status: enabled ? BadgeTypes.Active : BadgeTypes.Inactive,
    text: enabled ? "Enabled" : "Disabled",
  };
};

const generateOrganizationAttributeBadgeData = (
  hasOrganization: boolean,
): TypeBadgeTableData => {
  return {
    status: hasOrganization ? BadgeTypes.Active : BadgeTypes.Inactive,
    text: hasOrganization ? "Yes" : "No",
  };
};

const generateRestrictions = (restrictions: TypeRestrictions): string => {
  const isEmptyRestriction =
    restrictions &&
    Boolean(
      Object.keys(restrictions).length === 0 ||
        Object.values(restrictions).every((val) => val === null),
    );
  if (!restrictions || isEmptyRestriction) {
    return "-";
  } else if (restrictions.min_length || restrictions.max_length) {
    const restrictionsFormatted = [];

    if (restrictions.min_length)
      restrictionsFormatted.push(`Min length: ${restrictions.min_length}`);
    if (restrictions.max_length)
      restrictionsFormatted.push(`Max length: ${restrictions.max_length}`);

    return restrictionsFormatted.join(", ");
  } else if (restrictions.options) return restrictions.options.join(", ");

  return "Invalid restriction";
};

const generateAttributeOf = (attribute_of: AttributeOf): string => {
  switch (attribute_of) {
    case "ORGANIZATION":
      return "Organization";
    case "USER":
      return "User";
    default:
      return "Invalid attribute of";
  }
};

const buttons: ComputedRef<Button[]> = computed(() => [
  {
    key: "create_attribute_type_button",
    action: onOpenDialogCreateAttributeType,
  },
]);

onMounted(async () => {
  await getAllAttributeTypes();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_attribute_types"
    :show-config-banner="false"
    :buttons="buttons"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="allAttributeTypes?.results"
      :total-rows="allAttributeTypes?.total"
      cy="table-attribute-types"
      @update-params="getAllAttributeTypes"
    >
      <template #attribute_of="{ row }">
        {{ generateAttributeOf(row.attribute_of) }}
      </template>
      <template #enabled="{ row }">
        <m-m-badge
          :status="generateBadgeData(row.enabled).status"
          :text="generateBadgeData(row.enabled).text"
        />
      </template>
      <template #organization_attribute="{ row }">
        <m-m-badge
          :status="
            generateOrganizationAttributeBadgeData(row.organization_attribute)
              .status
          "
          :text="
            generateOrganizationAttributeBadgeData(row.organization_attribute)
              .text
          "
        />
      </template>
      <template #restrictions="{ row }">
        {{ generateRestrictions(row.restrictions) }}
      </template>
      <template #actions="{ row }">
        <m-m-dropdown :cy="`dropdown-${row.id}`" :items="dropdownList(row)">
          <template #activator>
            <m-m-button
              prepend-icon="dots-vertical"
              variant="text"
              :cy="`actions-button-${row.id}`"
            />
          </template>
        </m-m-dropdown>
      </template> </m-m-table
  ></m-m-overview-page>

  <dialog-create-attribute-type
    :is-open="isDialogCreateAttributeTypeOpened"
    @close="onDialogCreateAttributeTypeClose"
    @create="getAllAttributeTypes"
  />

  <dialog-edit-attribute-type
    :id="currentlyEditingAttributeType.id"
    :is-open="isDialogEditAttributeTypeOpened"
    :initial-data="currentlyEditingAttributeType"
    @close="onDialogEditAttributeTypeClose"
    @update="getAllAttributeTypes"
  />

  <dialog-delete-attribute-type
    :is-open="isDialogDeleteAttributeTypeOpened"
    :data="currentlyDeletingAttributeType"
    @close="onDialogDeleteAttributeTypeClose"
    @delete="getAllAttributeTypes"
  />
</template>

<style scoped lang="scss"></style>

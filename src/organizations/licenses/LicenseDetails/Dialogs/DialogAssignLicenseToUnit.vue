<script setup lang="ts">
import {
  computed,
  ComputedRef,
  onMounted,
  PropType,
  ref,
  Ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { organizationsService } from "~/organizations/organizations.service";
import { AgreementReadExtended } from "~/organizations/licenses/licenses.types";
import { OrganizationUnitRead } from "~/iam/iam.types";
import { policiesService } from "~/service-providers/policies.service";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { TypeOrganizationUnitsWithParent } from "~/organizations/OrganizationUnits/types";
import { PolicyUsageRead } from "~/policies/policies.types";

const route = useRoute();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  license: {
    type: Object as PropType<AgreementReadExtended | null>,
    default: null,
  },
  assignedUnitsIds: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  policies: {
    type: Array as PropType<PolicyUsageRead[]>,
    default: () => [],
  },
});

const emit = defineEmits(["close", "assigned", "open-assignment-dialog"]);

const selectedUnitsIds: Ref<string[]> = ref([]);
const organizationUnits: Ref<OrganizationUnitRead[]> = ref([]);
const isSubmitButtonLoading: Ref<boolean> = ref(false);
const isSubmitButtonDisabled: Ref<boolean> = ref(true);
const optional_policy_ids: Ref<string[]> = ref([]);

const title: ComputedRef<string> = computed(
  () => `Assign ${props.license?.agreement_type.name} to unit(s)`,
);

const onDialogClose = () => {
  emit("close");
};

// This is helper function that needed to add level of deepness to each unit to make margins in <m-m-select>
const organizationUnitsWithLevels: ComputedRef<
  TypeOrganizationUnitsWithParent[]
> = computed((): TypeOrganizationUnitsWithParent[] => {
  const addLevel = (
    units: OrganizationUnitRead[],
    parent_organization_unit_id: string | null = null,
    level = 0,
  ): TypeOrganizationUnitsWithParent[] => {
    return units
      .map((unit: OrganizationUnitRead) => {
        if (unit.parent_organization_unit_id === parent_organization_unit_id) {
          const newUnit: OrganizationUnitRead & {
            disabled?: boolean;
            level?: number;
          } = { ...unit, level };
          newUnit.disabled = !!props.assignedUnitsIds.find(
            (assignedUnitsId: string) => assignedUnitsId === newUnit.id,
          );
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

  return addLevel(organizationUnits.value, null);
});

const fetchOrganizationUnits = async () => {
  organizationUnits.value = await organizationsService.getOrganizationUnits(
    props.license?.service_consumer_id as string,
  );
};

const requestAssignAgreementToUnit = async (organizationUnitId: string) => {
  return policiesService.assignServiceConsumerAgreementToUnit(
    props.license?.service_consumer_id as string,
    route.params.license_id.toString(),
    organizationUnitId,
    optional_policy_ids.value,
  );
};

const onSubmit = async () => {
  try {
    isSubmitButtonDisabled.value = true;
    isSubmitButtonLoading.value = true;
    const requests = selectedUnitsIds.value.map((selectedUnitsId: string) =>
      requestAssignAgreementToUnit(selectedUnitsId),
    );
    await Promise.all(requests);
    emit("assigned");
    emit("close");
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to add license to unit",
      status: "error",
    });
  } finally {
    isSubmitButtonDisabled.value = false;
    isSubmitButtonLoading.value = false;
  }
};

const selectUnitOptionClassList = (isDisabled: boolean, level: number) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
  `margin-left-${level}`,
];

watch(
  () => selectedUnitsIds.value,
  () => {
    isSubmitButtonDisabled.value = !Boolean(selectedUnitsIds.value.length);
  },
);

onMounted(async () => {
  await fetchOrganizationUnits();
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    icon="document-check"
    cy="dialog-assign-license-to-unit"
    @close="onDialogClose"
  >
    <m-m-autocomplete
      id="autocomplete-multiple"
      v-model="selectedUnitsIds"
      placeholder="Click to add unit"
      label="Search & add unit"
      cy="select-organization-units"
      icon-prepended="search-lg"
      clear-button="x-circle"
      :items="organizationUnitsWithLevels"
      item-title="name"
      item-value="id"
      multiple
      client-side-filter
    >
      <template #option="{ item }">
        <div :class="selectUnitOptionClassList(item.disabled, item.level)">
          {{ item.name }}
          <div
            v-if="item.disabled"
            class="mm-flex mm-flex-justify-between mm-flex-grow"
          >
            <m-m-badge
              class="mm-ml-3"
              :status="BadgeTypes.Inactive"
              text="Already added"
            />
            <m-m-icon icon="check-thin-primary" width="12px" />
          </div>
        </div>
      </template>
    </m-m-autocomplete>
    <template v-if="policies?.length">
      <div class="mm-page-form-label mm-mt-10">Assign optional policies</div>
      <div v-for="policy in policies" :key="policy.id" class="mm-mt-8">
        <m-m-checkbox
          v-model="optional_policy_ids"
          :value="policy.id"
          name="optional_policy_ids"
          :data-cy="`checkbox-policy-${policy.id}`"
        >
          {{ policy.name }}
        </m-m-checkbox>
      </div>
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" color="gray" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button
          cy="button-assign-license-to-units"
          prepend-icon="plus-white"
          :loading="isSubmitButtonLoading"
          :disabled="isSubmitButtonDisabled"
          @click="onSubmit"
        >
          Add license
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
$widths_coefficient: 24;
$widths_iterations: 100;
@for $i from 1 through $widths_iterations {
  $value: $widths_coefficient * $i;
  .margin-left-#{$i} {
    margin-left: $value;
  }
}
</style>

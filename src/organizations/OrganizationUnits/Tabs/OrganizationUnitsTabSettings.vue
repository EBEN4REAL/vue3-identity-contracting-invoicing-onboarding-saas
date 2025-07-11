<script setup lang="ts">
import { computed, ComputedRef, PropType, reactive, ref } from "vue";
import { OrganizationRead, OrganizationUnitRead } from "~/iam/iam.types";
import { helpers, maxLength, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import {
  TypeEditOrganizationUnitForm,
  TypeEditOrganizationUnitFormRules,
  TypeOrganizationUnitsWithParent,
  TypeValidatorEditOrganizationUnitForm,
} from "~/organizations/OrganizationUnits/types";
import { organizationsService } from "~/organizations/organizations.service";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";

const props = defineProps({
  unit: {
    type: Object as PropType<TypeOrganizationUnitsWithParent>,
    default: null,
    required: true,
  },
  units: {
    type: Array as PropType<TypeOrganizationUnitsWithParent[]>,
    default: () => [],
    required: true,
  },
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
    required: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update"]);

const isInEditMode = ref(false);
const isAlertVisible = ref(false);
const alertText = ref("");

const parentOrganizationUnit: ComputedRef<TypeOrganizationUnitsWithParent> =
  computed((): TypeOrganizationUnitsWithParent => {
    return (
      props.units.find(
        (unit) => unit?.id === props.unit?.parent_organization_unit_id,
      ) || null
    );
  });

const form: TypeEditOrganizationUnitForm = reactive({
  parent_organization_unit_id: parentOrganizationUnit.value
    ? parentOrganizationUnit.value.id
    : props.organization.id,
  name: props.unit?.name,
  description: props.unit?.description,
});

const formRules: TypeEditOrganizationUnitFormRules = {
  name: {
    required: helpers.withMessage(
      "Organization unit name is required",
      required,
    ),
    maxLength: helpers.withMessage(
      "Organization unit name is too long",
      maxLength(256),
    ),
  },
  description: {
    maxLength: helpers.withMessage(
      "Organization unit description is too long",
      maxLength(256),
    ),
  },
};

const v$: TypeValidatorEditOrganizationUnitForm = useVuelidate(formRules, form);

const loading = ref(false);

const details: ComputedRef<TypeDataIteratorItem[]> = computed(
  (): TypeDataIteratorItem[] => [
    {
      key: "parent_organization_unit_id",
      label: "Parent",
      text: parentOrganizationUnit.value
        ? parentOrganizationUnit.value.name
        : props.organization.name,
    },
    {
      key: "name",
      label: "Org Unit Name",
      text: props.unit?.name || "",
    },
    {
      key: "description",
      label: "Description",
      text: props.unit?.description || "",
      isEmpty: !Boolean(props.unit?.description),
    },
  ],
);

const updateDetailsWithNewData = (newDetailsData: OrganizationUnitRead) => {
  const getDetailByKey = (key: string): TypeDataIteratorItem | undefined =>
    details.value.find((detail) => detail.key === key);

  const name = getDetailByKey("name");
  if (name) name.text = newDetailsData.name;

  const description = getDetailByKey("description");
  if (description) description.text = newDetailsData.description;
};
const selectParentOptionClass = (item) => [`margin-left-${item.level}`];

const onEnterEditMode = () => {
  isInEditMode.value = true;
};

const onExitEditMode = () => {
  isInEditMode.value = false;
};

const resetForm = () => {
  form.name = props.unit?.name;
  form.description = props.unit?.description;
};

const onFormDismiss = () => {
  onExitEditMode();
  resetForm();
};

function filterUnits(id: string, units: OrganizationUnitRead[]) {
  function findAndRemoveDescendants(parentId: string) {
    const descendants = units.filter(
      (item) => item.parent_organization_unit_id === parentId,
    );
    descendants.forEach((descendant) => {
      units = findAndRemoveDescendants(descendant.id);
    });
    units = units.filter((item) => item.id !== parentId);
    return units;
  }

  units = findAndRemoveDescendants(id);
  return units;
}

const updateParentOrganizationUnitId = (
  form: TypeEditOrganizationUnitForm,
  organizationId: string,
) => {
  return organizationId === form.parent_organization_unit_id
    ? null
    : form.parent_organization_unit_id;
};

const onFormSubmit = async () => {
  v$.value.$touch();
  if (!v$.value.$invalid && props.unit) {
    loading.value = true;
    try {
      form.description = form.description || null;
      form.parent_organization_unit_id = updateParentOrganizationUnitId(
        form,
        props.organization.id,
      );

      const updatedOrganizationUnit: OrganizationUnitRead =
        await organizationsService.updateOrganizationUnit(
          props.organization.id,
          props.unit.id,
          form,
        );
      updateDetailsWithNewData(updatedOrganizationUnit);
      emit("update", updatedOrganizationUnit);
      onExitEditMode();
    } catch (error) {
      if (error?.response?.status === 409) {
        isAlertVisible.value = true;
        alertText.value = "This unit name is already in use";
      }
    }
    loading.value = false;
  }
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <div v-if="!isInEditMode" class="mm-flex mm-mb-8">
    <m-m-button
      size="small"
      variant="outlined"
      class="mm-ml-auto"
      prepend-icon="pencil"
      cy="button-edit-organization-unit"
      :is-disabled="isSCViewerOnly"
      @click="onEnterEditMode"
    >
      Edit
    </m-m-button>
  </div>
  <div
    v-else
    class="mm-flex mm-flex-justify-end mm-flex-align-center mm-flex-grow mm-flex-gap-6 mm-mb-8"
  >
    <m-m-button
      variant="outlined"
      type="reset"
      size="small"
      data-cy="button-dismiss"
      @click="onFormDismiss"
    >
      Dismiss
    </m-m-button>
    <m-m-button
      variant="elevated"
      type="submit"
      size="small"
      :loading="loading"
      data-cy="button-save-changes"
      @click="onFormSubmit"
    >
      Save changes
    </m-m-button>
  </div>
  <m-m-data-iterator v-if="!isInEditMode" :data="details" :columns="1" />
  <m-m-card v-else data-cy="organization-unit-edit-mode">
    <form v-mm-focus-first class="mm-pa-12 mm-grid mm-grid-row-gap-12">
      <m-m-alert
        v-if="isAlertVisible"
        :status="AlertTypes.Error"
        cy="alert-organization-unit-update"
        @close="onAlertClose"
      >
        {{ alertText }}
      </m-m-alert>
      <m-m-select
        v-model="form.parent_organization_unit_id"
        label="Parent"
        item-title="name"
        item-value="id"
        cy="select-organization-unit-parent"
        :items="filterUnits(unit.id, units)"
      >
        <template #option="{ item }">
          <span :class="selectParentOptionClass(item)">
            {{ item.name }}
          </span>
        </template>
      </m-m-select>
      <m-m-input
        v-if="form.name !== null"
        v-model="form.name"
        label="Organization Unit Name"
        placeholder="Organization Unit Name"
        data-cy="input-organization-unit-name"
        :errors="v$.name.$errors"
        @blur="v$.name.$touch"
      />
      <m-m-input
        v-model="form.description"
        label="Organization Unit Description"
        placeholder="Organization Unit Description"
        inputmode="textarea"
        data-cy="input-organization-unit-description"
        :errors="v$.description.$errors"
        @blur="v$.description.$touch"
      />
    </form>
  </m-m-card>
</template>

<style scoped lang="scss">
$widths_coefficient: 24;
$widths_iterations: 10;
@for $i from 1 through $widths_iterations {
  $value: $widths_coefficient * $i + px;
  .margin-left-#{$i} {
    margin-left: $value;
  }
}
</style>

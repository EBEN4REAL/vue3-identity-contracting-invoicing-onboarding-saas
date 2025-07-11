<script setup lang="ts">
import { reactive, ref, PropType, watch, computed, ComputedRef } from "vue";
import { organizationsService } from "~/organizations/organizations.service";
import { OrganizationUnitCreate } from "~/iam/iam.types";
import { helpers, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import {
  TypeCreateOrganizationUnitForm,
  TypeCreateOrganizationUnitFormRules,
  TypeOrganizationUnitsWithParent,
  TypeValidatorCreateOrganizationUnitForm,
} from "~/organizations/OrganizationUnits/types";
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  organizationId: {
    type: String,
    default: "",
    required: true,
  },
  units: {
    type: Array as PropType<TypeOrganizationUnitsWithParent[]>,
    default: () => [],
    required: true,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "create"]);

const unitId: ComputedRef<string | null> = computed(() =>
  route.params.unitId ? route.params.unitId.toString() : null,
);

const form: TypeCreateOrganizationUnitForm = reactive({
  parent_organization_unit_id: unitId.value || props.organizationId,
  name: "",
  description: null,
});

watch(
  () => unitId.value,
  () => {
    form.parent_organization_unit_id = unitId.value;
  },
);

const loading = ref(false);

const formRules: TypeCreateOrganizationUnitFormRules = {
  name: {
    required: helpers.withMessage("Organization unit name required", required),
  },
};

const v$: TypeValidatorCreateOrganizationUnitForm = useVuelidate(
  formRules,
  form,
);

const resetForm = () => {
  v$.value.$reset();
  form.parent_organization_unit_id = unitId.value;
  form.name = "";
  form.description = null;
};

const onCloseForm = () => {
  emit("close");
  resetForm();
};

const submitForm = async () => {
  const validationResult = await v$.value.$validate();

  if (!validationResult) {
    return;
  }

  loading.value = true;

  try {
    if (form.parent_organization_unit_id === props.organizationId) {
      form.parent_organization_unit_id = null;
    }

    const data: OrganizationUnitCreate = {
      name: form.name,
      description: form.description || null,
      parent_organization_unit_id: form.parent_organization_unit_id,
      users: [],
    };

    const unit = await organizationsService.createOrganizationUnit(
      props.organizationId,
      data,
    );

    emit("create", unit);
    onCloseForm();
  } catch (error) {
    console.error(error);
    // handle error as you wish
  } finally {
    loading.value = false;
  }
};
const selectParentOptionClass = (level: number) => [`margin-left-${level}`];
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Create organizational unit"
    subtitle="Create a new organizational unit to manage your users"
    icon="building-office"
    cy="dialog-organization-unit-create"
    @close="onCloseForm"
  >
    <form
      v-mm-focus-first
      class="mm-flex mm-flex-column mm-flex-gap-10"
      @submit.prevent="submitForm"
    >
      <m-m-select
        v-if="units.length"
        v-model="form.parent_organization_unit_id"
        label="Parent"
        item-title="name"
        item-value="id"
        :items="units"
      >
        <template #option="{ item }">
          <span :class="selectParentOptionClass(item.level)">
            {{ item.name }}
          </span>
        </template>
      </m-m-select>
      <m-m-input
        v-model="form.name"
        label="Name of the org unit"
        placeholder="Enter organizational unit name"
        :errors="v$.name.$errors"
        cy="input-name"
        @blur="v$.name.$touch"
      />
      <m-m-input
        v-model="form.description"
        label="Description"
        placeholder="Write something about this org-unit..."
        inputmode="textarea"
        cy="input-description"
      />
    </form>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button
          variant="outlined"
          cy="button-organization-unit-dialog-create-dismiss"
          @click="onCloseForm"
        >
          Dismiss
        </m-m-button>
        <m-m-button
          :loading="loading"
          cy="button-organization-unit-dialog-create-submit"
          :is-disabled="isSCViewerOnly"
          @click="submitForm"
        >
          Create organizational unit
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

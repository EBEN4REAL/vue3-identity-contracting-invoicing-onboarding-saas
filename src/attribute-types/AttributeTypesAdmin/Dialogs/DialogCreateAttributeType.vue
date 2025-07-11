<script setup lang="ts">
import { computed, ComputedRef, reactive, ref, Ref, watch } from "vue";
import {
  EnumDataType,
  TypeAttributeTypeForm,
  TypeAttributeTypeFormRules,
  TypeAttributeTypeRestrictionsFormRules,
  TypeRestrictions,
  TypeValidatorAttributeTypeForm,
  TypeValidatorAttributeTypeRestrictionsForm,
} from "~/attribute-types/types";
import {
  ATTRIBUTE_OF,
  DATA_TYPE,
} from "~/attribute-types/AttributeTypesAdmin/constants";
import { onboardingServiceAuth } from "~/onboarding/onboarding.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { AttributeTypeCreate } from "~/onboarding/onboarding.types";
import { useVuelidate } from "@vuelidate/core";
import { helpers, maxLength, required } from "@vuelidate/validators";
import { toSnakeCase } from "~/mm_ui_kit/src/helpers/utils";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const emit = defineEmits(["close", "create"]);

const isButtonSubmitDisabled: Ref<boolean> = ref(true);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isOrganizationSpecific: Ref<boolean> = ref(false);
const claimNameAssigned: Ref<boolean> = ref(false);

const form: TypeAttributeTypeForm = reactive({
  name: "",
  attribute_of: null,
  data_type: null,
  enabled: null,
  restrictions: {},
  claim_name: "",
});

const isClaimNameValid = (claimName: string): boolean =>
  /^[a-z](?!.*__)[a-z0-9_]*[a-z0-9]$/.test(claimName || "");

const formRules: TypeAttributeTypeFormRules = {
  name: {
    required: helpers.withMessage("Name type is required", required),
    maxLength: helpers.withMessage("Name type is too long", maxLength(256)),
  },
  claim_name: {
    required: helpers.withMessage("Claim name is required", required),
    maxLength: helpers.withMessage(
      "Claim name type is too long",
      maxLength(256),
    ),
    claimNameValidator: helpers.withMessage(
      "Claim name must be in lowercase and without spaces or have special characters",
      isClaimNameValid,
    ),
  },
  attribute_of: {
    required: helpers.withMessage("Attribute of is required", required),
  },
  data_type: {
    required: helpers.withMessage("Data type is required", required),
  },
  enabled: {
    required: helpers.withMessage("Enabled field is required", required),
  },
};

const v$: TypeValidatorAttributeTypeForm = useVuelidate(formRules, form);

const restrictionsForm: TypeRestrictions = reactive({
  min_length: "",
  max_length: "",
  options: [],
});

const restrictionsFormRules: TypeAttributeTypeRestrictionsFormRules = {
  options: {
    required: helpers.withMessage("Options field is required", required),
  },
};

const v$Restrictions: TypeValidatorAttributeTypeRestrictionsForm = useVuelidate(
  restrictionsFormRules,
  restrictionsForm,
);

const booleanItemsForSelect = computed(() => [
  {
    title: "Yes",
    value: true,
  },
  {
    title: "No",
    value: false,
  },
]);

const isUserOrganizationAtrributeCheckboxVisible: ComputedRef<boolean> =
  computed(() => form.attribute_of === "USER");

const generateItemsForSelect = (items: object) =>
  Object.keys(items).map((key) => ({ title: items[key], value: key }));

const isFormDataTypeString: ComputedRef<boolean> = computed(
  () => form.data_type === EnumDataType.STRING,
);

const isFormDataTypeEnum: ComputedRef<boolean> = computed(
  () => form.data_type === EnumDataType.ENUM,
);

const payloadForSubmitRequest: ComputedRef<AttributeTypeCreate> = computed(
  () => {
    const payload = form as AttributeTypeCreate;

    if (restrictionsForm.min_length !== "")
      // Check for !== "" is required because min_length can be 0, that is false
      payload.restrictions["min_length"] = Number(restrictionsForm.min_length);

    if (restrictionsForm.max_length)
      payload.restrictions["max_length"] = Number(restrictionsForm.max_length);

    if (restrictionsForm.options.length)
      payload.restrictions["options"] = restrictionsForm.options;

    if (
      !(isFormDataTypeString.value || isFormDataTypeEnum.value) ||
      Object.keys(restrictionsForm).length === 0
    )
      payload.restrictions = null;

    if (isUserOrganizationAtrributeCheckboxVisible.value) {
      payload.organization_attribute = isOrganizationSpecific.value;
    } else {
      delete payload.organization_attribute;
    }

    return payload;
  },
);

const onFormSubmit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;

    await onboardingServiceAuth.postAttributeType(
      payloadForSubmitRequest.value,
    );
    emit("create");
    emit("close");
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Error creating attribute type",
      status: "error",
    });
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};

const resetForm = () => {
  form.name = "";
  form.attribute_of = null;
  form.data_type = null;
  form.enabled = null;
  form.restrictions = {};
  form.claim_name = "";
  v$.value.$reset();
};

const handleBlur = (field: string) => {
  if (field === "name" && !claimNameAssigned.value) {
    form.claim_name = toSnakeCase(form.name);
    claimNameAssigned.value = true;
  }
};

const resetRestrictionsForm = () => {
  restrictionsForm.min_length = "";
  restrictionsForm.max_length = "";
  restrictionsForm.options = [];
  v$Restrictions.value.$reset();
};

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen) {
      resetForm();
      resetRestrictionsForm();
      claimNameAssigned.value = false;
    }
  },
);

watch(
  () => v$.value.$invalid,
  () => {
    isButtonSubmitDisabled.value = v$.value.$invalid;
  },
);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Create attribute type"
    subtitle="Enter the following details to create attribute type"
    icon="list-bullet"
    cy="dialog-create-attribute-type"
    @close="emit('close')"
  >
    <form
      v-mm-focus-first
      class="mm-flex mm-flex-column mm-flex-gap-8"
      @submit.prevent="onFormSubmit"
    >
      <m-m-input
        v-model="form.name"
        placeholder="Enter Attribute Type Name"
        label="Name"
        cy="input-name"
        required
        :errors="v$.name.$errors"
        @input="v$.name.$touch"
        @blur="handleBlur('name')"
      />
      <m-m-input
        v-model="form.claim_name"
        placeholder="Enter claim name"
        label="Claim name"
        required
        :errors="v$.claim_name.$errors"
        @input="v$.claim_name.$touch"
      />
      <m-m-select
        v-model="form.attribute_of"
        label="Attribute of"
        placeholder="Select attribute of"
        required
        :items="generateItemsForSelect(ATTRIBUTE_OF)"
        cy="select-attribute-of"
        :errors="v$.attribute_of.$errors"
      />
      <m-m-select
        v-model="form.data_type"
        label="Data type"
        placeholder="Select Data Type"
        :items="generateItemsForSelect(DATA_TYPE)"
        cy="select-data-type"
        required
        :errors="v$.data_type.$errors"
        @update:model-value="resetRestrictionsForm"
      />
      <div v-if="isFormDataTypeString" class="mm-flex mm-flex-column-gap-4">
        <m-m-input
          v-model="restrictionsForm.min_length"
          label="Min length"
          placeholder="Enter min length"
          class="mm-flex-grow"
          cy="input-restrictions-min-length"
        />
        <m-m-input
          v-model="restrictionsForm.max_length"
          label="Max length"
          placeholder="Enter max length"
          class="mm-flex-grow"
          cy="input-restrictions-max-length"
        />
      </div>
      <m-m-tags-input
        v-else-if="isFormDataTypeEnum"
        v-model="restrictionsForm.options"
        class="mm-d-flex"
        label="Options"
        placeholder="Enter options"
        cy="tags-input-restrictions-options"
        required
        :errors="v$Restrictions.options.$errors"
        @update:model-value="v$Restrictions.options.$touch"
      />
      <m-m-select
        v-model="form.enabled"
        label="Enabled"
        placeholder="Select is attribute type enabled"
        :items="booleanItemsForSelect"
        :errors="v$.enabled.$errors"
        required
        cy="select-enabled"
      />
      <m-m-checkbox
        v-if="isUserOrganizationAtrributeCheckboxVisible"
        v-model="isOrganizationSpecific"
        class="mm-mb-8"
        cy="checkbox-organization-specific"
      >
        Organization Specific
      </m-m-checkbox>
    </form>
    <template #footer>
      <m-m-button variant="outlined" cy="button-close" @click="emit('close')">
        Close
      </m-m-button>
      <m-m-button
        type="submit"
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        cy="button-submit"
        @click="onFormSubmit"
      >
        Create attribute type
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

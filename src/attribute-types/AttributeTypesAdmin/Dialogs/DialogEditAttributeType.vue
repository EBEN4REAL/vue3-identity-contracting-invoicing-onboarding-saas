<script setup lang="ts">
import {
  computed,
  PropType,
  reactive,
  ref,
  Ref,
  watch,
  ComputedRef,
} from "vue";
import {
  EnumDataType,
  TypeAttributeTypeRestrictionsFormRules,
  TypeRestrictions,
  TypeUpdateAttributeTypeFormRules,
  TypeUpdateValidatorAttributeTypeForm,
  TypeValidatorAttributeTypeRestrictionsForm,
} from "~/attribute-types/types";
import { onboardingServiceAuth } from "~/onboarding/onboarding.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import {
  AttributeTypeRead,
  AttributeTypeUpdate,
} from "~/onboarding/onboarding.types";
import { useVuelidate } from "@vuelidate/core";
import { helpers, maxLength, required } from "@vuelidate/validators";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  id: {
    type: String,
    default: "",
  },
  initialData: {
    type: Object as PropType<AttributeTypeRead>,
    default: () => ({}),
  },
});

const emit = defineEmits(["close", "update"]);

const isButtonSubmitDisabled: Ref<boolean> = ref(true);
const isButtonSubmitLoading: Ref<boolean> = ref(false);

const form: AttributeTypeUpdate = reactive({
  name: props.initialData.name,
  enabled: props.initialData.enabled,
  restrictions: props.initialData?.restrictions ?? {},
  claim_name: props.initialData?.claim_name ?? "",
});

const isClaimNameValid = (claimName: string): boolean =>
  /^[a-z](?!.*__)[a-z0-9_]*[a-z0-9]$/.test(claimName || "");

const formRules: TypeUpdateAttributeTypeFormRules = {
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
  enabled: {
    required: helpers.withMessage("Enabled field is required", required),
  },
};

const v$: TypeUpdateValidatorAttributeTypeForm = useVuelidate(formRules, form);

const restrictionsForm: TypeRestrictions = reactive({
  min_length: props.initialData.restrictions?.max_length || "",
  max_length: props.initialData.restrictions?.min_length || "",
  options: props.initialData.restrictions?.options || [],
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

const isFormDataTypeString: ComputedRef<boolean> = computed(
  () => props.initialData.data_type === EnumDataType.STRING,
);

const isFormDataTypeEnum: ComputedRef<boolean> = computed(
  () => props.initialData.data_type === EnumDataType.ENUM,
);

const payloadForSubmitRequest: ComputedRef<AttributeTypeUpdate> = computed(
  () => {
    const payload = { ...form };
    payload.restrictions = {};

    if (restrictionsForm.min_length !== "") {
      payload.restrictions["min_length"] = Number(restrictionsForm.min_length);
    }
    if (restrictionsForm.max_length !== "") {
      payload.restrictions["max_length"] = Number(restrictionsForm.max_length);
    }
    if (restrictionsForm.options.length) {
      payload.restrictions["options"] = restrictionsForm.options;
    } else {
      payload.restrictions["options"] = null;
    }
    // If there's no useful data in restrictions, nullify it
    if (
      !isFormDataTypeString.value &&
      !isFormDataTypeEnum.value &&
      Object.keys(payload.restrictions).length === 0
    ) {
      payload.restrictions = null;
    }
    return payload;
  },
);

const onFormSubmit = async () => {
  v$.value.$touch();
  if (
    v$.value.$invalid ||
    (v$Restrictions.value.$invalid &&
      props.initialData.data_type === EnumDataType.ENUM)
  )
    return;
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;

    await onboardingServiceAuth.updateAttributeType(
      props.id,
      payloadForSubmitRequest.value,
    );
    emit("update");
    emit("close");
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to update attribute type",
      status: "error",
    });
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};

const resetRestrictionsForm = () => {
  restrictionsForm.min_length = "";
  restrictionsForm.max_length = "";
  restrictionsForm.options = [];
  v$Restrictions.value.$reset();
};

const resetForm = () => {
  form.name = props.initialData.name;
  form.enabled = props.initialData.enabled;
  form.restrictions = props.initialData.restrictions ?? null;
  v$.value.$reset();
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.initialData) {
      const { name, enabled, restrictions, claim_name } = props.initialData;

      form.name = name;
      form.enabled = enabled;
      form.restrictions = restrictions ?? null;
      form.claim_name = claim_name;

      restrictionsForm.options = restrictions?.options || [];
      restrictionsForm.max_length = restrictions?.max_length || "";
      restrictionsForm.min_length = restrictions?.min_length || "";
    } else {
      resetForm();
      resetRestrictionsForm();
    }
  },
  { immediate: true },
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
    title="Update attribute type"
    subtitle="Enter the following details to update update attribute type"
    icon="list-bullet"
    cy="dialog-update-attribute-type"
    @close="emit('close')"
  >
    <form v-mm-focus-first class="mm-flex mm-flex-column mm-flex-gap-8">
      <m-m-input
        v-model="form.name"
        placeholder="Enter attribute type name"
        label="Name"
        cy="input-name"
        required
        :errors="v$.name.$errors"
        @input="v$.name.$touch"
      />
      <m-m-input
        v-model="form.claim_name"
        placeholder="Enter claim name"
        label="Claim name"
        cy="input-claim-name"
        required
        :errors="v$.claim_name.$errors"
        @input="v$.claim_name.$touch"
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
        :errors="v$Restrictions?.options?.$errors"
        @update:model-value="v$Restrictions?.options.$touch"
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
        Update attribute type
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

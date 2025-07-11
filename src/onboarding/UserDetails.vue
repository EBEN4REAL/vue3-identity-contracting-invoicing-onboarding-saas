<script setup lang="ts">
import {
  ComputedRef,
  PropType,
  computed,
  reactive,
  ref,
  Ref,
  onMounted,
} from "vue";
import { onboardingService } from "~/onboarding/onboarding.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import {
  TypeUserDetailsForm,
  TypeUserDetailsFormRules,
  TypeValidatorUserDetails,
  Attributes,
  FormattedAttributes,
} from "~/onboarding/onboarding.types";
import { useVuelidate } from "@vuelidate/core";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { required, helpers, maxLength } from "@vuelidate/validators";
import dayjs from "dayjs";
import {
  isValueFalsy,
  replaceInvalidValues,
  toCamelCase,
} from "~/mm_ui_kit/src/helpers/utils";
import { cloneDeep } from "lodash";
import DialogProvideConsent from "~/onboarding/Dialogs/DialogProvideConsent.vue";
import { isValidUUID } from "~/mm_ui_kit/src/helpers/errorIDValidator";
import DialogConfirmDiscardProvideConsent from "~/onboarding/Dialogs/DialogConfirmDiscardProvideConsent.vue";
import { EnumDataType } from "~/attribute-types/types";
import { useEnterSubmit } from "~/mm_ui_kit/src/composables/useEnterSubmit";

const props = defineProps({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  job_role: { type: String, required: false, default: "" },
  attributes: {
    type: Array as PropType<Attributes>,
    required: false,
    default: null,
  },
  isStageRequired: {
    type: Boolean,
    required: false,
    default: false,
  },
  previous_callable: { type: Function, required: true },
  next_callable: { type: Function, required: true },
});

const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isDialogProvideConsentOpen: Ref<boolean> = ref(false);
const isDialogConfirmDiscardProvideConsentOpen: Ref<boolean> = ref(false);
const form: TypeUserDetailsForm = reactive({
  firstName: props.first_name,
  lastName: props.last_name,
});
const brandingConfigStore = useBrandingConfigStore();
const initialAttributes = cloneDeep(props.attributes || []);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () => v$.value.$invalid || isButtonSubmitLoading.value,
);

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const attributesFiltered: ComputedRef<Attributes> = computed(() =>
  initialAttributes.filter((attribute) =>
    attribute.visible
      ? attribute.value === null || attribute.value === ""
      : false,
  ),
);

const formRules: TypeUserDetailsFormRules = reactive({});

const textAttributes: ComputedRef<Attributes> = computed(() =>
  attributesFiltered.value.filter(
    (attr) =>
      attr.data_type === EnumDataType.STRING ||
      attr.data_type === EnumDataType.UUID,
  ),
);

const booleanAttributes: ComputedRef<Attributes> = computed(() =>
  attributesFiltered.value.filter(
    (attr) => attr.data_type === EnumDataType.BOOLEAN,
  ),
);

const enumAttributes: ComputedRef<Attributes> = computed(() =>
  attributesFiltered.value
    .filter((attr) => attr.data_type === EnumDataType.ENUM)
    .map((attr) => ({
      ...attr,
      items:
        attr.restrictions?.options?.map((option: string) => ({
          title: option,
          value: option,
        })) || [],
    })),
);

const dateAttributes: ComputedRef<Attributes> = computed(() =>
  attributesFiltered.value.filter(
    (attr) => attr.data_type === EnumDataType.DATE,
  ),
);

const v$: TypeValidatorUserDetails = useVuelidate(formRules, form);

function validateFormByFields(event: Event, fieldName: string) {
  const inputElement = event.target as HTMLInputElement;
  form[fieldName] =
    inputElement.type === "checkbox"
      ? inputElement.checked
      : inputElement.value;

  attributesFiltered.value.forEach((attr) => {
    if (toCamelCase(attr.name) === fieldName) {
      attr.value =
        inputElement.type === "checkbox"
          ? inputElement.checked
          : inputElement.value;
    }
  });

  v$.value[fieldName].$touch();
}

const formattedUserAttributes: ComputedRef<FormattedAttributes> = computed(
  () => {
    attributesFiltered.value.forEach((attr) => {
      const camelCaseName = toCamelCase(attr.name);
      if (camelCaseName in form) {
        attr.value = form[camelCaseName];
      }
    });

    // Format attributes into a record with the desired structure
    return attributesFiltered.value.reduce((acc, attr) => {
      if (attr.value) {
        if (attr.data_type === EnumDataType.DATE) {
          acc[attr.id] = dayjs(attr.value).format("YYYY-MM-DD");
        } else {
          acc[attr.id] = attr.value;
        }
      }
      return acc;
    }, {} as FormattedAttributes);
  },
);

const isSkipCurrentStage: ComputedRef<boolean> = computed(
  () =>
    !props.isStageRequired &&
    Object.values(cloneDeep(initialAttributes)).every(
      (attribute) => !isValueFalsy(attribute.value),
    ) &&
    !isValueFalsy(props.first_name) &&
    !isValueFalsy(props.last_name),
);

const isFirstNameVisible: ComputedRef<boolean> = computed(
  () => props.isStageRequired || isValueFalsy(props.first_name),
);

const isLastNameVisible: ComputedRef<boolean> = computed(
  () => props.isStageRequired || isValueFalsy(props.last_name),
);

const isFormReady: ComputedRef<boolean> = computed(
  () => Object.keys(formRules).length > 0,
);

const onCloseDialogProvideConsent = () => {
  isDialogProvideConsentOpen.value = false;
  isDialogConfirmDiscardProvideConsentOpen.value = true;
};

const onSubmitDialogProvideConsent = () => {
  isDialogProvideConsentOpen.value = false;
  if (isSkipCurrentStage.value) {
    submitForm();
  }
};

const onCloseDialogConfirmDiscardProvideConsent = () => {
  isDialogProvideConsentOpen.value = true;
  isDialogConfirmDiscardProvideConsentOpen.value = false;
};

const setFormRules = () => {
  formRules.firstName = {
    required: helpers.withMessage("First name is required", required),
    maxLength: helpers.withMessage(
      `Exceeds max length of 50 characters`,
      maxLength(50),
    ),
  };

  formRules.lastName = {
    required: helpers.withMessage("Last name is required", required),
    maxLength: helpers.withMessage(
      `Exceeds max length of 50 characters`,
      maxLength(50),
    ),
  };

  attributesFiltered.value.forEach((attr) => {
    const attrName = toCamelCase(attr.name);

    formRules[attrName] = {};

    if (attr.required) {
      formRules[attrName].required = helpers.withMessage(
        `${attr.name} is required`,
        required,
      );

      if (attr.data_type === EnumDataType.BOOLEAN) {
        formRules[attrName].required = helpers.withMessage(
          `${attr.name} is required`,
          (value: boolean | null) => typeof value === "boolean" && value,
        );
      }
    }

    if (attr.data_type === EnumDataType.UUID) {
      formRules[attrName].required = helpers.withMessage(
        `${attr.name} should be correct UUID`,
        (value) => {
          return value ? isValidUUID(`${value}`) : !attr.required;
        },
      );
    }

    if (attr.data_type === EnumDataType.DATE) {
      formRules[attrName].required = helpers.withMessage(
        `${attr.name} should be correct date`,
        (value: string) => dayjs(value).isValid(),
      );
    }

    const { min_length, max_length } = attr.restrictions || {};
    if (min_length) {
      formRules[attrName].minLength = helpers.withMessage(
        `${attr.name} must be at least ${min_length} characters long`,
        (value: string) => {
          return value ? value.length >= min_length : true;
        },
      );
    }
    if (max_length) {
      formRules[attrName].maxLength = helpers.withMessage(
        `${attr.name} must be at most ${max_length} characters long`,
        (value: string) => {
          return value ? value.length <= max_length : true;
        },
      );
    }
  });
};

const submitForm = async () => {
  v$.value.$touch();

  if (!v$.value.$invalid) {
    try {
      isButtonSubmitLoading.value = true;
      await onboardingService.updateUser({
        first_name: form.firstName,
        last_name: form.lastName,
        attributes: replaceInvalidValues(formattedUserAttributes.value),
      });
      await props.next_callable();
    } catch (error) {
      eventBus.$emit("onShowToast", {
        text: "Failed to save user details",
        status: "error",
      });
    } finally {
      isButtonSubmitLoading.value = false;
    }
  }
};

useEnterSubmit(v$, submitForm);

onMounted(() => {
  setFormRules();
  isDialogProvideConsentOpen.value = Boolean(
    props.attributes.some(
      (attribute) => attribute.value && !attribute.consent.granted,
    ),
  );
  if (isSkipCurrentStage.value && !isDialogProvideConsentOpen.value) {
    submitForm();
  }
});
</script>

<template>
  <template v-if="!isSkipCurrentStage">
    <m-m-teleport to="onboarding-title">
      <div v-if="logoSrc" class="mm-mx-auto mm-mb-15">
        <img :src="logoSrc" class="mm-auth-view-logo" />
      </div>
      <div v-sanitize-html="$t('onboarding.user_details.title')"></div>
    </m-m-teleport>

    <m-m-teleport to="onboarding-subtitle">
      <div v-sanitize-html="$t('onboarding.user_details.subtitle')"></div>
    </m-m-teleport>

    <form
      v-if="isFormReady"
      id="user_details"
      v-mm-focus-first
      tabindex="0"
      data-cy="form-user-details-onboarding"
      @submit.prevent="submitForm"
    >
      <m-m-input
        v-if="isFirstNameVisible"
        id="first_name"
        v-model="form.firstName"
        label="First name"
        placeholder="Enter your first name"
        type="text"
        cy="input-first-name"
        required
        class="mm-mb-16"
        :errors="v$.firstName.$errors"
        @blur="v$.firstName.$touch"
        @update:model-value="v$.firstName.$touch"
      />
      <m-m-input
        v-if="isLastNameVisible"
        id="last_name"
        v-model="form.lastName"
        label="Last name"
        placeholder="Enter your last name"
        cy="input-last-name"
        required
        type="text"
        class="mm-mb-16"
        :errors="v$.lastName.$errors"
        @blur="v$.lastName.$touch"
        @update:model-value="v$.lastName.$touch"
      />
      <template v-for="attribute in textAttributes" :key="attribute.name">
        <m-m-input
          :id="attribute.name"
          v-model="form[toCamelCase(attribute.name)]"
          :label="`${attribute.name}`"
          :placeholder="attribute.name"
          type="text"
          class="mm-mb-16"
          :errors="v$[toCamelCase(attribute.name)].$errors"
          :required="attribute.required"
          :cy="toCamelCase(attribute.name)"
          @input="validateFormByFields($event, toCamelCase(attribute.name))"
        />
      </template>

      <template v-for="attribute in enumAttributes" :key="attribute.name">
        <m-m-select
          :id="attribute.name"
          v-model="form[toCamelCase(attribute.name)]"
          :label="`${attribute.name}`"
          :items="attribute.items"
          :errors="v$[toCamelCase(attribute.name)].$errors"
          item-title="title"
          item-value="value"
          :cy="toCamelCase(attribute.name)"
          :required="attribute.required"
          class="mm-mb-16"
          @input="validateFormByFields($event, toCamelCase(attribute.name))"
        />
      </template>

      <template v-for="attribute in dateAttributes" :key="attribute.name">
        <m-m-field-label
          :label="attribute.name"
          :required="attribute.required"
        />
        <m-m-datepicker
          v-model="form[toCamelCase(attribute.name)]"
          placeholder="Select date"
          popup-side="right"
          time-title-format="MMMM DD, YYYY"
          format="MMMM DD, YYYY"
          type="date"
          class="mm-mb-8"
          :required="attribute.required"
          errors-position="absolute"
          :errors="v$[toCamelCase(attribute.name)].$errors"
          :data-cy="toCamelCase(attribute.name)"
        />
      </template>

      <m-m-checkbox
        v-for="attribute in booleanAttributes"
        :id="attribute.name"
        :key="attribute.name"
        v-model="form[toCamelCase(attribute.name)]"
        :label="`${attribute.name}`"
        :errors="v$[toCamelCase(attribute.name)].$errors"
        :required="attribute.required"
        :cy="toCamelCase(attribute.name)"
        @change="validateFormByFields($event, toCamelCase(attribute.name))"
      >
        {{ attribute.name }}
      </m-m-checkbox>

      <m-m-teleport to="onboarding-footer-next">
        <m-m-button
          id="next"
          form="user_details"
          type="submit"
          is-full-width
          class="continue-button"
          data-cy="button-continue"
          :is-disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          @click.prevent="submitForm"
        >
          Continue
        </m-m-button>
      </m-m-teleport>
    </form>
  </template>

  <dialog-provide-consent
    :is-open="isDialogProvideConsentOpen"
    :attributes="attributes"
    provide-consents-to="users"
    @close="onCloseDialogProvideConsent"
    @submit="onSubmitDialogProvideConsent"
  />

  <dialog-confirm-discard-provide-consent
    :is-open="isDialogConfirmDiscardProvideConsentOpen"
    @close="onCloseDialogConfirmDiscardProvideConsent"
  />
</template>
<style scoped lang="scss">
.continue-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
</style>

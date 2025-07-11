<script setup lang="ts">
import {
  computed,
  ComputedRef,
  onMounted,
  PropType,
  reactive,
  ref,
  Ref,
} from "vue";
import {
  Attributes,
  FormattedAttributes,
  TypeUpdateOrganizationForm,
  TypeUpdateOrganizationFormRules,
} from "~/onboarding/onboarding.types";
import {
  isValueFalsy,
  replaceInvalidValues,
  toCamelCase,
} from "~/mm_ui_kit/src/helpers/utils";
import { shortcutsForDatepickers } from "~/onboarding/constants";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { onboardingService } from "~/onboarding/onboarding.service";
import dayjs from "dayjs";
import { isValidUUID } from "~/mm_ui_kit/src/helpers/errorIDValidator";
import DialogConfirmDiscardProvideConsent from "~/onboarding/Dialogs/DialogConfirmDiscardProvideConsent.vue";
import DialogProvideConsent from "~/onboarding/Dialogs/DialogProvideConsent.vue";
import { cloneDeep } from "lodash";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { EnumDataType } from "~/attribute-types/types";
import { useEnterSubmit } from "~/mm_ui_kit/src/composables/useEnterSubmit";

const props = defineProps({
  id: { type: String, required: false, default: "" },
  name: { type: String, required: true },
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

const brandingConfigStore = useBrandingConfigStore();

const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isDialogProvideConsentOpen: Ref<boolean> = ref(false);
const isDialogConfirmDiscardProvideConsentOpen: Ref<boolean> = ref(false);
const initialAttributes = cloneDeep(props.attributes || []);

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () => v$.value.$invalid || isButtonSubmitLoading.value,
);

const attributesFiltered: ComputedRef<Attributes> = computed(() =>
  initialAttributes.filter((attribute) =>
    attribute.visible
      ? attribute.value === null || attribute.value === ""
      : false,
  ),
);
const form: TypeUpdateOrganizationForm = reactive({});
const formRules: TypeUpdateOrganizationFormRules = reactive({});
const v$ = useVuelidate(formRules, form);

const validateFormByFields = (event: Event, fieldName: string) => {
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

  if (v$.value[fieldName]) v$.value[fieldName].$touch();
};

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

const isSkipCurrentStage: ComputedRef<boolean> = computed(
  () =>
    !props.isStageRequired &&
    Object.values(cloneDeep(initialAttributes)).every(
      (attribute) => !isValueFalsy(attribute.value),
    ) &&
    !isValueFalsy(props.name),
);

const formattedOrganizationAttributes: ComputedRef<FormattedAttributes> =
  computed(() => {
    attributesFiltered.value.forEach((attr) => {
      const camelCaseName = toCamelCase(attr.name);
      if (camelCaseName in form) {
        attr.value = form[camelCaseName];
      }
    });

    return attributesFiltered.value.reduce((acc, attr) => {
      if (attr.value !== null && attr.value !== undefined && attr.value !== "")
        if (attr.data_type === EnumDataType.DATE) {
          acc[attr.id] = dayjs(attr.value).format("YYYY-MM-DD");
        } else {
          acc[attr.id] = attr.value;
        }
      return acc;
    }, {} as FormattedAttributes);
  });

const isFormReady: ComputedRef<boolean> = computed(
  () => Object.keys(formRules).length > 0,
);

const setFormRules = () => {
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

  if (v$.value.$invalid) {
    return;
  }

  try {
    isButtonSubmitLoading.value = true;
    await onboardingService.updateOrganization(
      {
        attributes: replaceInvalidValues(formattedOrganizationAttributes.value),
      },
      props.id,
    );
    await props.next_callable();
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Error while updating organization",
      status: "error",
    });
  } finally {
    isButtonSubmitLoading.value = false;
  }
};

useEnterSubmit(v$, submitForm);

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
      <div v-if="logoSrc" class="mm-mb-15 mm-mx-auto">
        <img :src="logoSrc" class="mm-auth-view-logo" />
      </div>
      {{ name }}
    </m-m-teleport>

    <m-m-teleport to="onboarding-subtitle">
      Please provide the following details of your organization.
    </m-m-teleport>

    <form
      v-if="isFormReady"
      id="update_organization"
      v-mm-focus-first
      tabindex="0"
      data-cy="form-user-details-onboarding"
      @submit.prevent="submitForm"
    >
      <template v-for="attribute in textAttributes" :key="attribute.name">
        <m-m-input
          :id="attribute.name"
          v-model="form[toCamelCase(attribute.name)]"
          :label="`${attribute.name}`"
          :placeholder="attribute.name"
          type="text"
          class="mm-mb-16"
          :errors="v$[toCamelCase(attribute.name)]?.$errors"
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
          :errors="v$[toCamelCase(attribute.name)]?.$errors"
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
          :datepicker-shortcuts="shortcutsForDatepickers.datetime"
          format="MMMM DD, YYYY"
          type="date"
          class="mm-mb-8"
          :required="attribute.required"
          errors-position="absolute"
          :errors="v$[toCamelCase(attribute.name)]?.$errors"
          :data-cy="toCamelCase(attribute.name)"
        />
      </template>

      <m-m-checkbox
        v-for="attribute in booleanAttributes"
        :id="attribute.name"
        :key="attribute.name"
        v-model="form[toCamelCase(attribute.name)]"
        :label="`${attribute.name}`"
        :errors="v$[toCamelCase(attribute.name)]?.$errors"
        :required="attribute.required"
        :cy="toCamelCase(attribute.name)"
        @change="validateFormByFields($event, toCamelCase(attribute.name))"
      >
        {{ attribute.name }}
      </m-m-checkbox>
    </form>

    <m-m-teleport to="onboarding-footer-next">
      <m-m-button
        id="next"
        is-full-width
        type="submit"
        form="update_organization"
        data-cy="button-continue"
        class="button-continue"
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        @click.prevent="submitForm"
      >
        Continue
      </m-m-button>
    </m-m-teleport>
  </template>

  <dialog-provide-consent
    :id="id"
    :is-open="isDialogProvideConsentOpen"
    :attributes="attributes"
    :name="name"
    provide-consents-to="organizations"
    @close="onCloseDialogProvideConsent"
    @submit="onSubmitDialogProvideConsent"
  />

  <dialog-confirm-discard-provide-consent
    :is-open="isDialogConfirmDiscardProvideConsentOpen"
    @close="onCloseDialogConfirmDiscardProvideConsent"
  />
</template>

<style scoped lang="scss">
.button-continue {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
</style>

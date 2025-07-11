<script setup lang="ts">
import {
  reactive,
  PropType,
  Ref,
  ComputedRef,
  ref,
  computed,
  onMounted,
} from "vue";
import { onboardingService } from "./onboarding.service";
import {
  Attributes,
  FormattedAttributes,
  OrganizationCreate,
  TypeCreateOrganizationForm,
  TypeCreateOrganizationFormRules,
  TypeValidatorCreateOrganization,
} from "~/onboarding/onboarding.types";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxLength } from "@vuelidate/validators";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { shortcutsForDatepickers } from "./constants";
import dayjs from "dayjs";
import {
  isValueFalsy,
  replaceInvalidValues,
  toCamelCase,
} from "~/mm_ui_kit/src/helpers/utils";
import { isValidUUID } from "~/mm_ui_kit/src/helpers/errorIDValidator";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { EnumDataType } from "~/attribute-types/types";
import { cloneDeep } from "lodash";
import { useEnterSubmit } from "~/mm_ui_kit/src/composables/useEnterSubmit";

const props = defineProps({
  id: { type: String, required: false, default: "" },
  name: { type: String, required: false, default: "" },
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
  auto_join_domain: { type: String, required: false, default: "" },
  auto_join_visible: { type: Boolean, required: true, default: false },
  auto_join_enabled: { type: Boolean, required: true, default: false },
  previous_callable: { type: Function, required: true },
  next_callable: { type: Function, required: true },
});
const brandingConfigStore = useBrandingConfigStore();

const isButtonSubmitLoading: Ref<boolean> = ref(false);
const initialAttributes = cloneDeep(props.attributes || []);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () => v$.value.$invalid || isButtonSubmitLoading.value,
);

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const isAutoJoinEnabled: ComputedRef<boolean> = computed(
  () => props.auto_join_visible && props.auto_join_enabled,
);

const form: TypeCreateOrganizationForm = reactive({
  name: props.name || props.auto_join_domain,
});

const formRules: TypeCreateOrganizationFormRules = reactive({});

const attributesFiltered: ComputedRef<Attributes> = computed(() =>
  cloneDeep(initialAttributes).filter((attribute) =>
    attribute.visible
      ? attribute.value === null || attribute.value === ""
      : false,
  ),
);

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

const v$: TypeValidatorCreateOrganization = useVuelidate(formRules, form);

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

  v$.value[fieldName].$touch();
};

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
  formRules.name = {
    required: helpers.withMessage("Organization name is required", required),
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

  if (v$.value.$invalid) {
    return;
  }
  try {
    isButtonSubmitLoading.value = true;
    const organizationData: OrganizationCreate = {
      name: form.name,
      auto_joined_enabled: isAutoJoinEnabled.value,
      attributes: replaceInvalidValues(formattedOrganizationAttributes.value),
    };
    if (!props.id) await onboardingService.createOrganization(organizationData);
    else await onboardingService.updateOrganization(organizationData, props.id);

    await props.next_callable();
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Error while creating organization",
      status: "error",
    });
  } finally {
    isButtonSubmitLoading.value = false;
  }
};

useEnterSubmit(v$, submitForm);

onMounted(() => {
  setFormRules();
  if (isSkipCurrentStage.value) {
    submitForm();
  }
});
</script>

<template>
  <template v-if="!isSkipCurrentStage">
    <m-m-teleport to="onboarding-previous-button">
      <m-m-button
        id="previous"
        is-full-width
        variant="transparent"
        data-cy="button-previous"
        icon-size="24px"
        prepend-icon="arrow-small-left"
        @click.prevent="previous_callable"
      />
    </m-m-teleport>
    <m-m-teleport to="onboarding-title">
      <div v-if="logoSrc" class="mm-mb-15 mm-mx-auto">
        <img :src="logoSrc" class="mm-auth-view-logo" />
      </div>
      <div v-sanitize-html="$t('onboarding.org_details.title')"></div>
    </m-m-teleport>
    <m-m-teleport to="onboarding-subtitle">
      <div v-sanitize-html="$t('onboarding.org_details.subtitle')"></div>
    </m-m-teleport>

    <form
      v-if="isFormReady"
      id="create_organization"
      v-mm-focus-first
      tabindex="0"
      data-cy="form-onboarding-organization-details"
      @submit.prevent="submitForm"
    >
      <m-m-input
        id="name"
        v-model="form.name"
        data-cy="input-organization-name"
        label="Organization name"
        placeholder="Enter the name of your Organization"
        type="text"
        class="mm-mb-16"
        required
        :errors="v$.name.$errors"
        @input="v$.name.$touch"
        @update:model-value="v$.name.$touch"
      />
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
          time-title-format="MMMM DD, YYYY"
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
        class="mm-mb-8"
        @change="validateFormByFields($event, toCamelCase(attribute.name))"
      >
        {{ attribute.name }}
      </m-m-checkbox>
      <m-m-teleport to="onboarding-footer-next">
        <m-m-button
          id="next"
          is-full-width
          type="submit"
          form="create_organization"
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
</template>
<style lang="scss" scoped>
.continue-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
</style>

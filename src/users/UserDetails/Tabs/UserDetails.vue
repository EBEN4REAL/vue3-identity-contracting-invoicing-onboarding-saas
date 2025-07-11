<script setup lang="ts">
import {
  ref,
  computed,
  PropType,
  reactive,
  onMounted,
  Ref,
  ComputedRef,
  watch,
} from "vue";
import { JOB_ROLES } from "~/common/constants";
import { TypeUpdateUserDetailsForm } from "../types";
import { organizationsService } from "~/organizations/organizations.service";
import {
  AttributeRead,
  OrganizationUnitRead,
  OrganizationUserRead,
  OrganizationUserUpdate,
} from "~/iam/iam.types";
import { authService } from "~/auth/auth.service";
import { TypeOrganizationUnitsWithParent } from "~/organizations/OrganizationUnits/types";
import { useRoute } from "vue-router";
import { OrganizationUserStatus } from "~/users/users.types";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";
import {
  pruneNonEditableAttributes,
  toSnakeCase,
} from "~/mm_ui_kit/src/helpers/utils";
import { isValidUUID } from "~/mm_ui_kit/src/helpers/errorIDValidator";
import {
  FormDataItem,
  OnboardingFormData,
} from "~/onboarding/onboarding.types";
import useVuelidate from "@vuelidate/core";
import { EnumDataType } from "~/attribute-types/types";
import { helpers } from "@vuelidate/validators";
import { shortcutsForDatepickers } from "~/onboarding/constants";
import dayjs from "dayjs";

const props = defineProps({
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: () => ({}),
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update"]);

const route = useRoute();

const defaultEmptyText = "Not added";

const booleanItemsForSelect = [
  {
    title: "Yes",
    value: true,
  },
  {
    title: "No",
    value: false,
  },
];

const organizationUnits: Ref<OrganizationUnitRead[]> = ref([]);
const isInEditMode = ref(false);
const isUserAllowedToEdit = ref(false);
const isSubmitButtonDisabled = ref(false);

const formattedAttributes: ComputedRef<AttributeRead[]> = computed(() => {
  return (props.user?.attributes ?? []).map((attr) => {
    if (attr.data_type !== "date" || typeof attr.value !== "string")
      return attr;

    const parsed = dayjs(attr.value, ["YYYY-MM-DD", "MMMM DD, YYYY"], true);
    return parsed.isValid()
      ? { ...attr, value: parsed.format("MMMM DD, YYYY") }
      : attr;
  });
});

const userDetails = computed((): TypeDataIteratorItem[] => {
  const details = [
    {
      label: "First name",
      text: props.user.first_name,
      isEmpty: !props.user.first_name,
      emptyText: defaultEmptyText,
    },
    {
      label: "Last name",
      text: props.user.last_name,
      isEmpty: !props.user.last_name,
      emptyText: defaultEmptyText,
    },
    {
      label: "Email address",
      text: props.user.email,
      isEmpty: !props.user.email,
      emptyText: defaultEmptyText,
    },
    {
      label: "Org unit",
      text: props.user?.unit?.name,
      isEmpty: !props.user?.unit?.name,
      emptyText: defaultEmptyText,
    },
    {
      label: "Job role",
      text: formatJobRole(props.user.job_role),
      isEmpty: !props.user.job_role,
      emptyText: defaultEmptyText,
    },
  ];
  if (formattedAttributes.value) {
    const generateBooleanText = (value: boolean) => {
      const foundBooleanItem = booleanItemsForSelect.find(
        (booleanItem) => booleanItem.value === value,
      );
      return foundBooleanItem?.title || "";
    };

    const generateText = (attribute: AttributeRead) => {
      switch (attribute.data_type) {
        case "boolean":
          return generateBooleanText(attribute.value as boolean);
        default:
          return attribute.value;
      }
    };

    const generateIsEmpty = (value: boolean | string | number): boolean =>
      Boolean(typeof value !== "boolean" && !value);

    details.push(
      ...formattedAttributes.value.map((attribute: AttributeRead) => ({
        key: toSnakeCase(attribute.name),
        label: attribute.name,
        text: generateText(attribute),
        isEmpty: generateIsEmpty(attribute.value),
      })),
    );
  }

  return details;
});

const formatJobRole = (jobRole: string | null | undefined) =>
  JOB_ROLES.find((JOB_ROLE) => JOB_ROLE.value === jobRole)?.title;

const form: TypeUpdateUserDetailsForm = reactive({
  organization_unit_id: props.user?.unit?.id,
  job_role: props.user?.job_role,
  first_name: props.user?.first_name,
  last_name: props.user?.last_name,
});

const isUserNameEditable: ComputedRef<boolean> = computed(
  () =>
    route.query.tab === "invites" &&
    props.user.status === OrganizationUserStatus.PENDING,
);

const organizationUnitsSelectPlaceholder = computed(() =>
  organizationUnits.value?.length
    ? "Select organization unit"
    : "No organization units found",
);

const isFormItemDisabled = (formItem: {
  disabled?: boolean;
  editable?: boolean;
}) => !!(formItem?.disabled || !formItem?.editable);

const onEnterEditMode = () => {
  isInEditMode.value = true;
};

const onExitEditMode = () => {
  isInEditMode.value = false;
};

const onFormDismiss = () => {
  onExitEditMode();
};

const checkUserAllowedToEdit = async () => {
  isUserAllowedToEdit.value = await authService.isUserOrgEditor();
};

const selectUnitOptionClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

const selectUnitOptionStyle = (level: number) => ({
  marginLeft: `${24 * level}px`,
});

const normaliseDateValues = () => {
  Object.values(formData).forEach((attr: FormDataItem) => {
    if (attr.data_type === "date" && attr.value) {
      const parsed = dayjs(attr.value);
      if (parsed.isValid()) {
        formOrganizationUserAttributes.value.attributes[attr.id] =
          parsed.format("YYYY-MM-DD");
      }
    }
  });
};

const onFormSubmit = async () => {
  isSubmitButtonDisabled.value = true;

  try {
    if (props.user.organization?.id) {
      if (form.organization_unit_id == "-1") {
        form.organization_unit_id = null;
      }
      normaliseDateValues();
      form.attributes = pruneNonEditableAttributes(
        formOrganizationUserAttributes.value.attributes,
        formData,
      );
      const updatedUser = await organizationsService.updateOrganizationUser(
        props.user.organization?.id,
        props.user.user_id,
        form,
      );
      emit("update", updatedUser);
      onExitEditMode();
    }
  } catch (error) {
    throw error;
  } finally {
    isSubmitButtonDisabled.value = false;
  }
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
            level?: number;
          } = { ...unit, level };
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

const onBlur = (key: string) => {
  if (v$.value[key]?.$dirty) v$.value[key].$touch();
};

const formData: OnboardingFormData = reactive({});

const formOrganizationUserAttributes: ComputedRef<OrganizationUserUpdate> =
  computed(() => {
    const generatedAttributes = Object.keys(formData).reduce(
      (acc, key) => {
        if (
          formData[key]?.value !== undefined &&
          formData[key]?.value !== null &&
          formData[key]?.isAttribute
        ) {
          acc[formData[key].id] = formData[key].value;
          if (
            formData[key].data_type === "boolean" ||
            formData[key].data_type === "enum"
          ) {
            acc[formData[key].id] = formData[key].value.value;
          }
        }
        return acc;
      },
      {} as Record<string, never> | null,
    );
    return {
      attributes:
        Object.keys(generatedAttributes).length === 0
          ? null
          : generatedAttributes,
    } as OrganizationUserUpdate;
  });

const formRules = reactive({});

const v$ = useVuelidate(formRules, formData);

const setFormData = () => {
  formattedAttributes.value?.forEach((attribute) => {
    const attributeKey = toSnakeCase(attribute.name);

    formData[attributeKey] = {
      ...attribute,
      placeholder: attribute.name,
      isAttribute: true,
    };

    if (attribute.data_type === "boolean") {
      formData[attributeKey].value = booleanItemsForSelect.find(
        (booleanItem) => booleanItem.value === attribute.value,
      );
    }

    if (attribute.data_type === "enum") {
      formData[attributeKey].value = {
        title: attribute.value,
        value: attribute.value,
      };
    }
  });
};

const setFormRules = () => {
  if (!formattedAttributes.value) return;

  formattedAttributes.value.forEach((attribute) => {
    const formDataItemName = toSnakeCase(attribute.name);

    formRules[formDataItemName] = {};

    if (attribute.data_type === EnumDataType.UUID && attribute?.required) {
      formRules[formDataItemName].required = helpers.withMessage(
        `${attribute.name} should be correct UUID`,
        () => {
          const value =
            formOrganizationUserAttributes.value.attributes[attribute.id];
          return value ? isValidUUID(`${value}`) : true;
        },
      );
    }

    const { min_length, max_length } = attribute.restrictions || {};
    if (min_length) {
      formRules[formDataItemName].minLength = helpers.withMessage(
        `${attribute.name} must be at least ${min_length} characters long`,
        () => {
          const value =
            formOrganizationUserAttributes.value.attributes[attribute.id];
          return value ? value.length >= min_length : true;
        },
      );
    }
    if (max_length) {
      formRules[formDataItemName].maxLength = helpers.withMessage(
        `${attribute.name} must be at most ${max_length} characters long`,
        () => {
          const value =
            formOrganizationUserAttributes.value.attributes[attribute.id];
          return value ? value.length <= max_length : true;
        },
      );
    }
  });
};

const generateMultiselectOptionsForEnum = (formItem: FormDataItem) =>
  formItem?.restrictions?.options || formItem?.options || [];

watch(
  () => formData,
  (newFormData) => {
    Object.entries(newFormData).forEach(([formDataItemName, attribute]) => {
      if (attribute?.data_type === "uuid") {
        const hasValue =
          typeof attribute.value === "string" && attribute.value.length > 0;

        if (hasValue || attribute.required) {
          if (!formRules[formDataItemName]) {
            formRules[formDataItemName] = {};
          }

          formRules[formDataItemName].required = helpers.withMessage(
            `${attribute.name} should be a valid UUID`,
            () =>
              hasValue ? isValidUUID(attribute.value) : !attribute.required,
          );
        } else {
          formRules[formDataItemName] = {};
        }
        v$.value?.[formDataItemName]?.$touch();
      }
    });
  },
  { deep: true },
);

onMounted(async () => {
  await checkUserAllowedToEdit();
  if (props.user.organization?.id) {
    organizationUnits.value = await organizationsService.getOrganizationUnits(
      props.user.organization.id,
    );
  }
  setFormData();
  setFormRules();
});
</script>

<template>
  <div class="mm-flex mm-flex-justify-end">
    <m-m-button
      v-if="!isInEditMode"
      variant="outlined"
      size="small"
      prepend-icon="pencil"
      class="mm-ml-auto mm-mb-10"
      cy="button-edit-organization-user"
      :is-disabled="isSCViewerOnly"
      @click="onEnterEditMode"
    >
      Edit
    </m-m-button>
    <template v-else>
      <div
        class="mm-flex mm-flex-justify-end mm-flex-align-center mm-flex-grow mm-flex-gap-6 mm-mb-10"
      >
        <m-m-button
          variant="outlined"
          type="reset"
          size="small"
          cy="button-dismiss"
          @click="onFormDismiss"
        >
          Dismiss
        </m-m-button>
        <m-m-button
          variant="elevated"
          type="submit"
          size="small"
          :is-disabled="isSubmitButtonDisabled"
          cy="button-save-changes"
          @click="onFormSubmit"
        >
          Save changes
        </m-m-button>
      </div>
    </template>
  </div>
  <m-m-data-iterator
    v-if="!isInEditMode"
    :data="userDetails"
    cy-id-text="user-detail-item-text"
    cy-id-text-empty="user-detail-item-text-empty"
    columns="2"
  />
  <m-m-card v-if="isInEditMode" data-cy="edit-mode">
    <form
      v-mm-focus-first
      class="mm-pa-12 mm-grid mm-grid-columns-2 mm-grid-row-gap-12 mm-grid-column-gap-16"
    >
      <m-m-input
        v-model="form.first_name"
        placeholder="Enter First Name"
        label="First name"
        cy="input-name"
        :disabled="!isUserNameEditable"
      />
      <m-m-input
        v-model="form.last_name"
        placeholder="Enter Last Name"
        label="Last name"
        cy="input-last-name"
        :disabled="!isUserNameEditable"
      />
      <m-m-input
        :model-value="user.email"
        placeholder="Enter email address"
        label="Email address"
        cy="input-email-address"
        disabled
      />
      <m-m-select
        v-model="form.organization_unit_id"
        cy="select-organization_unit_id"
        :data-select-value="form.organization_unit_id"
        :items="organizationUnitsWithLevels"
        :disabled="!organizationUnits?.length"
        item-title="name"
        item-value="id"
        label="Organization unit"
        :placeholder="organizationUnitsSelectPlaceholder"
      >
        <template #option="{ item }">
          <div
            :style="selectUnitOptionStyle(item.level)"
            :class="selectUnitOptionClassList(item.disabled)"
          >
            {{ item.name }}
          </div>
        </template>
      </m-m-select>
      <m-m-select
        v-model="form.job_role"
        cy="select-job_role"
        :data-select-value="form.job_role"
        :items="JOB_ROLES"
        label="Job role"
      />
      <div v-for="(formItem, key) in formData" :key="key">
        <m-m-input
          v-if="
            formItem.data_type === 'string' || formItem?.data_type === 'uuid'
          "
          v-model="formItem.value"
          :disabled="isFormItemDisabled(formItem)"
          :label="formItem?.name"
          :placeholder="formItem.placeholder"
          :errors="v$[key]?.$errors"
          @update:model-value="v$[key]?.$touch"
        />
        <m-m-multiselect
          v-if="formItem.data_type === 'enum'"
          v-model="formItem.value"
          :options="generateMultiselectOptionsForEnum(formItem)"
          :is-multiselect-disabled="isFormItemDisabled(formItem)"
          :label="formItem?.name"
          :placeholder="formItem.placeholder"
          :errors="v$[key]?.$errors"
          @blur="onBlur(key)"
        />
        <m-m-multiselect
          v-if="formItem.data_type === 'boolean'"
          v-model="formItem.value"
          :options="booleanItemsForSelect"
          :is-multiselect-disabled="isFormItemDisabled(formItem)"
          :label="formItem?.name"
          :placeholder="formItem.placeholder"
          :errors="v$[key]?.$errors"
          @blur="onBlur(key)"
        />
        <template v-if="formItem.data_type === 'date'">
          <m-m-field-label :label="formItem.name" />
          <m-m-datepicker
            v-model="formItem.value"
            :is-disabled="isFormItemDisabled(formItem)"
            placeholder="Select date"
            :datepicker-shortcuts="shortcutsForDatepickers.datetime"
            time-title-format="MMMM DD, YYYY"
            format="MMMM DD, YYYY"
            type="date"
            errors-position="absolute"
            :errors="v$[key]?.$errors"
          />
        </template>
      </div>
    </form>
  </m-m-card>
</template>

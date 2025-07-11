<script lang="ts" setup>
import { ref, reactive, Ref, PropType } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import {
  TypeCreateSuborganizationForm,
  TypeCreateSuborganizationRules,
  TypeValidatorCreateSuborganization,
} from "~/organizations/organizations.types";
import { OrganizationRead } from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import { RANGE_OF_EMPLOYEES, INDUSTRIES } from "~/common/constants";

const form = reactive<TypeCreateSuborganizationForm>({
  name: "",
  email: "",
  industry: null,
  number_of_employees_range: null,
});

const formRules: TypeCreateSuborganizationRules = {
  name: {
    required: helpers.withMessage("Name required", required),
  },
  email: {
    required: helpers.withMessage("Email required", required),
    email: helpers.withMessage("Check the format of email address", email),
  },
};

const v$: TypeValidatorCreateSuborganization = useVuelidate(formRules, form);

const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const isSaving: Ref<boolean> = ref(false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
  },
});

const emit = defineEmits(["close", "submit"]);

const submitForm = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    const orgId = props.organization?.id;
    if (!orgId) {
      return;
    }

    isSaving.value = true;
    await organizationsService.createSubOrganization(orgId, {
      organization: {
        name: form.name,
        industry: form.industry,
        number_of_employees_range: form.number_of_employees_range,
      },
      user: {
        email: form.email,
      },
    });

    emit("submit");
    isSaving.value = false;
    closeModal();
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value = error.response.data;
  }
};

const resetForm = () => {
  setTimeout(() => {
    form.name = "";
    form.email = "";
    form.industry = null;
    form.number_of_employees_range = null;
    form.description = "";
    isAlertVisible.value = false;
    alertText.value = "";
  }, 100);
  v$.value.$reset();
};
const onBlur = (key: string) => {
  if (v$.value[key].$dirty) v$.value[key].$touch();
};
const closeModal = () => {
  resetForm();
  emit("close");
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Create sub-organization"
    subtitle="Enter the following details to create a sub-organization"
    icon="organization-create"
    icon-size="24px"
    @close="closeModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="create-suborg-form-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ alertText }}
      </m-m-alert>
      <form
        v-mm-focus-first
        class="mm-page-dialog-form"
        data-cy="create-suborg-dialog"
      >
        <div>
          <m-m-input
            v-model="form.name"
            label="Name of the sub-organization"
            :errors="v$.name.$errors"
            required
            cy="create-suborg-name"
            @blur="onBlur('name')"
            @submit="submitForm"
          />
        </div>
        <div>
          <m-m-input
            v-model="form.email"
            label="Email address"
            type="email"
            required
            :errors="v$.email.$errors"
            cy="create-suborg-email"
            @blur="onBlur('email')"
            @submit="submitForm"
          />
        </div>
        <div>
          <m-m-select
            v-model="form.industry"
            :data-select-value="form.industry"
            :items="INDUSTRIES"
            label="Industry"
            placeholder="Select industry"
            item-title="title"
            item-value="value"
            cy="create-suborg-industry"
          />
        </div>
        <div>
          <m-m-select
            v-model="form.number_of_employees_range"
            :data-select-value="form.number_of_employees_range"
            :items="RANGE_OF_EMPLOYEES"
            label="Number of employees"
            placeholder="Select number of employees"
            item-title="title"
            item-value="value"
            cy="create-suborg-employees-num"
          />
        </div>
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal"> Dismiss </m-m-button>
      <m-m-button
        variant="elevated"
        data-cy="create-suborg-submit-button"
        :loading="isSaving"
        @click="submitForm"
      >
        Create sub-organization
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

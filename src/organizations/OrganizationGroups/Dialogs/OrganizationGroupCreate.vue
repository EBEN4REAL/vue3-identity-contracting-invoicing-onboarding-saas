<script lang="ts" setup>
import { ref, reactive, Ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxLength } from "@vuelidate/validators";
import {
  TypeCreateOrganizationGroupForm,
  TypeValidatorCreateOrganizationGroup,
} from "~/organizations/organizations.types";
import { TypeEditOrganizationGroupFormRules } from "~/organizations/OrganizationGroups/types";
import { organizationsService } from "~/organizations/organizations.service";

const form = reactive<TypeCreateOrganizationGroupForm>({
  name: "",
  description: "",
});

const formRules: TypeEditOrganizationGroupFormRules = {
  name: {
    required: helpers.withMessage(
      "Organization group name is required",
      required,
    ),
    maxLength: helpers.withMessage(
      "Organization group name is too long",
      maxLength(256),
    ),
  },
  description: {
    maxLength: helpers.withMessage(
      "Organization group description is too long",
      maxLength(256),
    ),
  },
};

const v$: TypeValidatorCreateOrganizationGroup = useVuelidate(formRules, form);

const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const isSaving: Ref<boolean> = ref(false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  organizationId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);

const submitForm = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    if (!props.organizationId) {
      return;
    }

    isSaving.value = true;
    await organizationsService.createOrganizationGroup({
      name: form.name,
      description: form.description,
    });

    emit("submit");
    isSaving.value = false;
    closeModal();
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value = error.response.data;
    isSaving.value = false;
  }
};
const onBlur = (key: string) => {
  if (v$.value[key].$dirty) v$.value[key].$touch();
};
const resetForm = () => {
  setTimeout(() => {
    form.name = "";
    form.description = "";
    isAlertVisible.value = false;
    alertText.value = "";
  }, 100);
  v$.value.$reset();
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
    title="Create group"
    subtitle="Create a new group to manage your users"
    icon="user-group-create"
    cy="create-group-dialog"
    icon-size="25px"
    @close="closeModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="create-group-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ alertText }}
      </m-m-alert>
      <form
        v-mm-focus-first
        class="mm-page-dialog-form"
        data-cy="create-group-dialog"
        @submit.prevent="submitForm"
      >
        <m-m-input
          v-model="form.name"
          label="Name of the group"
          :errors="v$.name.$errors"
          required
          placeholder="Enter Group Name"
          cy="create-group-name"
          @blur="onBlur('name')"
        />
        <m-m-input
          v-model="form.description"
          label="Description"
          inputmode="textarea"
          :errors="v$.description.$errors"
          placeholder="Write something about this group..."
          cy="create-group-description"
          @blur="onBlur('description')"
        />
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal"> Dismiss </m-m-button>
      <m-m-button
        variant="elevated"
        cy="create-group-submit-button"
        :loading="isSaving"
        prepend-icon="plus-white"
        @click="submitForm"
      >
        Create group
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

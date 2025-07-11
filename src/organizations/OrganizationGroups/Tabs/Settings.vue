<script lang="ts" setup>
import { computed, ComputedRef, PropType, reactive, ref } from "vue";
import { OrganizationGroupRead } from "~/iam/iam.types";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";
import {
  TypeEditOrganizationGroupForm,
  TypeEditOrganizationGroupFormRules,
  TypeValidatorEditOrganizationGroupForm,
} from "~/organizations/OrganizationGroups/types";
import { helpers, maxLength, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { organizationsService } from "~/organizations/organizations.service";
import { onMounted, Ref } from "vue";
import { authService } from "~/auth/auth.service";

const emit = defineEmits(["update"]);

const props = defineProps({
  group: {
    type: Object as PropType<OrganizationGroupRead>,
    default: null,
    required: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
  canDeleteOrEditGroup: {
    type: Boolean,
    default: false,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(false);
const isInEditMode = ref(false);
const isAlertVisible = ref(false);
const alertText = ref("");
const isOrgAdmin: Ref<boolean> = ref(false);
const isOrgEditor: Ref<boolean> = ref(false);

const form: TypeEditOrganizationGroupForm = reactive({
  name: props.group?.name,
  description: props.group?.description,
});

const isButtonEditDisabled: ComputedRef<boolean> = computed(
  () => !props.canDeleteOrEditGroup || props.isSCViewerOnly,
);

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

const v$: TypeValidatorEditOrganizationGroupForm = useVuelidate(
  formRules,
  form,
);

const details: ComputedRef<TypeDataIteratorItem[]> = computed(() => [
  {
    key: "name",
    label: "Group name",
    text: props.group.name,
  },
  {
    key: "description",
    label: "Group description",
    text: props.group.description,
    isEmpty: !Boolean(props.group.description),
  },
]);

const resetForm = () => {
  form.name = props.group?.name;
  form.description = props.group?.description;
};

const toggleEditMode = () => {
  isInEditMode.value = !isInEditMode.value;
};

const onFormSubmit = async () => {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      form.description = form.description || null;

      const updatedOrganizationGroup: OrganizationGroupRead =
        await organizationsService.updateOrganizationGroup(
          form,
          props.organizationId as string,
          props.group.id,
        );

      emit("update", updatedOrganizationGroup);
      toggleEditMode();
      loading.value = false;
    } catch (error) {
      if (error?.response?.status === 409) {
        isAlertVisible.value = true;
        alertText.value = "This group name is already in use";
      }
      loading.value = false;
    }
  }
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  isOrgAdmin.value = await authService.isUserOrgAdmin();
  isOrgEditor.value = await authService.isUserOrgEditor();
});
</script>

<template>
  <div v-if="!isInEditMode" class="mm-flex mm-flex-justify-end">
    <m-m-button
      size="small"
      variant="outlined"
      class="mm-ml-auto mm-mb-10"
      :is-disabled="isButtonEditDisabled"
      prepend-icon="pencil"
      cy="button-edit-organization-group"
      @click="toggleEditMode"
    >
      Edit
    </m-m-button>

    <m-m-tooltip
      v-if="isButtonEditDisabled"
      display-position="toLeft"
      max-width="300px"
    >
      You can't edit this group
    </m-m-tooltip>
  </div>
  <div
    v-else
    class="mm-flex mm-flex-justify-end mm-flex-align-center mm-flex-grow mm-flex-gap-6 mm-mb-8 mm-group-details-header"
  >
    <m-m-button
      variant="outlined"
      type="reset"
      size="small"
      data-cy="button-dismiss"
      @click="
        resetForm();
        toggleEditMode();
      "
    >
      Cancel
    </m-m-button>
    <m-m-button
      variant="elevated"
      type="submit"
      size="small"
      :loading="loading"
      data-cy="button-save-changes"
      @click="onFormSubmit"
    >
      Save
    </m-m-button>
  </div>
  <m-m-data-iterator v-if="!isInEditMode" :data="details" :columns="1" />
  <m-m-card v-if="isInEditMode" data-cy="organization-unit-edit-mode">
    <form v-mm-focus-first class="mm-pa-12 mm-grid mm-grid-row-gap-12">
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="alert-group-update"
        @close="onAlertClose"
      >
        {{ alertText }}
      </m-m-alert>
      <m-m-input
        v-if="form.name !== null"
        v-model="form.name"
        label="Group name"
        required
        placeholder="Group name"
        cy="input-group-name"
        :errors="v$.name.$errors"
        @blur="v$.name.$touch"
      />
      <m-m-input
        v-model="form.description"
        label="Group description"
        placeholder="Group description"
        inputmode="textarea"
        cy="input-group-description"
        :errors="v$.description.$errors"
        @blur="v$.description.$touch"
      />
    </form>
  </m-m-card>
</template>

<style lang="scss"></style>

<script setup lang="ts">
import {
  PropType,
  ref,
  computed,
  Ref,
  ComputedRef,
  watch,
  reactive,
} from "vue";
import { OrganizationRead } from "~/iam/iam.types";
import {
  TypeDeleteOrganizationForm,
  TypeDeleteOrganizationFormRules,
  TypeValidatorDeleteOrganization,
} from "../organizations.types";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useFlag } from "@unleash/proxy-client-vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  organization: {
    type: Object as PropType<{ name: string; id: string } | null>,
    default: null,
  },
  orgToBeDeleted: {
    type: Object as PropType<OrganizationRead | null>,
    default: null,
  },
  isDeletionGenerated: {
    type: Boolean,
    default: false,
  },
});

const isOrganizationDeletionCode = useFlag("org_deletion_code");

const emit = defineEmits([
  "close",
  "delete",
  "handleDeleteSubmit",
  "getDeletionCode",
]);
const isButtonSubmitLoading: Ref<boolean> = ref(false);

const form: TypeDeleteOrganizationForm = reactive({
  code: "",
});

const formRules: ComputedRef<TypeDeleteOrganizationFormRules> = computed(
  () => ({
    code: {
      ...(isOrganizationDeletionCode.value
        ? { required: helpers.withMessage("Code is required", required) }
        : {}),
    },
  }),
);

const v$: TypeValidatorDeleteOrganization = useVuelidate(formRules, form);

const isOrganizationDeletionGenerated: ComputedRef<boolean> = computed(
  () => props.isDeletionGenerated && isOrganizationDeletionCode.value,
);

const title: ComputedRef<string> = computed(
  () => `Remove ${props.orgToBeDeleted?.name}`,
);

const subtitle: ComputedRef<string> = computed(() =>
  isOrganizationDeletionCode.value
    ? `If you want to continue, you will receive an email for a final confirmation of the deletion of ${props.orgToBeDeleted?.name} from Veriam.`
    : `Are you sure you want to delete ${props.orgToBeDeleted?.name} organization? All data will be lost.`,
);

const deleteText: ComputedRef<string> = computed(() =>
  isOrganizationDeletionCode.value ? `Continue` : "Yes, remove",
);

const handleDeleteSubmit = () => {
  if (
    props.isDeletionGenerated &&
    isOrganizationDeletionCode.value &&
    !v$.value.code.$invalid
  ) {
    emit("getDeletionCode", form.code);
  }
  emit("handleDeleteSubmit", true);
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      form.code = "";
    }
  },
  { immediate: true },
);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    :subtitle="subtitle"
    icon="warning"
    icon-color="error"
    cy="organization-unit-user-dialog-delete"
    @close="emit('close')"
  >
    <template #default>
      <m-m-input
        v-if="isOrganizationDeletionGenerated"
        v-model="form.code"
        placeholder="Enter code from email"
        label="Code"
        required
        :errors="v$.code.$errors"
        @input="v$.code.$touch"
      />
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button
          variant="outlined"
          cy="button-remove-user-from-unit-dismiss"
          @click="emit('close')"
        >
          Dismiss
        </m-m-button>
        <m-m-button
          :loading="isButtonSubmitLoading"
          variant="danger"
          cy="button-remove-user-from-unit-submit"
          @click="handleDeleteSubmit"
        >
          {{ deleteText }}
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

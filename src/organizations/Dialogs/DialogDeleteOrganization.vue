<script setup lang="ts">
import { PropType, ref, computed, Ref, ComputedRef, watch } from "vue";
import { organizationsService } from "~/organizations/organizations.service";
import {
  OrganizationRead,
  TypeDeleteOrganizationForMultiselect,
} from "~/iam/iam.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import DialogDeleteReplacementOrganizationConfirmation from "./DialogDeleteReplacementOrganizationConfirmation.vue";
import { showToast } from "~/mm_ui_kit/src/composables/useToast";
import { TypeToastStatuses } from "~/mm_ui_kit/src/types/toast.types";
import { useFlag } from "@unleash/proxy-client-vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  organization: {
    type: Object as PropType<OrganizationRead | null>,
    default: null,
  },
});

const emit = defineEmits(["close", "delete"]);

const isOrganizationDeletionCode = useFlag("org_deletion_code");

const isButtonSubmitLoading: Ref<boolean> = ref(false);
const orgDeletionCode: Ref<string | ""> = ref("");
const isDeletionGenerated: Ref<boolean> = ref(false);
const isDialogDeleteReplacementOrganizationConfirmationOpen: Ref<boolean> =
  ref(false);
const isGetOrganizationsLoading: Ref<boolean> = ref(false);
const organizations: Ref<TableResponse<OrganizationRead> | null> = ref(null);
const organizationSearch: Ref<string> = ref("");
const selectedReplacementOrganization: Ref<{
  name: string;
  id: string;
} | null> = ref(null);

const title: ComputedRef<string> = computed(
  () => `Remove ${props.organization?.name}`,
);

const subtitle: ComputedRef<string> = computed(
  () =>
    `You can optionally select a replacement organization for ${props.organization?.name} if you wish to merge all contents from ${props.organization?.name} with the replacement organization.`,
);

const totalOrganizations: ComputedRef<number> = computed(
  () => organizations.value?.total || 0,
);

const organizationsForMultiselect: ComputedRef<
  TypeDeleteOrganizationForMultiselect[]
> = computed(
  () =>
    organizations.value?.results?.map((organization) => {
      const isSameOrganization = organization.id === props.organization?.id;
      const isServiceProviderMatching =
        organization?.is_service_provider ===
        props.organization?.is_service_provider;

      let disabledText = "";
      if (isSameOrganization) {
        disabledText = "Can't use the same organization";
      } else if (!isServiceProviderMatching) {
        disabledText = "Can't use this organization";
      }

      return {
        id: organization.id,
        name: organization.name,
        disabledText,
        $isDisabled: isSameOrganization || !isServiceProviderMatching,
      };
    }) ?? [],
);

const onSearchChange = (value: string) => {
  organizationSearch.value = value;
};

const onDialogDeleteReplacementOrganizationConfirmationClose = () => {
  isDialogDeleteReplacementOrganizationConfirmationOpen.value = false;
};

const getOrganizations = async (params: TableRequestParams) => {
  try {
    isGetOrganizationsLoading.value = true;
    organizations.value = await organizationsService.getOrganizations(params);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching organizations",
      status: "error",
    });
  } finally {
    isGetOrganizationsLoading.value = false;
  }
};

const onDialogDeleteReplacementOrganizationConfirmationOpen = () => {
  isDialogDeleteReplacementOrganizationConfirmationOpen.value = true;
};

const deleteOrganization = async () => {
  isDialogDeleteReplacementOrganizationConfirmationOpen.value = false;
  isButtonSubmitLoading.value = true;
  try {
    const response = await organizationsService.deleteOrganization(
      props.organization?.id ?? "",
      orgDeletionCode.value,
      selectedReplacementOrganization.value?.id ?? "",
    );
    if (response.status === 201 && isOrganizationDeletionCode.value) {
      isDeletionGenerated.value = true;
      isDialogDeleteReplacementOrganizationConfirmationOpen.value = true;
    } else {
      emit("delete");
      emit("close");
    }
    showToast({
      text: `${response.status === 201 && isOrganizationDeletionCode.value ? "Organization deletion code generated" : "Organization deletion operation started successfully"}`,
      status: `${response.status === 201 && isOrganizationDeletionCode.value ? "info" : "success"}`,
    });
  } catch (error) {
    showToast({
      text: "Error deleting organization",
      status: TypeToastStatuses.Error,
    });
  } finally {
    isButtonSubmitLoading.value = false;
  }
};

const getOrganizationDeletionCode = async (code: string) =>
  (orgDeletionCode.value = code);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      selectedReplacementOrganization.value = null;
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
      <form
        v-mm-focus-first
        class="mm-page-dialog-form"
        data-cy="assign-license-form"
      >
        <div>
          <form v-mm-focus-first class="mm-page-dialog-form">
            <m-m-multiselect
              ref="multiselectRef"
              v-model="selectedReplacementOrganization"
              :options="organizationsForMultiselect"
              :total="totalOrganizations"
              label="Replacement organization"
              item-value="id"
              item-title="name"
              :loading="isGetOrganizationsLoading"
              searchable
              @search-change="onSearchChange"
              @update-params="getOrganizations"
            />
          </form>
        </div>
      </form>
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
          :is-disabled="isButtonSubmitLoading"
          variant="elevated"
          cy="button-remove-user-from-unit-submit"
          @click="onDialogDeleteReplacementOrganizationConfirmationOpen"
        >
          Continue
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>

  <dialog-delete-replacement-organization-confirmation
    :is-open="isDialogDeleteReplacementOrganizationConfirmationOpen"
    :org-to-be-deleted="organization"
    :organization="selectedReplacementOrganization"
    :is-deletion-generated="isDeletionGenerated"
    :is-organization-deletion-code="isOrganizationDeletionCode"
    @close="onDialogDeleteReplacementOrganizationConfirmationClose"
    @handle-delete-submit="deleteOrganization"
    @get-deletion-code="getOrganizationDeletionCode"
  />
</template>

<style scoped lang="scss"></style>

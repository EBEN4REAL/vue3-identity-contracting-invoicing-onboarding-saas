<script setup lang="ts">
import { computed, watch, ref, Ref } from "vue";
import { OrganizationUserRead } from "~/iam/iam.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import { organizationsService } from "~/organizations/organizations.service";
import { policiesService } from "~/service-providers/policies.service";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { GetServiceProvidersRequest } from "~/service-providers/service-providers.service";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  organizationId: {
    type: String,
    default: "",
  },
  agreementId: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "updateContact"]);
const isLoading: Ref<boolean> = ref(false);
const user: Ref<string> = ref("");
const isSubmitButtonDisabled: Ref<boolean> = ref(true);
const isSubmitButtonLoading: Ref<boolean> = ref(false);
const usersList: Ref<TableResponse<OrganizationUserRead> | null> = ref(null);

const resetForm = () => {
  user.value = "";
};

const onDialogClose = () => {
  emit("close");
  resetForm();
};

const onSubmit = async () => {
  try {
    isSubmitButtonDisabled.value = true;
    isSubmitButtonLoading.value = true;
    await policiesService.updateContact(
      props.organizationId,
      props.agreementId,
      { contact_organization_user_id: user.value },
    );
    emit("updateContact", user.value);
    onDialogClose();
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to update contact",
      status: "error",
    });
  } finally {
    isSubmitButtonDisabled.value = false;
    isSubmitButtonLoading.value = false;
  }
};

const getUsers = async (params?: GetServiceProvidersRequest) => {
  isLoading.value = true;

  usersList.value = await organizationsService.getOrganizationUsers(
    props.organizationId,
    params,
  );

  isLoading.value = false;
};

const usersMapped = computed(() => {
  return usersList?.value?.results.map((user) => ({
    value: user.id,
    name:
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email,
    email: user.email,
    disabled: user.id === props.userId,
  }));
});

const selectUserOptionClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      getUsers();
    }
  },
  { immediate: true },
);

watch(
  () => user.value,
  () => {
    isSubmitButtonDisabled.value = !Boolean(user.value.length);
  },
);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Select user"
    icon="user"
    cy="dialog-billing-contact"
    @close="onDialogClose"
  >
    <template #default
      ><div>
        <m-m-autocomplete
          v-model="user"
          cy="org-users"
          :items="usersMapped"
          :total-items="usersList?.total"
          item-title="name"
          item-value="value"
          label="Select user"
          placeholder="Click to select user"
          :loading="isLoading"
          @update-params="getUsers"
        >
          <template #option="{ item }">
            <div class="mm-flex mm-flex-justify-between mm-w-10">
              <div :class="selectUserOptionClassList(item.disabled)">
                <div class="mm-flex mm-flex-column">
                  {{ item.name }}
                  <div class="mm-page-option-secondary">
                    {{ item.email }}
                  </div>
                </div>
                <div
                  v-if="item.disabled"
                  class="mm-flex mm-flex-justify-between mm-flex-grow"
                >
                  <m-m-badge
                    class="mm-ml-3"
                    :status="BadgeTypes.Inactive"
                    text="Already added"
                    cy="badge-added"
                  />
                  <m-m-icon icon="check-thin-primary" width="12px" />
                </div>
              </div>
            </div>
          </template>
        </m-m-autocomplete></div
    ></template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button
          variant="outlined"
          color="gray"
          cy="button-close-dialog"
          @click="onDialogClose"
        >
          Cancel
        </m-m-button>
        <m-m-button
          cy="button-add-user"
          :loading="isSubmitButtonLoading"
          :disabled="isSubmitButtonDisabled"
          @click="onSubmit"
        >
          Add user
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { computed, PropType, Ref, ref, ComputedRef, watch } from "vue";
import { TypeDialogAddUserToGroupsData } from "~/users/OrganizationUsers/Tabs/Users/types";
import { organizationsService } from "~/organizations/organizations.service";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { OrganizationGroupRead } from "~/iam/iam.types";
import { ITEMS_PER_PAGE } from "~/common/constants";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<TypeDialogAddUserToGroupsData>,
    default: null,
  },
});

const emit = defineEmits(["close", "update", "remove-from-group"]);

const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isButtonSubmitDisabled: Ref<boolean> = ref(true);
const isAlertVisible = ref(false);
const organizationGroups: Ref<TableResponse<OrganizationGroupRead>> = ref(null);
const groupsValue: Ref<string[]> = ref([]);
const userGroups: Ref<TableResponse<OrganizationGroupRead>> = ref(null);

const fullName = computed(() => {
  if (props.data?.first_name && props.data?.last_name) {
    return `${props.data?.first_name} ${props.data?.last_name}`;
  } else if (props.data?.email) {
    return props.data?.email;
  } else {
    return "No name";
  }
});

const updatedUserGroups: ComputedRef<OrganizationGroupRead[]> = computed(() => {
  const groupIdsToCheck = new Set(
    userGroups.value?.results.map((group) => group.id),
  );

  return (
    organizationGroups.value?.results.map((group) => ({
      ...group,
      disabled: groupIdsToCheck.has(group.id),
    })) || []
  );
});

const title = computed(() => `Add ${fullName.value} to group(s)`);

const subtitle = computed(() => `Select one or more groups`);

const iconInitials = computed(() => {
  if (props.data?.first_name && props.data?.last_name) {
    return `initials-${props.data?.first_name?.at(0)}${props.data?.last_name?.at(0)}`;
  } else if (props.data?.email) {
    return `initials-${props.data?.email.slice(0, 2)}`;
  } else {
    return "NN";
  }
});

const selectGroupClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onDialogClose = async () => {
  groupsValue.value = [];
  emit("close");
  isButtonSubmitDisabled.value = false;
  isAlertVisible.value = false;
};

const submit = async () => {
  if (props.data?.organization?.id && props.data?.user_id) {
    isButtonSubmitLoading.value = true;
    isButtonSubmitDisabled.value = true;
    try {
      const organizationId = props.data.organization.id;
      const requests = groupsValue.value.map((groupId: string) =>
        organizationsService.addOrganizationUserToGroups(
          organizationId,
          groupId,
          [props.data.user_id],
        ),
      );

      await Promise.all(requests);
      onDialogClose();
      emit("update");
    } catch {
      isAlertVisible.value = true;
    } finally {
      isButtonSubmitDisabled.value = false;
      isButtonSubmitLoading.value = false;
    }
  }
};
const fetchOrganizationGroups = async () => {
  organizationGroups.value = await organizationsService.getOrganizationGroups(
    props.data.organization.id,
  );
};

const getOrganizationUserGroups = async (
  params: TableRequestParams = { limit: ITEMS_PER_PAGE[0], offset: "0" },
) => {
  const { organization, user_id } = props.data;

  if (organization?.id && user_id) {
    userGroups.value = await organizationsService.getOrganizationUserGroups(
      organization.id,
      user_id,
      params,
    );
  }
};

watch(
  () => props.isOpen,
  async (dialogOpen) => {
    const { organization, user_id } = props.data;

    if (dialogOpen) {
      if (user_id) {
        await getOrganizationUserGroups();
      }

      if (organization?.id) {
        await fetchOrganizationGroups();
      }
    }
  },
  { immediate: true },
);

watch(
  () => groupsValue.value,
  () => {
    isButtonSubmitDisabled.value = !Boolean(groupsValue.value.length);
  },
);

defineExpose({ fetchOrganizationGroups });
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    :subtitle="subtitle"
    :icon="iconInitials"
    cy="dialog-add-user-to-group"
    @close="onDialogClose"
  >
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      @close="onAlertClose"
    >
      Error occurred. Please, try again.
    </m-m-alert>
    <m-m-select
      v-model="groupsValue"
      :items="updatedUserGroups || []"
      item-value="id"
      item-title="name"
      multiple
      cy="select-multiple-add-user-to-group"
    >
      >
      <template #option="{ item }">
        <div class="mm-flex mm-flex-justify-between mm-w-10">
          <div :class="selectGroupClassList(item.disabled)">
            <div class="mm-flex mm-flex-column">
              {{ item.name }}
              <div class="mm-page-option-secondary">
                {{ item.description }}
              </div>
            </div>
            <div
              v-if="item.disabled"
              class="mm-flex mm-flex-justify-between mm-flex-grow"
            >
              <m-m-badge
                class="mm-ml-3"
                :status="BadgeTypes.Inactive"
                text="Already Added"
                cy="badge-added"
              />
              <m-m-icon icon="check-thin-primary" width="12px" />
            </div>
            <m-m-badge
              v-if="groupsValue.includes(item.id)"
              class="mm-ml-5"
              text="Selected"
              cy="badge-selected"
            />
          </div>
        </div>
      </template>
    </m-m-select>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" color="gray" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button
          cy="button-add-user-to-group"
          :is-disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          @click="submit"
        >
          Add
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

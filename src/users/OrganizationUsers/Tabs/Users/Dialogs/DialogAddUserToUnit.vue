<script setup lang="ts">
import { onMounted, computed, PropType, Ref, ref, watch } from "vue";
import { TypeDialogAddUserToUnitData } from "~/users/OrganizationUsers/Tabs/Users/types";
import { organizationsService } from "~/organizations/organizations.service";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { OrganizationUnitRead } from "~/iam/iam.types";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<TypeDialogAddUserToUnitData>,
    default: null,
  },
});

const emit = defineEmits(["close", "update"]);

const isAlertVisible = ref(false);
const isButtonSubmitDisabled: Ref<boolean> = ref(true);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const organizationUnits: Ref<OrganizationUnitRead[] | null> = ref(null);
const organizationUnitValue: Ref<string | null> = ref(
  props.data?.unit?.id || null,
);

watch(
  () => props.data?.unit?.id,
  () => {
    organizationUnitValue.value = props.data?.unit?.id || null;
  },
);

const fullName = computed(() => {
  if (props.data?.first_name && props.data?.last_name) {
    return `${props.data?.first_name} ${props.data?.last_name}`;
  } else if (props.data?.email) {
    return props.data?.email;
  } else {
    return "No Name";
  }
});

const title = computed(() => `Add ${fullName.value} to organization unit`);

const subtitle = computed(
  () => `Select the organization unit to add this user`,
);

const iconInitials = computed(() => {
  if (props.data?.first_name && props.data?.last_name) {
    return `initials-${props.data?.first_name?.at(0)}${props.data?.last_name?.at(0)}`;
  } else if (props.data?.email) {
    return `initials-${props.data?.email.slice(0, 2)}`;
  } else {
    return "NN";
  }
});

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onDialogClose = () => {
  emit("close");
  isButtonSubmitLoading.value = false;
  isAlertVisible.value = false;
};

const submit = async () => {
  if (
    props.data?.organization?.id &&
    props.data?.user_id &&
    organizationUnitValue.value
  ) {
    try {
      isButtonSubmitDisabled.value = true;
      isButtonSubmitLoading.value = true;
      await organizationsService.addOrganizationUnitUsers(
        props.data.organization.id,
        organizationUnitValue.value,
        [props.data.user_id],
      );
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

watch(
  () => organizationUnitValue.value,
  () => (isButtonSubmitDisabled.value = !Boolean(organizationUnitValue.value)),
);

onMounted(async () => {
  if (props.data?.organization?.id) {
    organizationUnits.value = await organizationsService.getOrganizationUnits(
      props.data.organization.id,
    );
  }
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    :subtitle="subtitle"
    :icon="iconInitials"
    cy="dialog-add-user-to-unit"
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
      v-if="organizationUnits"
      v-model="organizationUnitValue"
      :items="organizationUnits"
      item-value="id"
      item-title="name"
      cy="select-organization-unit"
    />
    <m-m-alert status="warning" :is-closable="false" class="mm-mt-10 bordered">
      <div class="mm-page-title--h4 font-weight-600 mm-mb-2">
        User will be removed from their current Organization Unit
      </div>
      <div class="mm-page-subtitle--h2">
        Assigning users to an organization will remove them from the current
        one. Learn more
      </div>
    </m-m-alert>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" color="gray" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button
          prepend-icon="plus-white"
          :is-disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          cy="button-submit-add-to-organization-unit"
          @click="submit"
        >
          Add to organizational unit
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
.bordered {
  border: 1px solid #fec84b;
  box-shadow: 0px 1px 2px 0px #1018280d;
}

.mm-page-title--h4 {
  color: #384250;
}
</style>

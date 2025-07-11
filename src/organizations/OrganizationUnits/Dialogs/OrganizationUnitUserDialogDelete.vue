<script setup lang="ts">
import { PropType, ref, computed } from "vue";
import { organizationsService } from "~/organizations/organizations.service";
import { OrganizationUnitRead, OrganizationUserRead } from "~/iam/iam.types";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  organizationId: {
    type: String,
    default: "",
    required: true,
  },
  unit: {
    type: Object as PropType<OrganizationUnitRead>,
    default: null,
    required: true,
  },
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: null,
    required: true,
  },
});

const emit = defineEmits(["close", "delete"]);
const loadingDelete = ref(false);
const usernameOrEmail =
  props.user.first_name || props.user.last_name
    ? [props.user.first_name, props.user.last_name].join(" ")
    : props.user?.email;

const title = computed(() => `Remove ${usernameOrEmail}`);
const subtitle = computed(
  () =>
    `Are you sure you want to remove ${usernameOrEmail} from unit ${props.unit?.name}?`,
);

const submitForm = async () => {
  loadingDelete.value = true;

  try {
    await organizationsService.deleteUserFromOrganizationUnit(
      props.organizationId,
      props.unit.id,
      props.user.id,
    );
    emit("delete");
    emit("close");
  } catch (error) {
    throw error;
  } finally {
    loadingDelete.value = false;
  }
};
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
          :loading="loadingDelete"
          variant="danger"
          cy="button-remove-user-from-unit-submit"
          @click="submitForm"
        >
          Yes, remove
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { PropType, ref, computed } from "vue";
import { organizationsService } from "~/organizations/organizations.service";
import { OrganizationUnitRead } from "~/iam/iam.types";

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
    default: () => ({}),
    required: true,
  },
});

const emit = defineEmits(["close", "delete"]);

const loadingDelete = ref(false);

const title = computed(() => `Delete ${props.unit?.name}`);

const submitForm = async () => {
  loadingDelete.value = true;

  try {
    await organizationsService.deleteOrganizationUnit(
      props.organizationId,
      props.unit.id,
    );
    emit("delete", props.unit.id);
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
    subtitle="Are you sure you want to delete this organizational unit?"
    icon="warning"
    icon-color="error"
    @close="emit('close')"
  >
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button
          variant="outlined"
          cy="button-delete-organization-unit-dismiss"
          @click="emit('close')"
        >
          Dismiss
        </m-m-button>
        <m-m-button
          :loading="loadingDelete"
          variant="danger"
          cy="button-delete-organization-unit-submit"
          @click="submitForm"
        >
          Yes, delete
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>

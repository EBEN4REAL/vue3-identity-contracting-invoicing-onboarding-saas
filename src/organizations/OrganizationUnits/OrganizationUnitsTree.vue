<script setup lang="ts">
import { onMounted, ref, Ref, watch, PropType, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authService } from "~/auth/auth.service";
import { OrganizationRead, OrganizationUnitRead } from "~/iam/iam.types";
import { UnitItemInTreeType } from "~/organizations/OrganizationUnits/types";

const route = useRoute();
const router = useRouter();
const props = defineProps({
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
    required: true,
  },
  organizationUnits: {
    type: Array as PropType<OrganizationUnitRead[]>,
    default: () => [],
    required: true,
  },
});

const organizationId: Ref<string | null> = ref(null);
const organizationUnitsList = ref<OrganizationUnitRead[]>([]);
const organizationUnitsTree = ref<UnitItemInTreeType[]>([]);
const orgUnitActiveInTree: Ref<string> = ref("");

watch(
  () => orgUnitActiveInTree.value,
  () => {
    router.push({
      name: "OrganizationUnitDetails",
      params: {
        unitId: orgUnitActiveInTree.value,
      },
    });
  },
);

watch(
  () => route.params.unitId,
  () => {
    if (Array.isArray(route.params.unitId))
      orgUnitActiveInTree.value = route.params.unitId[0];
    else orgUnitActiveInTree.value = route.params.unitId;
  },
  {
    immediate: true,
  },
);

watch(
  () => props.organizationUnits,
  async () => {
    generateOrganizationUnitsTreeFromList();
  },
  {
    deep: true,
  },
);

const generateOrganizationUnitsList = () => {
  organizationUnitsList.value = [
    organizationAsUnitItem.value,
    ...formatOrganizationUnits(props.organizationUnits),
  ];
};

function generateOrganizationUnitsTreeFromList() {
  generateOrganizationUnitsList();
  organizationUnitsTree.value = listToTree(organizationUnitsList.value);
}

function listToTree(data: OrganizationUnitRead[]): UnitItemInTreeType[] {
  const map: Record<string, UnitItemInTreeType> = {};
  const tree: UnitItemInTreeType[] = [];

  data.forEach((item) => {
    if (!item.type) item.type = "unit";
    if (!item.icon) item.icon = "building-office";
    map[item.id] = { ...item, children: [] };
  });

  data.forEach((item) => {
    if (item.parent_organization_unit_id) {
      const mappedItem = map[item.parent_organization_unit_id];
      if (mappedItem) mappedItem.children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });

  return tree;
}

const organizationAsUnitItem = computed(() => {
  return {
    id: props.organization.id,
    parent_organization_unit_id: "",
    name: props.organization.name,
    users: null,
    description: "",
    icon: "building-library",
    type: "organization",
    appendBadge: "Org",
    notClickable: true,
  };
});

function formatOrganizationUnits(
  items: OrganizationUnitRead[],
): OrganizationUnitRead[] {
  return items.map((item: OrganizationUnitRead) => {
    if (item.parent_organization_unit_id === null)
      item.parent_organization_unit_id = organizationId.value;
    return item;
  });
}

const setInitialOrganizationId = async () => {
  const profile = await authService.getProfile();
  organizationId.value = profile?.org || null;
};

onMounted(async () => {
  await setInitialOrganizationId();
  generateOrganizationUnitsTreeFromList();
});
</script>

<template>
  <m-m-tree
    v-model="orgUnitActiveInTree"
    :items="organizationUnitsTree"
    label="name"
  />
</template>

<style scoped lang="scss"></style>

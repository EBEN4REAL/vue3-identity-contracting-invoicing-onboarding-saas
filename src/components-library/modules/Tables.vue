<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";
import { ITEMS_PER_PAGE } from "~/common/constants";
import {
  TableHeader,
  TableRequestParams,
} from "~/mm_ui_kit/src/types/table.types";

const simpleTableData = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    email: "johndoe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    age: 22,
    email: "janedoe@example.com",
  },
  {
    id: 3,
    name: "John Smith",
    age: 30,
    email: "johnsmith@example.com",
  },
  {
    id: 4,
    name: "Jane Smith",
    age: 28,
    email: "janesmith@example.com",
  },
];

const expandedTableData = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    email: "johndoe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    age: 22,
    email: "janedoe@example.com",
  },
  {
    id: 3,
    name: "John Smith",
    age: 30,
    email: "johnsmith@example.com",
  },
  {
    id: 4,
    name: "Jane Smith",
    age: 28,
    email: "janesmith@example.com",
  },
  {
    id: 5,
    name: "John Doe",
    age: 25,
    email: "johndoe@example.com",
  },
  {
    id: 6,
    name: "Jane Doe",
    age: 22,
    email: "janedoe@example.com",
  },
  {
    id: 7,
    name: "John Smith",
    age: 30,
    email: "johnsmith@example.com",
  },
  {
    id: 8,
    name: "Jane Smith",
    age: 28,
    email: "janesmith@example.com",
  },
  {
    id: 9,
    name: "John Doe",
    age: 25,
    email: "johndoe@example.com",
  },
  {
    id: 10,
    name: "Jane Doe",
    age: 22,
    email: "janedoe@example.com",
  },
  {
    id: 11,
    name: "John Smith",
    age: 30,
    email: "johnsmith@example.com",
  },
  {
    id: 12,
    name: "Jane Smith",
    age: 28,
    email: "janesmith@example.com",
  },
];

const tableData = ref([]);

const simpleTableHeaders: Ref<TableHeader[]> = ref([
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
  },
]);

const tableHeaders: Ref<TableHeader[]> = ref([
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "actions",
    label: "",
  },
]);

onMounted(() => {
  handleUpdateParams();
});

const handleUpdateParams = (
  params: TableRequestParams = { limit: ITEMS_PER_PAGE[0], offset: "0" },
) => {
  // update tableData according to params
  tableData.value = expandedTableData.slice(
    Number(params.offset),
    Number(params.offset + params.limit),
  );
};
</script>

<template>
  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Basic Table:</h3>
    <m-m-table
      :headers="simpleTableHeaders"
      :rows="simpleTableData"
      :total-rows="simpleTableData.length"
      @update-params="handleUpdateParams"
    />
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">
      Table With Search, Sort, Pagination and Row Actions:
    </h3>
    <m-m-table
      :headers="tableHeaders"
      :rows="tableData"
      :total-rows="expandedTableData.length"
      show-header
      @update-params="handleUpdateParams"
    >
      <template #actions="{ row }">
        <div class="mm-flex mm-flex-justify-end">
          <m-m-dropdown
            list-side="left"
            :items="[
              {
                label: 'Action 1',
                type: 'button',
                onClick: () => {
                  console.log(row.id);
                },
              },
              {
                label: 'Action 2',
                type: 'button',
                onClick: () => {
                  console.log(row.id);
                },
              },
            ]"
          >
            <template #activator>
              <m-m-button prepend-icon="dots-vertical" variant="text" />
            </template>
          </m-m-dropdown>
        </div>
      </template>
    </m-m-table>
  </div>
</template>

<style scoped lang="scss"></style>

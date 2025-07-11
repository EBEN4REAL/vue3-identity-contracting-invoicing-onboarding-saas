<script setup lang="ts">
const iteratorData = [
  {
    key: "name",
    label: "Org name",
    text: "Organization Name",
    isEmpty: false,
  },
  {
    key: "domains",
    label: "Domains",
    text: "Domain 1, Domain 2",
    isEmpty: false,
  },
  {
    key: "industry",
    label: "Industry",
    text: "Industry",
    isEmpty: false,
  },
  {
    key: "number_of_employees_range",
    label: "Number of Employees",
    text: "1-10",
    isEmpty: false,
  },
  {
    key: "description",
    label: "Description",
    text: "Description",
    isEmpty: false,
  },
  {
    key: "address",
    label: "Address",
    text: "Address",
    isEmpty: false,
  },
  {
    key: "phone",
    label: "Phone",
    text: "Phone",
    isEmpty: false,
  },
  {
    key: "email",
    label: "Email",
    text: "Email",
    isEmpty: false,
  },
  {
    key: "website",
    label: "Website",
    text: "Website",
    isEmpty: false,
  },
];
</script>

<template>
  <m-m-data-iterator :data="iteratorData" />
</template>

<style scoped lang="scss"></style>

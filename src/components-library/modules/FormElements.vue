<script setup lang="ts">
import { ref } from "vue";
import { usePasswordRequirements } from "~/mm_ui_kit/src/composables/usePasswordRequirements";

const { passwordRequirements } = usePasswordRequirements("user@example.com");

const SELECT_OPTIONS = [
  { title: "Option 1", value: "1" },
  { title: "Option 2", value: "2" },
  { title: "Option 3", value: "3" },
];

const checkboxModel = ref([]);
const radioModel = ref("");
const tagsInputModel = ref([]);
const password = ref("");
const selectModel = ref("");
const multiSelectModel = ref([]);
</script>

<template>
  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Input:</h3>

    <div class="mm-flex mm-flex-column mm-flex-gap-4">
      <m-m-input
        label="Input Label"
        placeholder="Input Placeholder"
      ></m-m-input>
      <m-m-input label="Disabled Input" disabled></m-m-input>
      <m-m-input label="Required Input" required></m-m-input>
      <m-m-input
        label="Input with Icon"
        icon-prepended="shield-check"
      ></m-m-input>
      <m-m-input label="Input with Button" button-appended="Button"></m-m-input>
    </div>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Tags Input:</h3>

    <m-m-tags-input
      v-model="tagsInputModel"
      label="Tags Input Label"
      placeholder="Tags Input Placeholder"
    ></m-m-tags-input>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">
      Password Input:
    </h3>

    <m-m-password
      v-model="password"
      :requirements="passwordRequirements"
      label="Password"
      required
      placeholder="Enter password"
    ></m-m-password>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Select:</h3>

    <div class="mm-flex mm-flex-column mm-flex-gap-4">
      <m-m-select
        v-model="selectModel"
        data-cy="select-organization-industry"
        :data-select-value="selectModel"
        :items="SELECT_OPTIONS"
        item-title="title"
        item-value="value"
        label="Single select"
        placeholder="Placeholder"
      />
      <div>
        <p>Value:</p>
        <pre>{{ selectModel }}</pre>
      </div>

      <m-m-select
        v-model="multiSelectModel"
        data-cy="select-organization-industry"
        :data-select-value="multiSelectModel"
        :items="SELECT_OPTIONS"
        item-title="title"
        item-value="value"
        multiple
        label="Multiple select"
        placeholder="Placeholder"
      />
      <div>
        <p>Value:</p>
        <pre>{{ multiSelectModel }}</pre>
      </div>

      <m-m-select
        v-model="selectModel"
        data-cy="select-organization-industry"
        :data-select-value="selectModel"
        :items="SELECT_OPTIONS"
        item-title="title"
        item-value="value"
        label="Select with custom option"
        placeholder="Placeholder"
      >
        <template #option="{ item }">
          <span>{{ item.title }} - {{ item.value }}</span>
        </template>
      </m-m-select>
    </div>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Checkbox:</h3>

    <div class="mm-flex mm-flex-column mm-flex-gap-4">
      <m-m-checkbox v-model="checkboxModel" value="1" name="checkbox"
        >Checkbox</m-m-checkbox
      >
      <m-m-checkbox v-model="checkboxModel" value="2" name="checkbox"
        >Checkbox</m-m-checkbox
      >
      <m-m-checkbox v-model="checkboxModel" value="3" name="checkbox"
        >Checkbox</m-m-checkbox
      >
    </div>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Radio:</h3>

    <div class="mm-flex mm-flex-column mm-flex-align-start mm-flex-gap-4">
      <m-m-radiobutton v-model="radioModel" name="radioButton" value="1"
        >Radio Label</m-m-radiobutton
      >
      <m-m-radiobutton v-model="radioModel" name="radioButton" value="2"
        >Radio Label</m-m-radiobutton
      >
      <m-m-radiobutton v-model="radioModel" name="radioButton" value="3"
        >Radio Label</m-m-radiobutton
      >
    </div>
  </div>
  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Radio cards:</h3>
    <div class="mm-flex mm-flex-row mm-flex-gap-4">
      <m-m-radio-card
        v-model="radioModel"
        name="Radio label"
        description="Radio description"
        value="4"
      />
      <m-m-radio-card
        v-model="radioModel"
        name="Radio label"
        description="Radio description"
        value="5"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw } from "vue";
import i18next from "i18next";
import {
  VuxActionMetadata,
  VuxComponentMode,
} from "@/types/componentInterface";

const props = defineProps<{ scenarioName: string }>();

interface VuxTestcase {
  name: string;
  description: string;
  mode: VuxComponentMode;
  section_expanded: boolean;
  expand_on_load: boolean;
  status: string;
  model: Record<string, unknown>;
  metadata: Record<string, unknown>;
  i18n: Record<string, unknown>;
}

const vuxTestcase = ref<VuxTestcase | null>(null);
const originalData = ref<VuxTestcase | null>(null);
const initialModel = ref<Record<string, unknown> | null>(null);
const groupModel = ref<Record<string, unknown> | null>(null);
const sectionExpanded = ref(false);
const mode = ref<VuxComponentMode>("edit");
const lastAction = ref<VuxActionMetadata | null>(null);
const lastActionModel = ref<Record<string, unknown> | null>(null);
const lastActionName = ref("");
const lastActionTime = ref<string | null>(null);
const validationChangeModel = ref<Record<string, unknown> | null>(null);
const validationChangeTime = ref<string | null>(null);
const validationChangeValue = ref<boolean | null>(null);
const resources = ref<Record<string, unknown> | null>(null);
const groupRef = ref();

const editState = reactive({
  model: false,
  metadata: false,
  i18n: false,
});

const editedJson = reactive({
  model: "",
  metadata: "",
  i18n: "",
});

const showReactiveModel = ref(false);
const showVuxActions = ref(false);
const showTestcaseParams = ref(false);
const showValidationBlock = ref(false);

const modeText = computed(() => (mode.value === "view" ? "Edit" : "View"));

const statusColor = computed(() => {
  const status = vuxTestcase.value?.status;
  switch (status) {
    case "new":
      return "status-new";
    case "pending":
      return "status-pending";
    case "done":
      return "status-done";
    default:
      return "status-default";
  }
});

const toggleSection = () => (sectionExpanded.value = !sectionExpanded.value);
const toggleMode = () => (mode.value = mode.value === "view" ? "edit" : "view");
const toggleShowReactiveModel = () =>
  (showReactiveModel.value = !showReactiveModel.value);
const toggleShowVuxActions = () =>
  (showVuxActions.value = !showVuxActions.value);
const toggleShowTestcaseParams = () =>
  (showTestcaseParams.value = !showTestcaseParams.value);
const toggleShowValidationBlock = () =>
  (showValidationBlock.value = !showValidationBlock.value);

const validateForm = () => {
  if (groupRef.value?.validate) groupRef.value.validate();
};

const handleAction = (
  name: string,
  action: VuxActionMetadata,
  model: Record<string, unknown>,
) => {
  lastActionName.value = name;
  lastAction.value = action;
  lastActionModel.value = model;
  lastActionTime.value = new Date().toISOString();
  showVuxActions.value = true;
};

const handleFieldValidationChange = (_: unknown, isValid: boolean) => {
  validationChangeModel.value = toRaw(groupModel.value);
  validationChangeValue.value = isValid;
  validationChangeTime.value = new Date().toISOString();
  showValidationBlock.value = true;
};

function copyToClipboard(data: unknown) {
  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
}

function editParam(key: keyof VuxTestcase) {
  editState[key] = true;
  editedJson[key] = JSON.stringify(vuxTestcase.value?.[key] || {}, null, 2);
}

function reloadParam(key: keyof VuxTestcase) {
  if (!originalData.value || !vuxTestcase.value) {
    throw new Error("Invalid internal state");
  }

  console.info(`reloadParam:${JSON.stringify(originalData.value[key])}`);
  vuxTestcase.value[key] = JSON.parse(JSON.stringify(originalData.value[key]));
  editState[key] = false;
}

function saveEditedJson(key: keyof VuxTestcase) {
  updateEditedJson(key);
  editState[key] = false;

  if (key === "model") {
    groupModel.value = reactive(
      JSON.parse(JSON.stringify(vuxTestcase.value?.model)),
    );
  }

  if (key === "i18n" && vuxTestcase.value) {
    const namespace = "translation";
    const lng = i18next.language;
    const resourceKey = `vux-${props.scenarioName}`;
    resources.value = { [resourceKey]: vuxTestcase.value.i18n };
    i18next.addResourceBundle(lng, namespace, resources.value, true, true);
  }
}

function updateEditedJson(key: keyof VuxTestcase) {
  try {
    vuxTestcase.value[key] = JSON.parse(editedJson[key]);
  } catch (error) {
    console.error(`${error.message}: ${editedJson[key]}`);
    throw new Error("Invalid JSON:", error);
  }
}

onMounted(async () => {
  const json = await import(`./vux-${props.scenarioName}.json`);
  vuxTestcase.value = json.default;
  originalData.value = JSON.parse(JSON.stringify(json.default));
  initialModel.value = toRaw(vuxTestcase.value.model);
  groupModel.value = reactive(
    JSON.parse(JSON.stringify(vuxTestcase.value.model)),
  );
  sectionExpanded.value = vuxTestcase.value.expand_on_load;

  const namespace = "translation";
  const lng = i18next.language;
  const resourceKey = `vux-${props.scenarioName}`;
  resources.value = { [resourceKey]: vuxTestcase.value.i18n };
  i18next.addResourceBundle(lng, namespace, resources.value, true, true);
});
</script>

<template>
  <div class="vux-testcase-wrapper">
    <div class="vux-testcase-container" :class="statusColor">
      <h2 class="vux-testcase-title" @click="toggleSection">
        {{ vuxTestcase?.name }}
      </h2>

      <div v-if="sectionExpanded" class="vux-testcase-content">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="vuxTestcase?.description"></p>

        <h3 class="vux-testcase-section-title">Component Viewport:</h3>

        <div class="vux-testcase-group-wrapper">
          <vux-property-group-template
            v-if="groupModel && vuxTestcase"
            ref="groupRef"
            v-model="groupModel"
            :mode="mode"
            :meta-data="vuxTestcase.metadata"
            :resource-key="`vux-${props.scenarioName}`"
            @vux-action="handleAction"
            @validation-changed="
              (isValid, property) =>
                handleFieldValidationChange(property, isValid)
            "
          />
        </div>
        <div class="vux-param-controls">
          <button @click="toggleMode">Toggle Mode ({{ modeText }})</button>
          <button @click="validateForm">Validate</button>
        </div>
        <h4
          class="vux-testcase-section-subtitle"
          @click="toggleShowReactiveModel"
        >
          Component Data:
        </h4>
        <div v-if="showReactiveModel" class="vux-testcase-debug-block">
          <pre>{{ groupModel }}</pre>
        </div>

        <h4 class="vux-testcase-section-subtitle" @click="toggleShowVuxActions">
          Vux Actions
        </h4>
        <div v-if="showVuxActions" class="vux-testcase-debug-block">
          <div>
            <strong>Timestamp:</strong>
            <pre>{{ lastActionTime }}</pre>
          </div>
          <div>
            <strong>Action Name:</strong>
            <pre>{{ lastActionName }}</pre>
          </div>
          <div>
            <strong>Action Metadata:</strong>
            <pre>{{ lastAction }}</pre>
          </div>
          <div>
            <strong>Action Model:</strong>
            <pre>{{ lastActionModel }}</pre>
          </div>
        </div>

        <h4
          class="vux-testcase-section-subtitle"
          @click="toggleShowValidationBlock"
        >
          Vux Validation Changed
        </h4>
        <div v-if="showValidationBlock" class="vux-testcase-debug-block">
          <div>
            <strong>Timestamp:</strong>
            <pre>{{ validationChangeTime }}</pre>
          </div>
          <div>
            <strong>Valid:</strong>
            <pre>{{ validationChangeValue }}</pre>
          </div>
          <div>
            <strong>Model:</strong>
            <pre>{{ validationChangeModel }}</pre>
          </div>
        </div>

        <h4
          class="vux-testcase-section-subtitle"
          @click="toggleShowTestcaseParams"
        >
          Testcase Parameters
        </h4>
        <div v-if="showTestcaseParams" class="vux-testcase-debug-block">
          <div v-for="key in ['model', 'metadata', 'i18n']" :key="key">
            <h5>{{ key }}</h5>

            <div v-if="editState[key]">
              <textarea
                v-model="editedJson[key]"
                rows="10"
                style="width: 100%; font-family: monospace; font-size: 10px"
              ></textarea>
            </div>
            <div v-else>
              <pre>{{ vuxTestcase?.[key] }}</pre>
            </div>

            <div class="vux-param-controls">
              <button @click="copyToClipboard(vuxTestcase?.[key])">Copy</button>
              <button v-if="!editState[key]" @click="editParam(key)">
                Edit
              </button>
              <button v-if="editState[key]" @click="saveEditedJson(key)">
                Save
              </button>
              <button @click="reloadParam(key)">Reload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vux-testcase-wrapper {
  background-color: #f3f4f6;
}

.vux-testcase-container {
  background-color: #f9fafb;
  border: 1px solid #ccc;
  padding: 16px;
}

.vux-testcase-title {
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
}

.vux-testcase-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.vux-testcase-section-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.vux-testcase-section-subtitle {
  font-size: 0.75rem;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}

.vux-testcase-debug-block {
  font-size: 10px;
  background-color: #f9fafb;
  padding: 8px;
  border-radius: 4px;
  white-space: pre-wrap;
  line-height: 1.2;
}

.vux-testcase-group-wrapper {
  background-color: #ffffff;
  border: 5px solid red;
  margin-bottom: 16px;
}

.vux-param-controls {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.vux-param-controls button {
  background-color: #e5e7eb;
  border: 1px solid #d1d5db;
  font-size: 10px;
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 2px;
}
</style>

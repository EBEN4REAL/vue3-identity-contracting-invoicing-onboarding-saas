<script setup lang="ts">
import { ComputedRef, PropType, computed } from "vue";
import type { TypeDataIteratorItem } from "../types/dataIterator.types";
import { labelToKebabCase } from "../helpers/utils";
import { BadgeTypes } from "../types/badge.types";

const props = defineProps({
  data: {
    type: Array as PropType<TypeDataIteratorItem[]>,
    default: () => [],
  },
  columns: {
    type: Number,
    default: 3,
  },
  rowGap: {
    type: String,
    default: "16px",
  },
  columnGap: {
    type: String,
    default: "24px",
  },
  cyIdDataIterator: {
    type: String,
    default: "mm-data-iterator",
  },
  cyIdLabel: {
    type: String,
    default: "mm-data-iterator-item-label",
  },
  cyIdText: {
    type: String,
    default: "mm-data-iterator-item-text",
  },
  cyIdTextEmpty: {
    type: String,
    default: "mm-data-iterator-item-text-empty",
  },
  hasBadge: {
    type: Boolean,
    default: false,
  },
  badgeStatus: {
    type: Object,
    default: Object as PropType<BadgeTypes>,
  },
});

const DEFAULT_EMPTY_TEXT = "Empty";

const emit = defineEmits(["do:action", "on:copytext"]);

const grindTemplateColumns: ComputedRef<string> = computed(
  () => `repeat(${props.columns}, 1fr)`,
);

const mmDataIteratorItemTextClass = (item: TypeDataIteratorItem) => [
  "mm-data-iterator-item-text",
  item.type === "hidden" && `mm-data-iterator-item-text--hidden`,
];
const doAction = (action: string, props?: object) => {
  try {
    emit("do:action", { action, ...props });
  } catch (error) {
    console.error("Error evaluating action:", error);
  }
};

const processGrantType = (type: string | undefined, label: string | null) => {
  if (type !== "grant_type") {
    return label;
  }

  if (label?.includes("client_credentials")) {
    return "Api";
  } else if (label?.includes("authorization_code")) {
    return "Website";
  } else {
    return label;
  }
};

const isItemLink = (item: TypeDataIteratorItem): boolean =>
  Boolean(item.to || item.href);
</script>

<template>
  <m-m-card class="mm-data-iterator" :data-cy="cyIdDataIterator">
    <div
      v-for="item in data"
      :key="item.label"
      class="mm-data-iterator-item"
      :data-cy="labelToKebabCase(item.label)"
    >
      <div
        class="mm-data-iterator-item-label mm-flex mm-flex-align-center"
        :data-cy="cyIdLabel"
      >
        <div v-sanitize-html="item.label"></div>
        <div v-if="item.labelTooltip">
          <m-m-icon
            icon="info"
            width="16px"
            height="16px"
            class="info-icon mm-ml-3"
          />
          <m-m-tooltip display-position="top">
            <div v-sanitize-html="item.labelTooltip"></div>
          </m-m-tooltip>
        </div>
      </div>
      <div
        v-if="item.isEmpty"
        class="mm-data-iterator-item-text mm-data-iterator-item-text--empty"
        :data-cy="cyIdTextEmpty"
      >
        {{ item.emptyText || DEFAULT_EMPTY_TEXT }}
      </div>
      <div
        v-else
        :class="mmDataIteratorItemTextClass(item)"
        :data-cy="cyIdText"
      >
        <span v-if="!item.multiple">
          <slot v-if="$slots[item.key]" :name="item.key" />
          <template v-else>
            <m-m-badge
              v-if="item.hasBadge"
              :status="item.badgeStatus"
              :text="item.badgeText"
            />
            <template v-else>
              <m-m-link
                v-if="isItemLink(item)"
                :to="item.to"
                :href="item.href"
                :target="item.target"
                :data-cy="cyIdLabel"
                font-size="16px"
                font-weigth="500"
              >
                {{ item.text }}
              </m-m-link>
              <span v-else>{{ processGrantType(item.key, item.text) }}</span>
            </template>
          </template>
        </span>
      </div>
      <div
        v-if="!item.isEmpty"
        class="mm-flex mm-flex-column mm-mt-1 mm-flex-justify-start mm-flex-align-start mm-flex-gap-2"
      >
        <template v-if="item.informationType === 'redirect' && item.multiple">
          <div class="mm-flex mm-flex-column mm-flex-align-start">
            <div
              v-for="url in item.text"
              :key="`url-${url}`"
              class="mm-flex mm-flex-gpa-10 mm-flex-wrap mm-mb-5"
            >
              <m-m-link color="blue-dim" :href="url" target="_blank">
                {{ url.text }}
                <m-m-icon
                  icon="arrow-top-right-square-outline"
                  stroke="currentColor"
                  width="15px"
                  height="15px"
                  class="mm-ml-2"
                />
              </m-m-link>
              <div v-if="url.hasCopyText" class="mm-ml-10">
                <m-m-link
                  color="blue-dim"
                  text-align="left"
                  class="mm-flex-grow mm-flex-shrink-0 mm-mt-2"
                  @click.prevent="emit('on:copytext', url.hiddenCopyText)"
                >
                  <m-m-icon
                    icon="clipboard"
                    stroke="#1c5d97"
                    width="15px"
                    height="15px"
                    class="mm-mr-2"
                  />
                  <m-m-tooltip v-if="url.hasTooltip" display-position="toRight">
                    {{ url.tooltipText }}
                  </m-m-tooltip>
                  <span>{{ url.copyText }}</span>
                </m-m-link>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.informationType === 'redirect' && !item.multiple">
          <m-m-link
            color="blue-dim"
            :href="item.informationRedirect"
            target="_blank"
          >
            {{ item.information }}
            <m-m-icon
              icon="arrow-top-right-square-outline"
              stroke="currentColor"
              width="15px"
              height="15px"
              class="mm-ml-2"
            />
          </m-m-link>
        </template>
        <template v-else-if="item.informationType === 'action'">
          <div class="mm-flex mm-flex-align-center mm-flex-gap-2">
            <m-m-icon
              v-if="item.informationIcon"
              :icon="item.informationIcon"
              width="15"
              height="15"
            />
            <span
              class="field-info mm-data-iterator-field-info-action"
              @click="doAction(item.informationAction || '')"
              >{{ item.information }}</span
            >
          </div>
        </template>
        <template
          v-if="item.information && item.informationType !== 'redirect'"
        >
          <div class="mm-flex mm-flex-align-center mm-flex-gap-2">
            <m-m-icon
              class="field-info-icon"
              icon="info"
              width="15"
              height="15"
            />
            <span class="field-info">{{ item.information }}</span>
          </div>
        </template>
      </div>
    </div>
  </m-m-card>
</template>

<style scoped lang="scss">
.mm-data-iterator {
  display: grid;
  padding: 24px;
  grid-template-columns: v-bind(grindTemplateColumns);
  row-gap: v-bind(rowGap);
  column-gap: v-bind(columnGap);

  &-item {
    &-label {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0;
      color: #344054;
    }

    &-text {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0;
      color: #384250;

      &--empty {
        color: #9da4ae;
        font-weight: 400;
      }
      &--hidden {
        -webkit-text-security: disc;
        unicode-bidi: bidi-override;
        font-family: monospace;
      }
    }
  }
}

.mm-data-iterator-field-info-action {
  color: #1c5d97 !important;
  cursor: pointer;
}
.field-info-icon {
  flex-shrink: 0;
  align-self: center;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { EgTag } from '../tag';
import tagStyles from '../tag/Tag.module.css';
import type { CryptoAddressSideTags, CryptoAddressTagSlotConfig } from './cryptoAddressTypes';
import {
  flattenAddressTags,
  formatMoreTagLabel,
  splitTagsForDisplay,
} from './cryptoAddressTagUtils';
import styles from './CryptoAddressTags.module.css';

const props = withDefaults(
  defineProps<{
    tags?: CryptoAddressSideTags;
    /** 行内是否展示溢出计数（+N） */
    defaultShowMore?: boolean;
    /** Tooltip 内展示全部 Tag（不含溢出计数占位） */
    tooltipMode?: boolean;
  }>(),
  {
    defaultShowMore: true,
    tooltipMode: false,
  },
);

const allTags = computed(() =>
  flattenAddressTags(props.tags?.system, props.tags?.custom),
);

const inlineTags = computed(() =>
  splitTagsForDisplay(props.tags?.system, props.tags?.custom).inline,
);

const hiddenTags = computed(() =>
  splitTagsForDisplay(props.tags?.system, props.tags?.custom).hidden,
);

const displayTags = computed(() => (props.tooltipMode ? allTags.value : inlineTags.value));

const more = computed(() => ({
  show:
    !props.tooltipMode &&
    props.defaultShowMore &&
    hiddenTags.value.length > 0,
  label: formatMoreTagLabel(hiddenTags.value.length),
}));

function isColorfulTag(tag: CryptoAddressTagSlotConfig): boolean {
  return tag.colorfulStyle != null || tag.family === 'colorful';
}

function isCustomTag(tag: CryptoAddressTagSlotConfig): boolean {
  return tag.family === 'custom';
}
</script>

<template>
  <span :class="styles.root">
    <template v-for="(tag, index) in displayTags" :key="`tag-${index}`">
      <span :class="tooltipMode ? styles.tooltipTag : styles.inlineTag">
        <EgTag
          v-if="isCustomTag(tag)"
          family="custom"
          :custom-style="tag.customStyle ?? 'vermilion'"
          :size="tag.size ?? 'sm'"
          :truncate="!tooltipMode"
        >
          {{ tag.label }}
        </EgTag>
        <EgTag
          v-else-if="isColorfulTag(tag)"
          family="colorful"
          :colorful-style="tag.colorfulStyle ?? 'apricot'"
          :size="tag.size ?? 'sm'"
          :truncate="!tooltipMode"
        >
          {{ tag.label }}
        </EgTag>
        <EgTag
          v-else
          family="system"
          :system-type="tag.systemType ?? 'solid-red'"
          :size="tag.size ?? 'sm'"
          :truncate="!tooltipMode"
        >
          {{ tag.label }}
        </EgTag>
      </span>
    </template>
    <span v-if="more.show" :class="styles.moreTag">
      <span :class="tagStyles.smText">
        <span :class="tagStyles.smTextPaint" aria-hidden="true">{{ more.label }}</span>
        <span :class="tagStyles.smTextSizer">{{ more.label }}</span>
      </span>
    </span>
  </span>
</template>

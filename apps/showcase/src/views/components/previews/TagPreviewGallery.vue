<script setup lang="ts">
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import galleryStyles from './TagPreviewGallery.module.css';

export type TagGalleryOption = {
  value: string;
  label: string;
};

const props = withDefaults(
  defineProps<{
    options: TagGalleryOption[];
    selected: string;
    galleryLabel?: string;
    /** false：内容区随 main / gallery / footer 自然增高（如 Avatar 原色盘）。 */
    fillPreviewHeight?: boolean;
  }>(),
  {
    fillPreviewHeight: true,
  },
);

const emit = defineEmits<{
  select: [value: string];
}>();
</script>

<template>
  <div
    class="desktopTokens"
    :class="[
      docStyles.previewInputHost,
      galleryStyles.host,
      !props.fillPreviewHeight && galleryStyles.hostNaturalHeight,
    ]"
  >
    <div :class="galleryStyles.main">
      <slot name="main" />
    </div>

    <div
      :class="galleryStyles.gallery"
      role="listbox"
      :aria-label="galleryLabel ?? '样式'"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="option"
        :aria-selected="selected === option.value"
        :class="[
          galleryStyles.galleryItem,
          selected === option.value && galleryStyles.galleryItemSelected,
        ]"
        @click="emit('select', option.value)"
      >
        <slot name="item" :value="option.value" />
        <span :class="galleryStyles.galleryLabel">{{ option.label }}</span>
      </button>
    </div>

    <div v-if="$slots.footer" :class="galleryStyles.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

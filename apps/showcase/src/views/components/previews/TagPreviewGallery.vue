<script setup lang="ts">
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import galleryStyles from './TagPreviewGallery.module.css';

export type TagGalleryOption = {
  value: string;
  label: string;
};

defineProps<{
  options: TagGalleryOption[];
  selected: string;
  galleryLabel?: string;
}>();

const emit = defineEmits<{
  select: [value: string];
}>();
</script>

<template>
  <div class="desktopTokens" :class="[docStyles.previewInputHost, galleryStyles.host]">
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
  </div>
</template>

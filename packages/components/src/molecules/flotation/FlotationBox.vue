<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgMessage } from '../feedback';
import { EgTag } from '../tag';
import styles from './Flotation.module.css';

/** Figma Box（2059:4167）预置行类型；#icon 插槽可覆盖图标。 */
export type FlotationBoxType = 'text' | 'symbolText' | 'rich';

const props = withDefaults(
  defineProps<{
    type?: FlotationBoxType;
    label?: string;
    tag?: string;
    message?: string;
    disabled?: boolean;
    focused?: boolean;
  }>(),
  {
    type: 'text',
    label: 'Label',
    tag: undefined,
    message: undefined,
    disabled: false,
    focused: false,
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const showIcon = computed(() => props.type === 'symbolText' || props.type === 'rich');
const showTag = computed(() => props.type === 'rich' && Boolean(props.tag?.trim()));
const showMessage = computed(
  () => props.type === 'rich' && Boolean(props.message?.trim()) && !showTag.value,
);
</script>

<template>
  <button
    type="button"
    class="eds-flotation-menu-item"
    :class="[styles.menuItem, focused && styles.menuItemFocused, disabled && styles.menuItemDisabled]"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <span v-if="showIcon" :class="styles.boxIcon">
      <slot name="icon">
        <EgIcon name="eds-add" size="sm" />
      </slot>
    </span>
    <span :class="styles.menuItemMain">
      <span :class="styles.menuItemLabel">{{ label }}</span>
      <EgTag v-if="showTag" family="status" status="danger" size="sm">{{ tag }}</EgTag>
      <EgMessage v-else-if="showMessage" :text="String(message)" type="subtle" />
    </span>
  </button>
</template>

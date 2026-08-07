<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId } from 'vue';
import styles from './NavBar.module.css';
import { useNavBarModuleFocus } from './navBarModuleFocus';
import { useNavBarWide } from './navBarWide';

const props = withDefaults(
  defineProps<{
    label?: string;
    title?: string;
    subtitle?: string;
  }>(),
  {
    label: 'G',
  },
);

const itemId = useId();
const navFocus = useNavBarModuleFocus();
const wide = useNavBarWide();

const isFocused = computed(() => navFocus?.focusedId.value === itemId);

const corporationMotionClass = computed(() =>
  isFocused.value ? 'motion-none' : undefined,
);

const showMeta = computed(
  () =>
    Boolean(String(props.title ?? '').trim()) || Boolean(String(props.subtitle ?? '').trim()),
);

function firstMarkLetter(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return 'G';
  return trimmed.charAt(0).toUpperCase();
}

const markLetter = computed(() => {
  if (wide.value) {
    const title = String(props.title ?? '').trim();
    if (title) return firstMarkLetter(title);
  }
  return firstMarkLetter(String(props.label ?? 'G'));
});

const corporationAriaLabel = computed(() => {
  if (wide.value && showMeta.value) {
    const parts = [props.title, props.subtitle]
      .map((value) => String(value ?? '').trim())
      .filter(Boolean);
    if (parts.length > 0) return parts.join(' ');
  }
  return markLetter.value;
});

onMounted(() => {
  navFocus?.register(itemId, 'chrome');
});

onBeforeUnmount(() => {
  navFocus?.unregister(itemId);
});

function onCorporationClick(event: MouseEvent) {
  navFocus?.select(itemId, event);
}
</script>

<template>
  <div v-if="wide" :class="styles.corporationWideShell">
    <button
      type="button"
      class="eds-nav-bar-corporation"
      :class="[
        styles.corporationWideButton,
        corporationMotionClass,
        isFocused && styles.corporationWideButtonFocused,
      ]"
      :aria-label="corporationAriaLabel"
      :aria-pressed="isFocused"
      @click="onCorporationClick"
    >
      <span :class="styles.corporationMarkGraphic" aria-hidden="true">
        <slot>{{ markLetter }}</slot>
      </span>
      <div v-if="showMeta" :class="styles.corporationMeta">
        <span v-if="props.title" :class="styles.corporationTitle">{{ props.title }}</span>
        <span v-if="props.subtitle" :class="styles.corporationSubtitle">{{ props.subtitle }}</span>
      </div>
    </button>
  </div>
  <button
    v-else
    type="button"
    class="eds-nav-bar-corporation"
    :class="[
      styles.corporationMark,
      isFocused ? 'motion-none' : 'motion-ease is-hover',
      isFocused && styles.corporationMarkFocused,
    ]"
    :aria-label="corporationAriaLabel"
    :aria-pressed="isFocused"
    @click="onCorporationClick"
  >
    <slot>{{ markLetter }}</slot>
  </button>
</template>

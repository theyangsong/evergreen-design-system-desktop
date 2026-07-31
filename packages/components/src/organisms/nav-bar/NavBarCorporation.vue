<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId } from 'vue';
import styles from './NavBar.module.css';
import { useNavBarModuleFocus } from './navBarModuleFocus';

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: 'G',
  },
);

const itemId = useId();
const navFocus = useNavBarModuleFocus();

const isFocused = computed(() => navFocus?.focusedId.value === itemId);

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
  <button
    type="button"
    class="eds-nav-bar-corporation"
    :class="[styles.corporationMark, isFocused && styles.corporationMarkFocused]"
    :aria-label="label"
    :aria-pressed="isFocused"
    @click="onCorporationClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

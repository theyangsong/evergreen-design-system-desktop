<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId, useSlots } from 'vue';
import styles from './NavBar.module.css';
import { useNavBarModuleFocus } from './navBarModuleFocus';

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: 'Action',
  },
);

const slots = useSlots();
const itemId = useId();
const navFocus = useNavBarModuleFocus();

const isFocused = computed(() => navFocus?.focusedId.value === itemId);

onMounted(() => {
  navFocus?.register(itemId, 'chrome');
});

onBeforeUnmount(() => {
  navFocus?.unregister(itemId);
});

function onBottomIconClick(event: MouseEvent) {
  navFocus?.select(itemId, event);
}
</script>

<template>
  <button
    type="button"
    class="eds-nav-bar-bottom-icon"
    :class="[styles.bottomIconHost, isFocused && styles.bottomIconHostFocused]"
    :aria-label="label"
    :aria-pressed="isFocused"
    @click="onBottomIconClick"
  >
    <span
      :class="[
        styles.bottomIconGlyph,
        slots.focusIcon && styles.bottomIconGlyphWithFocus,
      ]"
    >
      <span :class="styles.bottomIconDefault">
        <slot />
      </span>
      <span v-if="slots.focusIcon" :class="styles.bottomIconFocus">
        <slot name="focusIcon" />
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId } from 'vue';
import { EgAvatar } from '../../atoms/avatar';
import styles from './NavBar.module.css';
import { useNavBarModuleFocus } from './navBarModuleFocus';

withDefaults(
  defineProps<{
    initials?: string;
    label?: string;
    colorIndex?: number;
  }>(),
  {
    initials: 'N',
    label: 'User avatar',
    colorIndex: 0,
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

function onAvatarClick(event: MouseEvent) {
  navFocus?.select(itemId, event);
}
</script>

<template>
  <button
    type="button"
    class="eds-nav-bar-avatar"
    :class="[
      styles.avatarHost,
      isFocused ? 'motion-none' : 'motion-ease is-paint',
      isFocused && styles.avatarHostFocused,
    ]"
    :aria-label="label"
    :aria-pressed="isFocused"
    @click="onAvatarClick"
  >
    <span aria-hidden="true" :class="styles.avatarGraphic">
      <EgAvatar :initials="initials" size="lg" :color-index="colorIndex" />
    </span>
  </button>
</template>

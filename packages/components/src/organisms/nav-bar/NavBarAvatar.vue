<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId } from 'vue';
import styles from './NavBar.module.css';
import { useNavBarModuleFocus } from './navBarModuleFocus';

withDefaults(
  defineProps<{
    initials?: string;
    label?: string;
  }>(),
  {
    initials: 'N',
    label: 'User avatar',
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
    :class="[styles.avatarHost, isFocused && styles.avatarHostFocused]"
    :aria-label="label"
    :aria-pressed="isFocused"
    @click="onAvatarClick"
  >
    <span :class="styles.avatarCircle">
      <span :class="styles.avatarInitial"><slot>{{ initials }}</slot></span>
    </span>
  </button>
</template>

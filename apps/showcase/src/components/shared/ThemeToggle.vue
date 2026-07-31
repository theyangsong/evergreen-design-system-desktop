<script setup lang="ts">
import { useThemeProvider } from '@eds/website-components';
import styles from './ThemeToggle.module.css';

const { theme, toggleTheme } = useThemeProvider();
</script>

<template>
  <button type="button" :class="styles.button" @click="toggleTheme">
    {{ theme === 'light' ? 'Dark' : 'Light' }}
  </button>
</template>

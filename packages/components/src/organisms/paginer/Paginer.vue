<script setup lang="ts">
import styles from './Paginer.module.css';

withDefaults(
  defineProps<{
    showScrollbar?: boolean;
    showStatistics?: boolean;
    dataVolume?: string;
    scrollbarProgress?: number;
  }>(),
  {
    showScrollbar: false,
    showStatistics: true,
    dataVolume: '1–20 / 100',
    scrollbarProgress: 0.35,
  },
);
</script>

<template>
  <footer class="eds-paginer" :class="styles.root">
    <div :class="styles.row">
      <div v-if="showStatistics" :class="styles.statistics">
        <slot name="statistics">
          <span :class="styles.dataVolume">{{ dataVolume }}</span>
        </slot>
      </div>
      <div :class="styles.pagination">
        <slot />
      </div>
    </div>
    <div v-if="showScrollbar" :class="styles.scrollbar">
      <div :class="styles.scrollbarTrack" role="presentation">
        <div
          :class="styles.scrollbarThumb"
          :style="{ width: `${Math.min(100, Math.max(8, scrollbarProgress * 100))}%` }"
        />
      </div>
    </div>
  </footer>
</template>

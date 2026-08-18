<script setup lang="ts">
import styles from './DoneTick.module.css';
</script>

<template>
  <div :class="['eds-done-tick', styles.root]" role="img" aria-label="成功">
    <svg :class="styles.svg" viewBox="0 0 48 48" aria-hidden="true">
      <path
        class="eds-done-tick-mark"
        :class="styles.mark"
        d="M 3.776 17.762 L 19.7 33.628 L 40.906 12.437"
        fill="none"
        stroke="currentColor"
        stroke-width="6.865"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="100"
      />
    </svg>
  </div>
</template>

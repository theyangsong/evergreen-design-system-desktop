<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import styles from './NavBar.module.css';
</script>

<template>
  <div class="eds-nav-bar-system-buttons" :class="styles.systemButtons" aria-hidden="true">
    <button type="button" tabindex="-1" :class="[styles.trafficDot, styles.trafficClose]">
      <span :class="[styles.trafficGlyph, 'motion-ease is-paint']">
        <EgIcon name="eds-close-mini" fit />
      </span>
    </button>
    <button type="button" tabindex="-1" :class="[styles.trafficDot, styles.trafficMinimize]">
      <span :class="[styles.trafficGlyph, 'motion-ease is-paint']">
        <EgIcon name="eds-reduction-mini" fit />
      </span>
    </button>
    <button type="button" tabindex="-1" :class="[styles.trafficDot, styles.trafficExpand]">
      <span :class="[styles.trafficGlyph, 'motion-ease is-paint']">
        <EgIcon name="eds-add-mini" fit />
      </span>
    </button>
  </div>
</template>

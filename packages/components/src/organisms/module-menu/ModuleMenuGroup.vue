<script setup lang="ts">
import styles from './ModuleMenu.module.css';

withDefaults(
  defineProps<{
    /** 有值时为带标题组合；省略时为不带标题组合。 */
    title?: string;
  }>(),
  {
    title: undefined,
  },
);
</script>

<template>
  <div class="eds-module-menu-group" :class="styles.group">
    <div :class="styles.section">
      <div v-if="title != null && title !== ''" :class="styles.sectionTitleRow">
        <span :class="styles.sectionTitle">{{ title }}</span>
      </div>
      <slot />
    </div>
  </div>
</template>

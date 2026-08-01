<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import styles from './ModuleMenu.module.css';
import '../../styles/frostedMenuChrome.css';

withDefaults(
  defineProps<{
    title?: string;
    /** 列表可滚动时为分割线预留占位。 */
    scrollDividerReserved?: boolean;
    /** 内容区溢出且已向下滚动时显示分割线（占位始终保留）。 */
    showScrollDivider?: boolean;
  }>(),
  {
    title: 'Module',
    scrollDividerReserved: false,
    showScrollDivider: false,
  },
);
</script>

<template>
  <div :class="['eds-frosted-menu-chrome', styles.titleWrap]">
    <div :class="styles.titleRaw">
      <p :class="styles.titleText">
        <slot>{{ title }}</slot>
      </p>
    </div>
    <EgDivider
      v-if="scrollDividerReserved"
      :class="styles.titleScrollDivider"
      type="module"
      direction="horizontal"
      :hide="!showScrollDivider"
    />
  </div>
</template>

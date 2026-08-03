<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import styles from './ModuleMenu.module.css';
import '../../styles/frostedMenuChrome.css';

withDefaults(
  defineProps<{
    title?: string;
    /** text → 标题文案；trigger → #title 插槽内 EgFlotationTrigger 等交互标题。 */
    titleMode?: 'text' | 'trigger';
    /** 列表可滚动时为分割线预留占位。 */
    scrollDividerReserved?: boolean;
    /** 内容区溢出且已向下滚动时显示分割线（占位始终保留）。 */
    showScrollDivider?: boolean;
  }>(),
  {
    title: 'Module',
    titleMode: 'text',
    scrollDividerReserved: false,
    showScrollDivider: false,
  },
);
</script>

<template>
  <div :class="['eds-frosted-menu-chrome', styles.titleWrap]">
    <div :class="styles.titleRaw">
      <p v-if="titleMode === 'text'" :class="styles.titleText">
        <slot>{{ title }}</slot>
      </p>
      <div v-else :class="styles.titleTrigger">
        <slot>{{ title }}</slot>
      </div>
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

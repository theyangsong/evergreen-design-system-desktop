<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgIcon, getProcessedIcon, iconNames } from '@eds/desktop-components';
import shared from '@/views/shared/showcase.module.css';
import styles from '../ComponentsView.module.css';

/** 仅展示存在 SVG 且可解析的 name（与文件名一致，无旧版 path 占位）。 */
const registeredIconNames = computed(() =>
  iconNames.filter((name) => Boolean(getProcessedIcon(name))),
);

const query = ref('');

const filteredIconNames = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return registeredIconNames.value;
  return registeredIconNames.value.filter((name) => name.toLowerCase().includes(q));
});
</script>

<template>
  <section id="icons-gallery" :class="shared.section">
    <h2 :class="shared.sectionTitle">Icon Set</h2>
    <p :class="shared.bodyText">
      共 {{ registeredIconNames.length }} 个图标；<code>name</code> 与
      <code>packages/components/src/atoms/icons/*.svg</code> 文件名一致（不含 .svg）。
    </p>
    <label :class="styles.iconSearch">
      <span :class="shared.mono">搜索</span>
      <input v-model="query" type="search" placeholder="例如 eds-add" spellcheck="false" />
    </label>
    <div :class="styles.iconGrid">
      <div v-for="name in filteredIconNames" :key="name" :class="styles.iconCell">
        <div class="desktopTokens">
          <EgIcon :name="name" size="lg" :label="name" />
        </div>
        <span :class="shared.mono">{{ name }}</span>
      </div>
    </div>
  </section>
</template>

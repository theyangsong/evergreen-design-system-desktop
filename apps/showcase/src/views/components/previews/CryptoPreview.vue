<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgCrypto,
  cryptoNames,
  formatCryptoDisplayName,
  getProcessedCrypto,
  resolveCryptoAssetKind,
} from '@eds/desktop-components';
import shared from '@/views/shared/showcase.module.css';
import styles from '../ComponentsView.module.css';

const registeredCryptoNames = computed(() =>
  cryptoNames.filter((name) => Boolean(getProcessedCrypto(name))),
);

const query = ref('');

const filteredCryptoNames = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return registeredCryptoNames.value;
  return registeredCryptoNames.value.filter((name) => name.toLowerCase().includes(q));
});

const filteredCryptoEntries = computed(() =>
  filteredCryptoNames.value.map((name) => ({
    name,
    displayName: formatCryptoDisplayName(name),
    kind: resolveCryptoAssetKind(name),
  })),
);
</script>

<template>
  <section id="crypto-gallery" :class="shared.section">
    <h2 :class="shared.sectionTitle">Crypto Set</h2>
    <p :class="shared.bodyText">
      共 {{ registeredCryptoNames.length }} 个资产；<code>name</code> 与
      <code>packages/components/src/atoms/crypto/*.svg</code> 文件名一致（不含 .svg）。画廊展示名通过
      <code>formatCryptoDisplayName</code> 去掉 <code>eds-</code> 前缀；类型见
      <code>resolveCryptoAssetKind</code>。SVG 原样渲染，不做换色或结构改写。
    </p>
    <label :class="styles.iconSearch">
      <span :class="shared.mono">搜索</span>
      <input v-model="query" type="search" placeholder="例如 eds-eth-ethereum" spellcheck="false" />
    </label>
    <div :class="styles.iconGrid">
      <div v-for="entry in filteredCryptoEntries" :key="entry.name" :class="styles.iconCell">
        <div class="desktopTokens">
          <EgCrypto :name="entry.name" size="lg" />
        </div>
        <span
          :class="[
            styles.iconCellKind,
            entry.kind === 'Crypto' ? styles.iconCellKindCrypto : styles.iconCellKindNetwork,
          ]"
        >
          {{ entry.kind }}
        </span>
        <span :class="shared.mono">{{ entry.displayName }}</span>
      </div>
    </div>
  </section>
</template>

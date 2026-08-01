<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgCrypto, cryptoNames, getProcessedCrypto } from '@eds/desktop-components';
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
</script>

<template>
  <section id="crypto-gallery" :class="shared.section">
    <h2 :class="shared.sectionTitle">Crypto Set</h2>
    <p :class="shared.bodyText">
      共 {{ registeredCryptoNames.length }} 个资产；<code>name</code> 与
      <code>packages/components/src/atoms/crypto/*.svg</code> 文件名一致（不含 .svg）。SVG
      原样渲染，不做换色或结构改写。
    </p>
    <label :class="styles.iconSearch">
      <span :class="shared.mono">搜索</span>
      <input v-model="query" type="search" placeholder="例如 eds-eth-ethereum" spellcheck="false" />
    </label>
    <div :class="styles.iconGrid">
      <div v-for="name in filteredCryptoNames" :key="name" :class="styles.iconCell">
        <div class="desktopTokens">
          <EgCrypto :name="name" size="lg" />
        </div>
        <span :class="shared.mono">{{ name }}</span>
      </div>
    </div>
  </section>
</template>

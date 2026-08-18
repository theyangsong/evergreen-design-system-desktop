<script setup lang="ts">
import './mnemonicVerifyOnly.css';

/** 助记词校验中 — 4×4 对角线缩放波（Lottie loading V2） */
const CELLS = Array.from({ length: 16 }, (_, index) => ({
  index,
  diagonal: (index % 4) + Math.floor(index / 4),
}));

withDefaults(
  defineProps<{
    /** 为 true 时播放校验波；false 时静止满格。 */
    active?: boolean;
  }>(),
  {
    active: true,
  },
);
</script>

<template>
  <div
    class="eds-mnemonic-verify"
    :class="{ 'is-idle': !active }"
    role="img"
    :aria-label="active ? '助记词校验中' : '助记词校验'"
    :aria-busy="active || undefined"
  >
    <span
      v-for="cell in CELLS"
      :key="cell.index"
      class="eds-mnemonic-verify-cell"
      :style="{ '--mnemonic-verify-diagonal': String(cell.diagonal) }"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import styles from './Icon.module.css';
import { getProcessedIcon, type IconName } from './iconRegistry';
import type { IconFillTone } from './processSvg';

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'sm' | 'md' | 'lg';
    /** Size to parent slot (e.g. EgIconButton); ignores fixed sm/md/lg box. */
    fit?: boolean;
    label?: string;
    /** 仅 token 单色填充图标；彩色 fixed 图标忽略此 prop。 */
    fillTone?: IconFillTone;
  }>(),
  {
    size: 'md',
    fit: false,
  },
);

const processed = computed(() => getProcessedIcon(String(props.name)));

const kindClass = computed(() => {
  const icon = processed.value;
  if (!icon || icon.colorMode === 'fixed') return styles.fixedKind;
  const tone = props.fillTone ?? icon.fillTone;
  return [
    styles.tokenKind,
    tone === 'brand' ? styles.tokenFillBrand : styles.tokenFillPrimary,
  ];
});

const hostClass = computed(() => [
  styles.icon,
  props.fit ? styles.fill : styles[props.size],
  ...(Array.isArray(kindClass.value) ? kindClass.value : [kindClass.value]),
]);

const ariaLabel = computed(() => props.label || String(props.name));
</script>

<template>
  <span
    v-if="processed"
    :class="hostClass"
    role="img"
    :data-icon="name"
    :aria-label="label ? ariaLabel : undefined"
    :aria-hidden="label ? undefined : true"
  >
    <span class="eds-icon" :class="styles.svgHost" v-html="processed.markup" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import shared from '@/views/shared/showcase.module.css';
import styles from './ExtensionDeliveryMatrix.module.css';
import {
  EXTENSION_LAYER_LABELS,
  buildExtensionLayerStatus,
  type ComponentDocTier,
  type ExtensionLayer,
} from './extensionDelivery';

const props = defineProps<{
  tier: ComponentDocTier;
  layers: Partial<Record<ExtensionLayer, boolean>>;
}>();

const rows = computed(() => buildExtensionLayerStatus(props.tier, props.layers));

const metRequiredCount = computed(
  () => rows.value.filter((row) => row.required && row.met).length,
);

const requiredCount = computed(() => rows.value.filter((row) => row.required).length);
</script>

<template>
  <section :class="shared.section">
    <div :class="styles.header">
      <h2 :class="shared.sectionTitle">扩展交付</h2>
      <p :class="[shared.bodyText, styles.summary]">
        Variants → Props → Slots → Composition → Scenarios ·
        {{ metRequiredCount }}/{{ requiredCount }} 必填层已覆盖
      </p>
    </div>
    <div :class="shared.tableWrap">
      <table :class="shared.table">
        <thead>
          <tr>
            <th scope="col">层</th>
            <th scope="col">必填</th>
            <th scope="col">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.layer">
            <td><span :class="styles.layerName">{{ EXTENSION_LAYER_LABELS[row.layer] }}</span></td>
            <td>
              <span :class="shared.mono">{{ row.required ? '是' : '—' }}</span>
            </td>
            <td>
              <span
                :class="[
                  styles.status,
                  row.met ? styles.statusMet : row.required ? styles.statusMissing : styles.statusOptional,
                ]"
              >
                {{ row.met ? '已交付' : row.required ? '待补' : '可选' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

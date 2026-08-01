<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import '../../styles/frostedPageChrome.css';
import PaginerDataVolume from './PaginerDataVolume.vue';
import PaginerStatistics from './PaginerStatistics.vue';
import PaginerStatisticsCollapse from './PaginerStatisticsCollapse.vue';
import styles from './Paginer.module.css';

export type PaginerStatisticsItem = {
  text: string;
  number: string;
};

withDefaults(
  defineProps<{
    showScrollbar?: boolean;
    showStatistics?: boolean;
    statisticsCollapse?: boolean;
    scrollbarProgress?: number;
    scrollbarSize?: 'few' | 'many';
    dataVolumeTotal?: string;
    dataVolumeCount?: string;
    dataVolumeResults?: string;
    showDataVolumeDropdown?: boolean;
    statisticsCollapseLabel?: string;
    statisticsItems?: PaginerStatisticsItem[];
    settingsLevelLabel?: string;
    settingsJumpLabel?: string;
    settingsLevelLabels?: string[];
    settingsJumpPlaceholder?: string;
  }>(),
  {
    showScrollbar: false,
    showStatistics: true,
    statisticsCollapse: false,
    scrollbarProgress: 0.35,
    scrollbarSize: 'many',
    dataVolumeTotal: 'Total',
    dataVolumeCount: '0',
    dataVolumeResults: 'Results',
    showDataVolumeDropdown: true,
    statisticsCollapseLabel: 'Show statistics',
    statisticsItems: () => [
      { text: 'Title', number: '0' },
      { text: 'Title', number: '0' },
    ],
  },
);

const settingsLevelIndex = defineModel<number>('settingsLevelIndex', { default: 1 });
const settingsJumpValue = defineModel<string>('settingsJumpValue', { default: '' });

const emit = defineEmits<{
  'settings-level-select': [index: number, label: string];
  'settings-jump': [value: string];
}>();
</script>

<template>
  <footer class="eds-paginer" :class="styles.root">
    <div
      v-if="showScrollbar"
      :class="styles.scrollbar"
      role="presentation"
    >
      <div
        :class="[
          styles.scrollbarIndicator,
          scrollbarSize === 'few'
            ? styles.scrollbarIndicatorFew
            : styles.scrollbarIndicatorMany,
        ]"
        :style="{
          marginInlineStart: `${Math.min(100, Math.max(0, scrollbarProgress * 100))}%`,
        }"
      />
    </div>

    <EgDivider type="module" direction="horizontal" :class="styles.divider" />

    <div
      :class="[
        'eds-frosted-page-chrome',
        styles.raw,
        showStatistics && statisticsCollapse && styles.rawStatisticsCollapsed,
      ]"
    >
      <div :class="styles.nextPage">
        <div :class="styles.paginationRaw">
          <slot />
        </div>
        <slot name="dataVolume">
          <PaginerDataVolume
            v-model:settings-level-index="settingsLevelIndex"
            v-model:settings-jump-value="settingsJumpValue"
            :total-label="dataVolumeTotal"
            :count="dataVolumeCount"
            :results-label="dataVolumeResults"
            :show-dropdown="showDataVolumeDropdown"
            :settings-level-label="settingsLevelLabel"
            :settings-jump-label="settingsJumpLabel"
            :settings-level-labels="settingsLevelLabels"
            :settings-jump-placeholder="settingsJumpPlaceholder"
            @settings-level-select="(index, label) => emit('settings-level-select', index, label)"
            @settings-jump="(value) => emit('settings-jump', value)"
          >
            <template v-if="$slots['dataVolume-dropdown-content']" #dropdown-content>
              <slot name="dataVolume-dropdown-content" />
            </template>
          </PaginerDataVolume>
        </slot>
      </div>

      <div
        v-if="showStatistics && !statisticsCollapse"
        :class="styles.statisticsCombo"
      >
        <slot name="statistics">
          <PaginerStatistics
            v-for="(item, index) in statisticsItems"
            :key="`${item.text}-${item.number}-${index}`"
            :text="item.text"
            :number="item.number"
          />
        </slot>
      </div>

      <slot
        v-else-if="showStatistics && statisticsCollapse"
        name="statistics-collapse"
      >
        <PaginerStatisticsCollapse
          :collapse-label="statisticsCollapseLabel"
          :items="statisticsItems"
        />
      </slot>
    </div>
  </footer>
</template>

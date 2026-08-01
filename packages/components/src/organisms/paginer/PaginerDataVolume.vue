<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgFlotation, EgFlotationMenu } from '../../molecules/flotation';
import type { TooltipAlign, TooltipPlacement } from '../../molecules/tooltip';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
import PaginerSettings from './PaginerSettings.vue';
import styles from './Paginer.module.css';

const props = withDefaults(
  defineProps<{
    totalLabel?: string;
    count?: string;
    resultsLabel?: string;
    showDropdown?: boolean;
    dropdownLabel?: string;
    dropdownPlacement?: TooltipPlacement;
    dropdownAlign?: TooltipAlign;
    dropdownCrossAxisOffset?: number;
    settingsLevelLabel?: string;
    settingsJumpLabel?: string;
    settingsLevelLabels?: string[];
    settingsJumpPlaceholder?: string;
  }>(),
  {
    totalLabel: 'Total',
    count: '0',
    resultsLabel: 'Results',
    showDropdown: true,
    dropdownLabel: 'Change page size',
    dropdownPlacement: 'top',
    dropdownAlign: 'start',
    /** 面板左缘相对触发器左缘向左偏移 scale-12（48px） */
    dropdownCrossAxisOffset: -48,
    settingsLevelLabel: 'Items Per Page',
    settingsJumpLabel: 'Go to Page',
    settingsLevelLabels: () => ['20', '50', '100'],
    settingsJumpPlaceholder: 'Please Enter',
  },
);

const formattedCount = computed(() => formatGroupedNumber(props.count));

const settingsLevelIndex = defineModel<number>('settingsLevelIndex', { default: 1 });
const settingsJumpValue = defineModel<string>('settingsJumpValue', { default: '' });

const emit = defineEmits<{
  'settings-level-select': [index: number, label: string];
  'settings-jump': [value: string];
}>();

function onSettingsLevelSelect(index: number, label: string, close: () => void) {
  emit('settings-level-select', index, label);
  close();
}

function onSettingsJump(value: string, close: () => void) {
  emit('settings-jump', value);
  settingsJumpValue.value = '';
  close();
}
</script>

<template>
  <div class="eds-paginer-data-volume" :class="styles.dataVolume">
    <slot name="total">
      <span :class="styles.dataVolumeText">{{ totalLabel }}</span>
    </slot>
    <slot name="count">
      <span :class="styles.dataVolumeText">{{ formattedCount }}</span>
    </slot>
    <slot name="results">
      <span :class="styles.dataVolumeText">{{ resultsLabel }}</span>
    </slot>
    <slot v-if="showDropdown" name="dropdown">
      <EgFlotation
        :class="styles.dataVolumeDropdown"
        :placement="dropdownPlacement"
        :align="dropdownAlign"
        :cross-axis-offset="dropdownCrossAxisOffset"
        :show-add="false"
        :show-menu-divider="false"
      >
        <template #trigger="{ expanded }">
          <slot name="dropdown-trigger" :expanded="expanded">
            <EgIconButton
              shape="square"
              size="xs"
              :label="dropdownLabel"
              :aria-expanded="expanded"
              :class="expanded && styles.dataVolumeDropdownTriggerExpanded"
            >
              <EgIcon
                :name="expanded ? 'eds-arrow-up-mini-ios' : 'eds-arrow-down-mini-ios'"
                fit
              />
            </EgIconButton>
          </slot>
        </template>

        <template #content="{ close }">
          <slot name="dropdown-content" :close="close">
            <EgFlotationMenu
              :class="styles.settingsMenu"
              data-no-corner-smoothing
              :show-add="false"
              :show-divider="false"
              width-mode="adaptive"
              height-mode="adaptive"
              :scrollable="false"
            >
              <PaginerSettings
                v-model:level-index="settingsLevelIndex"
                v-model:jump-value="settingsJumpValue"
                :level-label="settingsLevelLabel"
                :jump-label="settingsJumpLabel"
                :level-labels="settingsLevelLabels"
                :jump-placeholder="settingsJumpPlaceholder"
                @level-select="(index, label) => onSettingsLevelSelect(index, label, close)"
                @jump="(value) => onSettingsJump(value, close)"
              />
            </EgFlotationMenu>
          </slot>
        </template>
      </EgFlotation>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgDecide } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  decideCustomizeControls,
  decideCustomizeDefaults,
  decideImportCode,
  decidePropRows,
  isDecideInteractiveMode,
} from './toggleDocCustomize';

const customize = reactive({ ...decideCustomizeDefaults });
const interactive = computed(() => isDecideInteractiveMode(customize.mode));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Decide"
      :show-doc-title="false"
      component-tag="EgDecide"
      :import-code="decideImportCode"
      :customize-controls="decideCustomizeControls"
      :customize-defaults="decideCustomizeDefaults"
      :prop-rows="decidePropRows"
      props-section-id="toggle-decide-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgDecide
            v-if="interactive"
            :model-value="Boolean(customize.decided)"
            @update:model-value="(v) => { customize.decided = v; }"
          />
          <EgDecide v-else :model-value="false" disabled />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>

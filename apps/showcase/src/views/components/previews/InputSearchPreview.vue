<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgSearch, EgVerifyInput } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import {
  searchEventRows,
  searchPropRows,
  verifyInputEventRows,
  verifyInputPropRows,
} from './inputSubPreviewData';
import {
  searchCustomizeControls,
  searchCustomizeDefaults,
  searchImportCode,
} from './inputDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
} from './inputPreviewWidth';

type SearchScenario = 'search' | 'verify-input';

const searchValue = ref('');
const verifyInputValue = ref('');
const searchCustomize = reactive({
  ...searchCustomizeDefaults,
  scenario: searchCustomizeDefaults.scenario as SearchScenario,
  widthMode: searchCustomizeDefaults.widthMode as 'fixed' | 'full',
});

const isSearchScenario = computed(() => searchCustomize.scenario === 'search');
const isVerifyInputScenario = computed(() => searchCustomize.scenario === 'verify-input');

const searchPreviewStyle = computed(() =>
  previewFixedWidthStyle(searchCustomize.widthMode, searchCustomize.fixedWidth),
);

const docComponentTag = computed(() =>
  isSearchScenario.value ? 'EgSearch' : 'EgVerifyInput',
);

const docPropRows = computed(() =>
  isSearchScenario.value ? searchPropRows : verifyInputPropRows,
);

const docEventRows = computed(() =>
  isSearchScenario.value ? searchEventRows : verifyInputEventRows,
);

const searchUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgSearch',
    searchCustomize,
    { defaults: searchCustomizeDefaults, vModel: 'value', omitKeys: ['scenario'] },
    buildVueSelfClosingSnippet,
  ),
);

const verifyInputUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgVerifyInput',
    searchCustomize,
    { defaults: searchCustomizeDefaults, vModel: 'code', omitKeys: ['scenario', 'placeholder'] },
    buildVueSelfClosingSnippet,
  ),
);

const usageSnippetOverride = computed(() =>
  isSearchScenario.value ? searchUsageSnippet.value : verifyInputUsageSnippet.value,
);

function resetPreview() {
  searchValue.value = '';
  verifyInputValue.value = '';
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="searchCustomize"
      title="Scens"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="searchImportCode"
      :customize-controls="searchCustomizeControls"
      :customize-defaults="searchCustomizeDefaults"
      :usage-snippet-override="usageSnippetOverride"
      :prop-rows="docPropRows"
      :event-rows="docEventRows"
      props-section-id="input-search-props"
      @reset-preview="resetPreview"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgSearch
            v-if="isSearchScenario && !searchCustomize.disabled"
            v-model="searchValue"
            :style="searchPreviewStyle"
            :placeholder="String(searchCustomize.placeholder)"
            :width-mode="searchCustomize.widthMode as 'fixed' | 'full'"
            :readonly="Boolean(searchCustomize.readonly)"
          />
          <EgSearch
            v-else-if="isSearchScenario"
            model-value=""
            :style="searchPreviewStyle"
            :placeholder="String(searchCustomize.placeholder)"
            :width-mode="searchCustomize.widthMode as 'fixed' | 'full'"
            disabled
          />
          <EgVerifyInput
            v-else-if="isVerifyInputScenario && !searchCustomize.disabled"
            v-model="verifyInputValue"
            :style="searchPreviewStyle"
            :width-mode="searchCustomize.widthMode as 'fixed' | 'full'"
            :readonly="Boolean(searchCustomize.readonly)"
          />
          <EgVerifyInput
            v-else
            model-value=""
            :style="searchPreviewStyle"
            :width-mode="searchCustomize.widthMode as 'fixed' | 'full'"
            disabled
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>

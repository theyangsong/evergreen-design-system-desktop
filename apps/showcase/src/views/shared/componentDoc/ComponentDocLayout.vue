<script setup lang="ts">
import { computed, inject, ref, useSlots, type ComputedRef } from 'vue';
import { EgButton, EgSegmentedControl } from '@eds/desktop-components';
import { rescanCornerSmoothing } from '@eds/desktop-components';
import { buildComponentAiPrompt, buildVueSelfClosingSnippet } from './buildUsageSnippet';
import CustomizePanel from './CustomizePanel.vue';
import PropsDocTables from './PropsDocTables.vue';
import shared from '@/views/shared/showcase.module.css';
import styles from './ComponentDocLayout.module.css';
import type { DocCustomizeControl, DocPropRow } from './types';
import { filterDocCustomizeControls } from './types';
const props = withDefaults(
  defineProps<{
    title: string;
    componentTag: string;
    importCode: string;
    customizeControls: DocCustomizeControl[];
    customizeDefaults?: Record<string, unknown>;
    propRows: DocPropRow[];
    eventRows?: DocPropRow[];
    slotRows?: DocPropRow[];
    propsSectionId?: string;
    anchorId?: string;
    vModelKey?: string;
    usageSnippetOverride?: string;
    showCustomize?: boolean;
    showProps?: boolean;
    /** Organism 等纵向组合：previewShell 1024px，inner 组件画布 800px。 */
    tallPreview?: boolean;
    /** 分子级等紧凑预览：预览区 280px（仅覆盖本页 docBlock）。 */
    compactPreview?: boolean;
    /** Tag 文档：预览区 480px + 底部样式色板。 */
    tagPreview?: boolean;
    /** 定制区按 control.row 分行排布（如 Module Menu 每组标题+顺序）。 */
    customizeSequential?: boolean;
    /** sequential + row 布局时每行列数（如 EgIconButtonPro 嵌套 6 列）。 */
    customizeRowColumns?: number;
    /** When false, parent supplies catalog group label (e.g. previewGroupLabel). */
    showDocTitle?: boolean;
  }>(),
  {
    customizeDefaults: () => ({}),
    vModelKey: 'value',
    showCustomize: true,
    showProps: true,
    showDocTitle: true,
    tallPreview: false,
    compactPreview: false,
    customizeSequential: false,
  },
);

const emit = defineEmits<{
  'reset-preview': [];
}>();

const slots = useSlots();

const injectedCompactPreview = inject<ComputedRef<boolean>>('componentDocCompactPreview');
const injectedTagPreview = inject<ComputedRef<boolean>>('componentDocTagPreview');

const useCompactPreview = computed(
  () => props.compactPreview || injectedCompactPreview?.value === true,
);

const useTagPreview = computed(
  () => props.tagPreview || injectedTagPreview?.value === true,
);

const useTallPreview = computed(() => props.tallPreview && !useCompactPreview.value);

const customizeState = defineModel<Record<string, unknown>>('customizeState', {
  default: () => ({}),
});

const docCustomizeControls = computed(() => filterDocCustomizeControls(props.customizeControls));

/** 有控件、嵌套 extra，或仅有 customize-after（如 Flotation 三面板）时展示「定制」标题区 */
const showCustomizePanel = computed(
  () =>
    props.showCustomize &&
    (docCustomizeControls.value.length > 0 ||
      Boolean(slots['customize-extra']) ||
      Boolean(slots['customize-after'])),
);

type DocViewMode = 'preview' | 'code';

const viewMode = ref<DocViewMode>('preview');
const copyFeedback = ref('');
const refreshFeedback = ref('');

/** Read control keys so computed tracks in-place reactive updates on customizeState. */
function trackedCustomizeState(): Record<string, unknown> {
  const state = customizeState.value ?? {};
  for (const control of docCustomizeControls.value) {
    void state[control.key];
  }
  return state;
}

const usageSnippet = computed(() => {
  if (props.usageSnippetOverride != null && props.usageSnippetOverride !== '') {
    return props.usageSnippetOverride;
  }
  const state = trackedCustomizeState();
  return buildVueSelfClosingSnippet(props.componentTag, state, {
    vModel: props.vModelKey,
    defaults: props.customizeDefaults,
  });
});

const codeDisplay = computed(() => `${props.importCode}\n\n${usageSnippet.value}`);

const aiPrompt = computed(() =>
  buildComponentAiPrompt({
    componentTag: props.componentTag,
    importCode: props.importCode,
    usageSnippet: usageSnippet.value,
  }),
);

function setViewMode(mode: DocViewMode) {
  viewMode.value = mode;
  requestAnimationFrame(() => rescanCornerSmoothing());
}

const viewModeIndex = computed({
  get: () => (viewMode.value === 'preview' ? 0 : 1),
  set: (index: number) => setViewMode(index === 0 ? 'preview' : 'code'),
});

function resetCustomizeState() {
  const state = customizeState.value;
  const defaults = props.customizeDefaults;
  if (!state || typeof state !== 'object') return;
  for (const [key, value] of Object.entries(defaults)) {
    state[key] = value;
  }
}

function onResetPreview() {
  resetCustomizeState();
  viewMode.value = 'preview';
  emit('reset-preview');
  refreshFeedback.value = '已刷新';
  window.setTimeout(() => {
    refreshFeedback.value = '';
  }, 1500);
  requestAnimationFrame(() => rescanCornerSmoothing());
}

async function copyAiPrompt() {
  try {
    await navigator.clipboard.writeText(aiPrompt.value);
    copyFeedback.value = '已复制';
  } catch {
    copyFeedback.value = '复制失败';
  }
  window.setTimeout(() => {
    copyFeedback.value = '';
  }, 1500);
}
</script>

<template>
  <article
    :id="anchorId"
    :class="[
      styles.docBlock,
      useTallPreview && styles.docBlockTallPreview,
      useCompactPreview && styles.docBlockCompactPreview,
      useTagPreview && styles.docBlockTagPreview,
    ]"
  >
    <header v-if="showDocTitle" :class="styles.docHeader">
      <h2 :class="styles.docTitle">{{ title }}</h2>
    </header>

    <div :class="styles.previewStage">
      <div :class="[styles.previewShell, useTallPreview && styles.previewShellTall]">
        <div
          class="desktopTokens"
          :class="styles.previewShellToolbar"
          :aria-label="`${title} 视图`"
        >
          <EgSegmentedControl
            v-model="viewModeIndex"
            size="lg"
            :labels="['预览', '代码']"
          />
          <div :class="styles.previewShellToolbarActions">
            <EgButton
              variant="text"
              size="md"
              tone="brand"
              @click="onResetPreview"
            >
              {{ refreshFeedback || '刷新' }}
            </EgButton>
            <EgButton
              size="md"
              tone="brand"
              :aria-label="`复制 ${title} AI 提示词`"
              @click="copyAiPrompt"
            >
              {{ copyFeedback || '复制 AI 提示词' }}
            </EgButton>
          </div>
        </div>

        <div v-if="viewMode === 'preview'" :class="[styles.previewInner, useTallPreview && styles.previewInnerTall]">
          <slot name="preview" />
        </div>
        <div v-else :class="styles.codeInner">
          <pre :class="styles.codeBlock"><code>{{ codeDisplay }}</code></pre>
        </div>
      </div>
    </div>

    <CustomizePanel
      v-if="showCustomizePanel"
      v-model="customizeState"
      :controls="docCustomizeControls"
      :sequential="customizeSequential"
      :row-columns="customizeRowColumns"
    >
      <template #extra>
        <slot name="customize-extra" />
      </template>
    </CustomizePanel>

    <slot name="customize-after" />

    <section
      v-if="showProps"
      :id="propsSectionId"
      :class="shared.section"
    >
      <h2 :class="shared.sectionTitle">Props</h2>
      <PropsDocTables
        bare
        :show-title="false"
        :prop-rows="propRows"
        :event-rows="eventRows"
        :slot-rows="slotRows"
      />
    </section>

    <slot />
  </article>
</template>

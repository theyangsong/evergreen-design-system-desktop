<script setup lang="ts">
import { computed, reactive, ref, watch, type Component } from 'vue';
import {
  EgAnchoredTooltip,
  EgButton,
  EgMinerFeeBitcoinPanel,
  EgMinerFeeEthereumPanel,
  EgMinerFeeTonPanel,
  EgMinerFeeTronPanel,
  EgPopover,
  EgRemarkPopover,
  type PopoverAlign,
  type PopoverPlacement,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import previewPageStyles from './InputPreview.module.css';
import matrixStyles from './PopoversPreview.module.css';
import {
  applyPopoverScenarioPreset,
  buildPopoverProps,
  buildPopoverScensUsageSnippet,
  buildRemarkPopoverProps,
  popoverPropRows,
  popoverScensCustomizeControls,
  popoverScensCustomizeDefaults,
  popoverScensImportCode,
  resolveMinerFeePanelTag,
  type PopoverMinerFeeNetwork,
  type PopoverScensScenario,
} from './popoversDocCustomize';
import {
  resolveShowcaseMinerFeePanelProps,
  showcaseMinerFeeUi,
} from './minerFeeShowcaseMock';

const MINER_FEE_PANELS: Record<PopoverMinerFeeNetwork, Component> = {
  bitcoin: EgMinerFeeBitcoinPanel,
  ethereum: EgMinerFeeEthereumPanel,
  ton: EgMinerFeeTonPanel,
  tron: EgMinerFeeTronPanel,
};

const props = withDefaults(
  defineProps<{
    initialScenario?: PopoverScensScenario;
    pageTitle?: string;
  }>(),
  {},
);

const customize = reactive({
  ...popoverScensCustomizeDefaults,
  scenario: (props.initialScenario ?? popoverScensCustomizeDefaults.scenario) as PopoverScensScenario,
  placement: popoverScensCustomizeDefaults.placement as PopoverPlacement,
  align: popoverScensCustomizeDefaults.align as PopoverAlign,
  trigger: popoverScensCustomizeDefaults.trigger as 'click' | 'hover',
  widthMode: popoverScensCustomizeDefaults.widthMode as 'fixed' | 'adaptive' | 'preset',
  heightMode: popoverScensCustomizeDefaults.heightMode as 'fixed' | 'adaptive',
  minerFeeNetwork: popoverScensCustomizeDefaults.minerFeeNetwork as PopoverMinerFeeNetwork,
  minerFeeMulti: popoverScensCustomizeDefaults.minerFeeMulti,
});

const anchoredRef = ref<{ close: () => void } | null>(null);
const remarkValue = ref('');

const isGuideScenario = computed(() => customize.scenario === 'guide');
const isRemarkScenario = computed(() => customize.scenario === 'remark');
const isMinerFeeScenario = computed(() => customize.scenario === 'miner-fee');
const isAnchoredScenario = computed(() => isGuideScenario.value || isMinerFeeScenario.value);

const previewComponentTag = computed(() => {
  if (isRemarkScenario.value) return 'EgRemarkPopover';
  if (isMinerFeeScenario.value) return resolveMinerFeePanelTag(customize.minerFeeNetwork);
  return 'EgPopover';
});

const minerFeePanel = computed(
  () => MINER_FEE_PANELS[customize.minerFeeNetwork] ?? EgMinerFeeEthereumPanel,
);

const minerFeePanelProps = computed(() =>
  resolveShowcaseMinerFeePanelProps(
    customize.minerFeeNetwork,
    Boolean(customize.minerFeeMulti),
  ),
);

const scensCustomizeControls = computed(() =>
  props.initialScenario
    ? popoverScensCustomizeControls.filter((control) => control.key !== 'scenario')
    : popoverScensCustomizeControls,
);

const pageTitle = computed(() => props.pageTitle ?? 'Scenes');

watch(
  () => customize.scenario,
  (scenario) => {
    applyPopoverScenarioPreset(customize, scenario);
  },
  { immediate: true },
);

const popoverPreviewProps = computed(() => {
  const props = buildPopoverProps(customize);
  delete props.topTool;
  delete props.topToolTitle;
  delete props.topToolClosable;
  return props;
});

const popoverShowTopTool = computed(
  () =>
    customize.placement === 'top' &&
    (isGuideScenario.value || isMinerFeeScenario.value || Boolean(customize.topTool)),
);

const popoverTopToolTitle = computed(() => {
  if (isMinerFeeScenario.value) {
    return String(customize.topToolTitle ?? showcaseMinerFeeUi('Gas Fee'));
  }
  return String(customize.topToolTitle ?? 'Title');
});

const popoverTopToolClosable = computed(() => Boolean(customize.topToolClosable));
const remarkPreviewProps = computed(() => buildRemarkPopoverProps(customize));
const usageSnippet = computed(() => buildPopoverScensUsageSnippet(customize));

function onTopToolClose() {
  anchoredRef.value?.close();
}
</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="popovers-scens"
      :title="pageTitle"
      :show-doc-title="false"
      :component-tag="previewComponentTag"
      :import-code="popoverScensImportCode"
      :customize-controls="scensCustomizeControls"
      :customize-defaults="popoverScensCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="popoverPropRows"
      props-section-id="popovers-scens-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.subPreviewWidth,
            docStyles.previewEffectPanelHost,
            docStyles.previewInputHost,
          ]"
        >
          <EgRemarkPopover
            v-if="isRemarkScenario"
            :key="`remark-${customize.placement}-${customize.align}-${customize.topToolClosable}`"
            v-model="remarkValue"
            :title="String(customize.topToolTitle ?? 'Remark')"
            :placeholder="String(customize.remarkPlaceholder ?? 'Please enter')"
            :feedback-text="String(customize.remarkFeedback ?? 'Optional, Max. 256 characters')"
            :confirm-label="String(customize.remarkConfirmLabel ?? 'Confirm')"
            :placement="customize.placement"
            :align="customize.align"
            v-bind="remarkPreviewProps"
            teleport-to="body"
          >
            <template #trigger="{ onClick }">
              <EgButton variant="outline" @click="onClick">
                {{ customize.triggerLabel }}
              </EgButton>
            </template>
          </EgRemarkPopover>

          <EgAnchoredTooltip
            v-else-if="isAnchoredScenario"
            :key="`anchored-${customize.scenario}-${customize.placement}-${customize.align}-${customize.minerFeeNetwork}-${customize.minerFeeMulti}`"
            ref="anchoredRef"
            :placement="customize.placement"
            :align="customize.align"
            :trigger="customize.trigger"
            :disabled="Boolean(customize.disabled)"
            :wrap-tooltip="false"
            token-scope-class="desktopTokens"
          >
            <EgButton variant="outline">{{ customize.triggerLabel }}</EgButton>
            <template #content>
              <EgPopover
                v-if="isMinerFeeScenario"
                :key="`popover-miner-fee-${customize.topToolClosable}`"
                v-bind="popoverPreviewProps"
                :top-tool="popoverShowTopTool"
                :top-tool-title="popoverTopToolTitle"
                :top-tool-closable="popoverTopToolClosable"
                @top-tool-close="onTopToolClose"
              >
                <component
                  :is="minerFeePanel"
                  v-bind="minerFeePanelProps"
                />
              </EgPopover>

              <div v-else :class="matrixStyles.popoversGuideHost">
                <EgPopover
                  :key="`popover-guide-${customize.topToolClosable}`"
                  v-bind="popoverPreviewProps"
                  :top-tool="popoverShowTopTool"
                  :top-tool-title="popoverTopToolTitle"
                  :top-tool-closable="popoverTopToolClosable"
                  @top-tool-close="onTopToolClose"
                >
                  <div :class="[matrixStyles.slotDemo, matrixStyles.guideSlotDemo]">
                    <textarea
                      v-model="customize.guideBody"
                      :class="[matrixStyles.slotEditor, matrixStyles.guideSlotEditor]"
                      rows="2"
                      aria-label="Popover 引导正文"
                    />
                    <EgButton
                      :class="matrixStyles.guideSlotAction"
                      tone="sameWhite"
                      variant="solid"
                      size="md"
                    >
                      {{ customize.guideActionLabel }}
                    </EgButton>
                  </div>
                </EgPopover>
              </div>
            </template>
          </EgAnchoredTooltip>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>

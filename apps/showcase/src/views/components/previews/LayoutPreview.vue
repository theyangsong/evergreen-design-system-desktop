<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import {
  EgContainer,
  EgLayout,
  EgModuleMenu,
  EgNavBar,
  EgSkid,
  EgTooltip,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  ORGANISM_IMPORT,
  buildLayoutUsageSnippet,
  layoutCustomizeControls,
  layoutCustomizeDefaults,
  layoutPropRowsForType,
  layoutSlotRowsForType,
} from './organismTemplateDocData';

const customize = reactive({
  ...layoutCustomizeDefaults,
  type: layoutCustomizeDefaults.type as 'empty' | 'navigation' | 'module-menu',
  pageBg: layoutCustomizeDefaults.pageBg as 'none' | 'right' | 'center',
});

watch(
  () => customize.type,
  (type) => {
    if (type === 'empty') customize.showSkid = false;
  },
);

const usageSnippet = computed(() => buildLayoutUsageSnippet(customize));

const docComponentTag = computed(() =>
  customize.type === 'empty' ? 'EgContainer' : 'EgLayout',
);

const docPropRows = computed(() => layoutPropRowsForType(customize.type));

const docSlotRows = computed(() => layoutSlotRowsForType(customize.type));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Layout"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="layoutCustomizeControls"
      :customize-defaults="layoutCustomizeDefaults"
      :prop-rows="docPropRows"
      :slot-rows="docSlotRows"
      :usage-snippet-override="usageSnippet"
      props-section-id="layout-props"
      tall-preview
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.previewEffectPanelHost, docStyles.previewEffectPanelHostTall]"
        >
          <EgTooltip panel-kind="container">
            <EgContainer
              v-if="customize.type === 'empty'"
              :page-bg="customize.pageBg"
            />
            <EgContainer v-else>
              <EgLayout :type="customize.type" :show-skid="Boolean(customize.showSkid)">
                <template v-if="customize.type !== 'empty'" #nav>
                  <EgNavBar />
                </template>
                <template v-if="customize.type === 'module-menu'" #moduleMenu>
                  <EgModuleMenu />
                </template>
                <template v-if="customize.showSkid" #skid>
                  <EgSkid />
                </template>
              </EgLayout>
            </EgContainer>
          </EgTooltip>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>

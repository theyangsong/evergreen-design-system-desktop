<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { EgNavBar } from '@eds/desktop-components';
import {
  cregisNavBarDeclarativeProps,
} from '@/presets/nav/cregisNavBarDeclarative';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import NavBarPreviewNest from './NavBarPreviewNest.vue';
import { healNavBarCustomizeState } from './navBarPreviewCustomize';
import {
  ORGANISM_IMPORT,
  cregisNavBarPropRows,
  navBarAppEntryLabelCustomizeControls,
  navBarCustomizeControls,
  navBarCustomizeDefaults,
  navBarModuleLabelCustomizeControls,
  navBarPropRows,
  navBarSlotRows,
} from './organismTemplateDocData';

const customize = reactive({ ...navBarCustomizeDefaults });
healNavBarCustomizeState(customize);

watch(
  () => customize.appEntryCount,
  () => healNavBarCustomizeState(customize),
);

const isNavBarScenario = computed(() => customize.scenario === 'nav-bar');

const docComponentTag = computed(() => 'EgNavBar');

const docImportCode = computed(() => ORGANISM_IMPORT);

const docPropRows = computed(() => (isNavBarScenario.value ? navBarPropRows : cregisNavBarPropRows));

const docSlotRows = computed(() => (isNavBarScenario.value ? navBarSlotRows : []));

const isNavBarWide = computed(() => customize.navBarWidth === '210');

const docUsageSnippet = computed(() => {
  if (!isNavBarScenario.value) {
    return buildVueSelfClosingSnippet(
      'EgNavBar',
      {
        ...cregisNavBarDeclarativeProps,
        wide: isNavBarWide.value,
      },
      {
        defaults: { ...cregisNavBarDeclarativeProps, wide: false },
        omitKeys: ['scenario', 'navBarWidth'],
      },
    );
  }

  return buildVueSelfClosingSnippet(
    'EgNavBar',
    {
      ...customize,
      wide: isNavBarWide.value,
    },
    {
      defaults: { ...navBarCustomizeDefaults, wide: false },
      omitKeys: ['scenario', 'navBarWidth'],
    },
  );
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="nav-bar"
      title="NavBar"
      tall-preview
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="navBarCustomizeControls"
      :customize-defaults="navBarCustomizeDefaults"
      :usage-snippet-override="docUsageSnippet"
      :prop-rows="docPropRows"
      :slot-rows="docSlotRows"
          props-section-id="nav-bar-props"
          @reset-preview="healNavBarCustomizeState(customize)"
        >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewEffectPanelHost,
            docStyles.previewEffectPanelHostTall,
            organismStyles.previewOrganismNavHost,
          ]"
        >
          <NavBarPreviewNest v-if="isNavBarScenario" :customize="customize" />
          <EgNavBar v-else :wide="isNavBarWide" v-bind="cregisNavBarDeclarativeProps" />
        </div>
      </template>

      <template v-if="isNavBarScenario" #customize-after>
        <CustomizePanel
          v-model="customize"
          title="模块名称"
          nested
          sequential
          :controls="navBarModuleLabelCustomizeControls"
        />
        <CustomizePanel
          v-model="customize"
          title="应用入口名称"
          nested
          sequential
          :controls="navBarAppEntryLabelCustomizeControls"
        />
      </template>
    </ComponentDocLayout>
  </div>
</template>

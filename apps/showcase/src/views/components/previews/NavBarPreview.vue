<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgNavBar } from '@eds/desktop-components';
import {
  cregisNavBarDeclarativeProps,
  cregisNavBarUsageSnippet,
} from '@/presets/nav/cregisNavBarDeclarative';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import NavBarPreviewNest from './NavBarPreviewNest.vue';
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

const isNavBarScenario = computed(() => customize.scenario === 'nav-bar');

const docComponentTag = computed(() => 'EgNavBar');

const docImportCode = computed(() => ORGANISM_IMPORT);

const docPropRows = computed(() => (isNavBarScenario.value ? navBarPropRows : cregisNavBarPropRows));

const docSlotRows = computed(() => (isNavBarScenario.value ? navBarSlotRows : []));

const docUsageSnippet = computed(() => {
  if (!isNavBarScenario.value) {
    return cregisNavBarUsageSnippet;
  }

  return buildVueSelfClosingSnippet('EgNavBar', customize, {
    defaults: navBarCustomizeDefaults,
    omitKeys: ['scenario'],
  });
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="nav-bar"
      title="Nav Bar"
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
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.previewInputHost, organismStyles.previewOrganismNavHost]"
        >
          <NavBarPreviewNest v-if="isNavBarScenario" :customize="customize" />
          <EgNavBar v-else v-bind="cregisNavBarDeclarativeProps" />
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

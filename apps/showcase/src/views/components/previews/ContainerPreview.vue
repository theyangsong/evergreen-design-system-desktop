<script setup lang="ts">
import { reactive } from 'vue';
import { EgContainer } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  containerCustomizeControls,
  containerCustomizeDefaults,
  containerPropRows,
} from './organismTemplateDocData';

const customize = reactive({
  ...containerCustomizeDefaults,
  pageBg: containerCustomizeDefaults.pageBg as 'none' | 'right' | 'center',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Container"
      :show-doc-title="false"
      component-tag="EgContainer"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="containerCustomizeControls"
      :customize-defaults="containerCustomizeDefaults"
      :prop-rows="containerPropRows"
      props-section-id="container-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="organismStyles.previewOrganismWideHost">
          <EgContainer :page-bg="customize.pageBg">
            <div
              :style="{
                minHeight: 'var(--scale-30)',
                background: 'var(--material-card-shallow)',
                borderRadius: 'var(--radius-sm)',
              }"
            />
          </EgContainer>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>

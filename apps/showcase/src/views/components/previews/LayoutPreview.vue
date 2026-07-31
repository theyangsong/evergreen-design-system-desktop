<script setup lang="ts">
import { reactive } from 'vue';
import {
  EgIcon,
  EgLayout,
  EgModuleMenu,
  EgModuleMenuItem,
  EgNavBar,
  EgNavBarCorporation,
  EgNavBarModuleItem,
  EgPaginer,
  EgSkid,
  EgToolBar,
  EgIconButtonPro,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  layoutCustomizeControls,
  layoutCustomizeDefaults,
  layoutPropRows,
  layoutSlotRows,
} from './organismTemplateDocData';

const customize = reactive({
  ...layoutCustomizeDefaults,
  type: layoutCustomizeDefaults.type as 'empty' | 'navigation' | 'module-menu',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Layout"
      :show-doc-title="false"
      component-tag="EgLayout"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="layoutCustomizeControls"
      :customize-defaults="layoutCustomizeDefaults"
      :prop-rows="layoutPropRows"
      :slot-rows="layoutSlotRows"
      props-section-id="layout-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="organismStyles.previewOrganismLayoutHost">
          <EgLayout
            :type="customize.type"
            :show-toolbar="Boolean(customize.showToolbar)"
            :show-paginer="Boolean(customize.showPaginer)"
            :show-skid="Boolean(customize.showSkid)"
          >
            <template v-if="customize.type !== 'empty'" #nav>
              <EgNavBar>
                <template #corporation>
                  <EgNavBarCorporation label="G" />
                </template>
                <EgNavBarModuleItem label="Label">
                  <EgIcon name="eds-add" size="md" />
                </EgNavBarModuleItem>
              </EgNavBar>
            </template>
            <template v-if="customize.type === 'module-menu'" #moduleMenu>
              <EgModuleMenu title="Module">
                <EgModuleMenuItem label="Label">
                  <EgIcon name="eds-add" size="sm" />
                </EgModuleMenuItem>
              </EgModuleMenu>
            </template>
            <template v-if="customize.showToolbar" #toolbar>
              <EgToolBar title="Title">
                <template #functional>
                  <EgIconButtonPro label="Label">
                    <EgIcon name="eds-add" size="sm" />
                  </EgIconButtonPro>
                </template>
              </EgToolBar>
            </template>
            <div
              :style="{
                flex: '1',
                minHeight: 'var(--scale-20)',
                background: 'var(--material-card-shallow)',
              }"
            />
            <template v-if="customize.showPaginer" #paginer>
              <EgPaginer data-volume="1–20 / 100" />
            </template>
            <template v-if="customize.showSkid" #skid>
              <EgSkid title="Skid" />
            </template>
          </EgLayout>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>

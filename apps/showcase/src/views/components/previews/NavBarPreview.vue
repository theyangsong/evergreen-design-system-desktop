<script setup lang="ts">
import { computed, reactive } from 'vue';
import {
  EgIcon,
  EgNavBar,
  EgNavBarAvatar,
  EgNavBarBottomIcon,
  EgNavBarCorporation,
  EgNavBarModuleItem,
  getProcessedIcon,
  navBarDefaultBottomUtilities,
} from '@eds/desktop-components';
import {
  cregisNavBarDeclarativeProps,
  cregisNavBarUsageSnippet,
} from '@/presets/nav/cregisNavBarDeclarative';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { showcaseDefaultIconName } from '@/views/shared/showcaseIcons';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
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

const moduleCount = computed(() => {
  const count = Number(customize.moduleCount);
  if (!Number.isFinite(count)) return 4;
  return Math.min(20, Math.max(1, Math.round(count)));
});

const appEntryCount = computed(() => {
  const count = Number(customize.appEntryCount);
  if (!Number.isFinite(count)) return 0;
  return Math.min(20, Math.max(0, Math.round(count)));
});

function labelAt(prefix: 'moduleLabel' | 'appEntryLabel', order: number): string {
  const key = `${prefix}${order}` as keyof typeof customize;
  const value = customize[key];
  return value != null && String(value).trim().length > 0 ? String(value).trim() : 'Label';
}

function iconAt(
  prefix: 'moduleIcon' | 'moduleFocusIcon' | 'appEntryIcon' | 'appEntryFocusIcon',
  order: number,
): string {
  const key = `${prefix}${order}` as keyof typeof customize;
  const value = customize[key];
  const name = value != null ? String(value).trim() : '';
  if (name && getProcessedIcon(name)) return name;
  return showcaseDefaultIconName;
}

function reddotAt(prefix: 'moduleReddot' | 'appEntryReddot', order: number): boolean {
  const key = `${prefix}${order}` as keyof typeof customize;
  return Boolean(customize[key]);
}

const moduleItems = computed(() =>
  Array.from({ length: moduleCount.value }, (_, index) => ({
    order: index + 1,
    label: labelAt('moduleLabel', index + 1),
    icon: iconAt('moduleIcon', index + 1),
    focusIcon: iconAt('moduleFocusIcon', index + 1),
    showReddot: reddotAt('moduleReddot', index + 1),
  })),
);

const appEntryItems = computed(() =>
  Array.from({ length: appEntryCount.value }, (_, index) => ({
    order: index + 1,
    label: labelAt('appEntryLabel', index + 1),
    icon: iconAt('appEntryIcon', index + 1),
    focusIcon: iconAt('appEntryFocusIcon', index + 1),
    showReddot: reddotAt('appEntryReddot', index + 1),
  })),
);
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
          <EgNavBar v-if="isNavBarScenario" :show-divider="Boolean(customize.showDivider)">
            <template #corporation>
              <EgNavBarCorporation :label="String(customize.corporationLabel)" />
            </template>
            <EgNavBarModuleItem
              v-for="item in moduleItems"
              :key="`module-${item.order}`"
              :label="item.label"
              :show-reddot="item.showReddot"
            >
              <EgIcon :name="item.icon" size="md" fit />
              <template #focusIcon>
                <EgIcon :name="item.focusIcon" size="md" fit />
              </template>
            </EgNavBarModuleItem>
            <template v-if="appEntryCount > 0" #appEntries>
              <EgNavBarModuleItem
                v-for="item in appEntryItems"
                :key="`app-entry-${item.order}`"
                app-entry
                :label="item.label"
                :show-reddot="item.showReddot"
              >
                <EgIcon :name="item.icon" size="md" fit />
              </EgNavBarModuleItem>
            </template>
            <template #utilities>
              <EgNavBarBottomIcon
                v-for="(utility, index) in navBarDefaultBottomUtilities"
                :key="`utility-${index}`"
                :label="utility.label"
              >
                <EgIcon :name="utility.icon" size="sm" fit />
                <template #focusIcon>
                  <EgIcon :name="utility.focusIcon" size="sm" fit />
                </template>
              </EgNavBarBottomIcon>
            </template>
            <template #avatar>
              <EgNavBarAvatar :initials="String(customize.avatarInitials)" />
            </template>
          </EgNavBar>
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

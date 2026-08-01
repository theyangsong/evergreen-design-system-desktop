<script setup lang="ts">
import { computed, reactive } from 'vue';
import {
  EgIcon,
  EgModuleMenu,
  EgModuleMenuGroup,
  EgModuleMenuItem,
  getProcessedIcon,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import { showcaseDefaultIconName } from '@/views/shared/showcaseIcons';
import {
  ORGANISM_IMPORT,
  MODULE_MENU_MAX_GROUPS,
  MODULE_MENU_MAX_SUB_ITEMS,
  buildModuleMenuCustomizeDefaults,
  cregisModuleMenuPropRows,
  isModuleMenuDsScenario,
  moduleMenuCustomizeControls,
  moduleMenuCustomizeDefaults,
  moduleMenuGroupCustomizeControlsList,
  moduleMenuGroupItemCountKey,
  moduleMenuGroupItemHasSubKey,
  moduleMenuGroupItemIconKey,
  moduleMenuGroupItemAccessoryKey,
  moduleMenuGroupItemMessageTextKey,
  moduleMenuGroupItemLabelKey,
  moduleMenuGroupItemSubCountKey,
  moduleMenuGroupItemSubLabelKey,
  moduleMenuGroupSortKey,
  moduleMenuGroupTitleKey,
  moduleMenuPropRows,
  moduleMenuTitleCustomizeControls,
  type ModuleMenuScenario,
} from './organismTemplateDocData';
import {
  cregisModuleMenuUsageSnippet,
  isModuleMenuBusinessScenario,
  resolveModuleMenuBusinessGroups,
  resolveModuleMenuBusinessTitle,
  udunModuleMenuUsageSnippet,
} from './moduleMenuPreviewCustomize';

const customize = reactive({ ...moduleMenuCustomizeDefaults });

const isDsScenario = computed(() => isModuleMenuDsScenario(customize));

const docPropRows = computed(() =>
  isDsScenario.value ? moduleMenuPropRows : cregisModuleMenuPropRows,
);

const docUsageSnippet = computed(() => {
  if (customize.scenario === 'udun') return udunModuleMenuUsageSnippet;
  if (customize.scenario === 'cregis') return cregisModuleMenuUsageSnippet;
  return undefined;
});

const groupCountNum = computed(() => {
  const parsed = Number(customize.groupCount);
  if (!Number.isFinite(parsed)) return 2;
  return Math.min(MODULE_MENU_MAX_GROUPS, Math.max(1, Math.floor(parsed)));
});

const moduleMenuTitle = computed(() => {
  if (isModuleMenuBusinessScenario(customize.scenario)) {
    return resolveModuleMenuBusinessTitle(customize);
  }
  const text = String(customize.moduleTitleText ?? '').trim();
  return text === '' ? 'Module' : text;
});

const businessGroups = computed(() =>
  resolveModuleMenuBusinessGroups(String(customize.scenario) as ModuleMenuScenario),
);

function parseGroupSort(value: unknown, fallbackIndex: number): number {
  const parsed = Number.parseFloat(String(value ?? '').trim());
  if (Number.isFinite(parsed)) return parsed;
  return fallbackIndex + 1;
}

function groupTitleAt(index: number): string | undefined {
  const raw = String(customize[moduleMenuGroupTitleKey(index)] ?? '').trim();
  return raw === '' ? undefined : raw;
}

function groupItemCountAt(index: number): number {
  const parsed = Number(customize[moduleMenuGroupItemCountKey(index)]);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, Math.floor(parsed)));
}

function labelAt(key: string, fallback = 'Label'): string {
  const value = String(customize[key] ?? '').trim();
  return value === '' ? fallback : value;
}

function groupItemHasSubAt(groupIndex: number, itemIndex: number): boolean {
  return String(customize[moduleMenuGroupItemHasSubKey(groupIndex, itemIndex)] ?? 'no') === 'yes';
}

function groupItemTierAt(groupIndex: number, itemIndex: number): 1 | 2 {
  return groupItemHasSubAt(groupIndex, itemIndex) ? 2 : 1;
}

function iconAt(groupIndex: number, itemIndex: number): string {
  const key = moduleMenuGroupItemIconKey(groupIndex, itemIndex);
  const name = String(customize[key] ?? '').trim();
  if (name && getProcessedIcon(name)) return name;
  return showcaseDefaultIconName;
}

function groupItemSubCountAt(groupIndex: number, itemIndex: number): number {
  const parsed = Number(customize[moduleMenuGroupItemSubCountKey(groupIndex, itemIndex)]);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(MODULE_MENU_MAX_SUB_ITEMS, Math.max(1, Math.floor(parsed)));
}

type PreviewItem = {
  tier: 1 | 2;
  label: string;
  icon: string;
  subitems: string[];
  accessory: 'none' | 'message' | 'reddot';
  messageText: string;
};

type PreviewGroup = {
  index: number;
  key: string;
  title?: string;
  sort: number;
  items: PreviewItem[];
};

const previewGroups = computed((): PreviewGroup[] => {
  const groups = Array.from({ length: groupCountNum.value }, (_, index) => {
    const itemCount = groupItemCountAt(index);
    const items = Array.from({ length: itemCount }, (_, itemOffset) => {
      const itemIndex = itemOffset + 1;
      const tier = groupItemTierAt(index, itemIndex);
      const label = labelAt(moduleMenuGroupItemLabelKey(index, itemIndex));
      const subCount = tier === 2 ? groupItemSubCountAt(index, itemIndex) : 0;
      const subitems =
        tier === 2
          ? Array.from({ length: subCount }, (_, subOffset) =>
              labelAt(moduleMenuGroupItemSubLabelKey(index, itemIndex, subOffset + 1)),
            )
          : [];

      const accessoryRaw = String(
        customize[moduleMenuGroupItemAccessoryKey(index, itemIndex)] ?? 'none',
      );
      const accessory =
        accessoryRaw === 'message' || accessoryRaw === 'reddot' ? accessoryRaw : 'none';
      const messageText = String(
        customize[moduleMenuGroupItemMessageTextKey(index, itemIndex)] ?? '0',
      );

      return { tier, label, icon: iconAt(index, itemIndex), subitems, accessory, messageText };
    });

    return {
      index,
      key: `group-${index}`,
      title: groupTitleAt(index),
      sort: parseGroupSort(customize[moduleMenuGroupSortKey(index)], index),
      items,
    };
  });

  return [...groups].sort((left, right) => {
    if (left.sort !== right.sort) return left.sort - right.sort;
    return left.index - right.index;
  });
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Module Menu"
      tall-preview
      :show-doc-title="false"
      component-tag="EgModuleMenu"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="moduleMenuCustomizeControls"
      :customize-defaults="buildModuleMenuCustomizeDefaults()"
      :usage-snippet-override="docUsageSnippet"
      :prop-rows="docPropRows"
      props-section-id="module-menu-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewEffectPanelHost,
            docStyles.previewEffectPanelHostTall,
            organismStyles.previewOrganismPanelHost,
          ]"
        >
          <EgModuleMenu
            :title="moduleMenuTitle"
            :wide="Boolean(customize.wide)"
            :show-edge-divider="Boolean(customize.showEdgeDivider)"
          >
            <template v-if="isDsScenario">
              <EgModuleMenuGroup
                v-for="group in previewGroups"
                :key="group.key"
                :title="group.title"
              >
                <template v-for="(item, itemIndex) in group.items" :key="`${group.key}-item-${itemIndex}`">
                  <EgModuleMenuItem
                    :tier="item.tier"
                    :label="item.label"
                    :message="item.accessory === 'message' ? item.messageText : undefined"
                    :show-reddot="item.accessory === 'reddot'"
                  >
                    <template #icon>
                      <EgIcon :name="item.icon" size="sm" />
                    </template>
                    <template v-if="item.tier === 2">
                      <EgModuleMenuItem
                        v-for="(subLabel, subIndex) in item.subitems"
                        :key="`${group.key}-item-${itemIndex}-sub-${subIndex}`"
                        subitem
                        :label="subLabel"
                      >
                        <template #icon>
                          <EgIcon name="eds-add" size="sm" />
                        </template>
                      </EgModuleMenuItem>
                    </template>
                  </EgModuleMenuItem>
                </template>
              </EgModuleMenuGroup>
            </template>
            <template v-else>
              <EgModuleMenuGroup
                v-for="(group, groupIndex) in businessGroups"
                :key="`business-group-${groupIndex}`"
                :title="group.title"
              >
                <EgModuleMenuItem
                  v-for="(item, itemIndex) in group.items"
                  :key="`business-group-${groupIndex}-item-${itemIndex}`"
                  :label="item.label"
                >
                  <template #icon>
                    <EgIcon :name="item.icon" size="sm" />
                  </template>
                </EgModuleMenuItem>
              </EgModuleMenuGroup>
            </template>
          </EgModuleMenu>
        </div>
      </template>

      <template #customize-after>
        <CustomizePanel
          v-model="customize"
          title="模块标题"
          nested
          sequential
          :controls="moduleMenuTitleCustomizeControls"
        />
        <template v-if="isDsScenario">
          <CustomizePanel
            v-for="groupIndex in groupCountNum"
            :key="`group-panel-${groupIndex}`"
            v-model="customize"
            :title="`组${groupIndex}`"
            nested
            sequential
            :controls="moduleMenuGroupCustomizeControlsList[groupIndex - 1]"
          />
        </template>
      </template>
    </ComponentDocLayout>
  </div>
</template>

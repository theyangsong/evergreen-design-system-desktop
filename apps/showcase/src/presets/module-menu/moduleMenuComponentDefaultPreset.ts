import { buildModuleMenuCustomizeDefaults } from '@/views/components/previews/organismTemplateDocData';
import { buildModuleMenuPreviewGroups } from '@/views/components/previews/moduleMenuPreviewGroups';
import type { ModuleMenuPresetGroup } from './cregisModuleMenuGroups';

/** 组件场景 `buildModuleMenuCustomizeDefaults()` 对应的菜单 preset（业务场景未配置模块的回退源）。 */
export function buildModuleMenuComponentDefaultPresetGroups(): ModuleMenuPresetGroup[] {
  const previewGroups = buildModuleMenuPreviewGroups(buildModuleMenuCustomizeDefaults());

  return previewGroups.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({
      label: item.label,
      icon: item.icon,
      tier: item.tier,
      subitems: item.subitems.map((sub) => ({
        label: sub.label,
        icon: sub.icon,
      })),
      ...(item.accessory === 'message'
        ? {
            message: item.messageText,
            messageType: item.messageType,
            focusBackground: item.messageFocusBackground,
          }
        : {}),
      ...(item.accessory === 'reddot' ? { showReddot: true } : {}),
    })),
  }));
}

/** 缓存：与组件场景默认 customize 同步，勿在运行时 mutate。 */
export const moduleMenuComponentDefaultPresetGroups =
  buildModuleMenuComponentDefaultPresetGroups();

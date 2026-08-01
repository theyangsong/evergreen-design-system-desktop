import {
  cregisModuleMenuGroups,
  type ModuleMenuPresetGroup,
} from '@/presets/module-menu/cregisModuleMenuGroups';
import {
  moduleMenuBusinessTitles,
  type ModuleMenuBusinessTitle,
} from '@/presets/module-menu/businessModuleTitles';
import { udunModuleMenuGroups } from '@/presets/module-menu/udunModuleMenuGroups';
import type { ModuleMenuScenario } from './organismTemplateDocData';

export function isModuleMenuBusinessScenario(scenario: unknown): scenario is Exclude<ModuleMenuScenario, 'module-menu'> {
  return scenario === 'cregis' || scenario === 'udun';
}

export function resolveModuleMenuBusinessGroups(scenario: ModuleMenuScenario): ModuleMenuPresetGroup[] {
  if (scenario === 'udun') return udunModuleMenuGroups;
  if (scenario === 'cregis') return cregisModuleMenuGroups;
  return [];
}

export function resolveModuleMenuBusinessTitle(state: Record<string, unknown>): ModuleMenuBusinessTitle {
  const raw = String(state.moduleBusinessTitle ?? 'Wallet').trim();
  if ((moduleMenuBusinessTitles as readonly string[]).includes(raw)) {
    return raw as ModuleMenuBusinessTitle;
  }
  return 'Wallet';
}

export const cregisModuleMenuUsageSnippet = `<EgModuleMenu title="Wallet">
  <EgModuleMenuGroup title="Overview">
    <EgModuleMenuItem label="Dashboard">
      <template #icon><EgIcon name="eds-wallet" size="sm" /></template>
    </EgModuleMenuItem>
    <EgModuleMenuItem label="Analytics">
      <template #icon><EgIcon name="eds-bill" size="sm" /></template>
    </EgModuleMenuItem>
  </EgModuleMenuGroup>
  <!-- …其余组见 presets/module-menu/cregisModuleMenuGroups.ts -->
</EgModuleMenu>`;

export const udunModuleMenuUsageSnippet = `<EgModuleMenu title="Wallet">
  <EgModuleMenuGroup title="Overview">
    <EgModuleMenuItem label="Dashboard">
      <template #icon><EgIcon name="eds-wallet" size="sm" /></template>
    </EgModuleMenuItem>
    <EgModuleMenuItem label="Analytics">
      <template #icon><EgIcon name="eds-bill" size="sm" /></template>
    </EgModuleMenuItem>
  </EgModuleMenuGroup>
  <!-- …其余组见 presets/module-menu/udunModuleMenuGroups.ts -->
</EgModuleMenu>`;

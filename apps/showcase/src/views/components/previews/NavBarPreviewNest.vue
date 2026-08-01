<script setup lang="ts">
import { computed } from 'vue';
import {
  EgIcon,
  EgNavBar,
  EgNavBarAvatar,
  EgNavBarBottomIcon,
  EgNavBarCorporation,
  EgNavBarModuleItem,
  navBarDefaultBottomUtilities,
} from '@eds/desktop-components';
import { navBarCustomizeDefaults } from './organismTemplateDocData';
import { useNavBarPreviewNest } from './useNavBarPreviewNest';

const props = withDefaults(
  defineProps<{
    customize?: Record<string, unknown>;
  }>(),
  {
    customize: () => navBarCustomizeDefaults,
  },
);

const customizeRef = computed(() => props.customize ?? navBarCustomizeDefaults);

const {
  appEntryCount,
  moduleItems,
  appEntryItems,
  corporationLabel,
  avatarInitials,
  showDivider,
} = useNavBarPreviewNest(customizeRef);
</script>

<template>
  <EgNavBar :show-divider="showDivider" :wide="String(customize.navBarWidth) === '210'">
    <template #corporation>
      <EgNavBarCorporation
        :title="String(customize.corporationTitle ?? '')"
        :subtitle="String(customize.corporationSubtitle ?? '')"
        :label="corporationLabel"
      />
    </template>
    <EgNavBarModuleItem
      v-for="item in moduleItems"
      :key="`module-${item.order}-${item.icon}-${item.focusIcon}`"
      :label="item.label"
      :show-reddot="item.showReddot"
    >
      <EgIcon :key="`module-icon-${item.order}-${item.icon}`" :name="item.icon" size="md" fit />
      <template v-if="item.focusIcon !== item.icon" #focusIcon>
        <EgIcon
          :key="`module-focus-icon-${item.order}-${item.focusIcon}`"
          :name="item.focusIcon"
          size="md"
          fit
        />
      </template>
    </EgNavBarModuleItem>
    <template v-if="appEntryCount > 0" #appEntries>
      <EgNavBarModuleItem
        v-for="item in appEntryItems"
        :key="`app-entry-${item.order}-${item.icon}`"
        app-entry
        :label="item.label"
        :show-reddot="item.showReddot"
      >
        <EgIcon :key="`app-entry-icon-${item.order}-${item.icon}`" :name="item.icon" size="md" fit />
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
      <EgNavBarAvatar :initials="avatarInitials" />
    </template>
  </EgNavBar>
</template>

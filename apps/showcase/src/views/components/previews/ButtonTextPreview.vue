<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgButton, EgIcon } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import buttonStyles from './ButtonPreview.module.css';
import { buttonPropRows, buttonSlotRows } from './buttonPreviewData';
import {
  buildButtonUsageSnippet,
  buttonCustomizeControls,
  buttonCustomizeDefaults,
  buttonTextImportCode,
} from './buttonDocCustomize';

const buttonCustomize = reactive({ ...buttonCustomizeDefaults });

const buttonUsageSnippet = computed(() => buildButtonUsageSnippet(buttonCustomize));

const previewHostClass = computed(() =>
  String(buttonCustomize.tone) === 'sameWhite'
    ? [docStyles.previewButtonHost, buttonStyles.darkSurface]
    : [docStyles.previewButtonHost],
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="buttonCustomize"
      title="Button"
      :show-doc-title="false"
      component-tag="EgButton"
      :import-code="buttonTextImportCode"
      :customize-controls="buttonCustomizeControls"
      :customize-defaults="buttonCustomizeDefaults"
      :usage-snippet-override="buttonUsageSnippet"
      :prop-rows="buttonPropRows"
      :slot-rows="buttonSlotRows"
      props-section-id="button-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="previewHostClass">
          <EgButton
            :tone="buttonCustomize.tone as 'brand' | 'danger' | 'decor' | 'subtle' | 'sameWhite'"
            :variant="buttonCustomize.variant as 'solid' | 'outline' | 'text'"
            :size="buttonCustomize.size as 'lg' | 'md' | 'sm' | 'xs'"
            :disabled="Boolean(buttonCustomize.disabled)"
            :loading="Boolean(buttonCustomize.loading)"
            :icon-position="
              buttonCustomize.showIcon
                ? (buttonCustomize.iconPosition as 'leading' | 'trailing')
                : undefined
            "
          >
            <template v-if="buttonCustomize.showIcon" #icon>
              <EgIcon
                :name="String(buttonCustomize.iconName)"
                size="md"
                fit
              />
            </template>
            {{ buttonCustomize.label }}
          </EgButton>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>

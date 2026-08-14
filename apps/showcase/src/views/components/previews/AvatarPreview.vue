<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { AVATAR_NATIVE_PALETTE, EgAvatar } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import previewPageStyles from './InputPreview.module.css';
import styles from './AvatarPreview.module.css';
import { avatarPropRows, avatarImportCode } from './avatarPreviewData';
import {
  avatarCustomizeControls,
  avatarCustomizeDefaults,
  buildAvatarUsageSnippet,
  resolveAvatarPreviewProps,
} from './avatarDocCustomize';

const avatarCustomize = reactive({
  ...avatarCustomizeDefaults,
  size: avatarCustomizeDefaults.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  variant: avatarCustomizeDefaults.variant as 'initials' | 'robot',
});

const avatarUsageSnippet = computed(() => buildAvatarUsageSnippet(avatarCustomize));

const previewProps = computed(() => resolveAvatarPreviewProps(avatarCustomize));

const previewRenderKey = ref(0);

watch(
  () => [avatarCustomize.randomColor, avatarCustomize.name, avatarCustomize.colorIndexMode],
  () => {
    if (avatarCustomize.randomColor) {
      previewRenderKey.value += 1;
    }
  },
);

function onResetPreview() {
  if (avatarCustomize.randomColor) {
    previewRenderKey.value += 1;
  }
}
</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="avatarCustomize"
      title="Avatar"
      :show-doc-title="false"
      component-tag="EgAvatar"
      :import-code="avatarImportCode"
      :customize-controls="avatarCustomizeControls"
      :customize-defaults="avatarCustomizeDefaults"
      :usage-snippet-override="avatarUsageSnippet"
      :prop-rows="avatarPropRows"
      props-section-id="avatar-props"
      @reset-preview="onResetPreview"
    >
      <template #preview>
        <div class="desktopTokens" :class="[docStyles.previewInputHost, styles.host]">
          <EgAvatar v-bind="previewProps" :key="previewRenderKey" />
        </div>
      </template>
    </ComponentDocLayout>

    <section id="avatar-palette" :class="styles.paletteSection">
      <h3>原色盘（web3-avatar-1 … 20）</h3>
      <p>Display P3 色值来自 Figma User 组件；未指定 colorIndex 时按 name 稳定映射。</p>
      <div :class="styles.paletteGrid">
        <div v-for="(color, index) in AVATAR_NATIVE_PALETTE" :key="color.hex" :class="styles.paletteCell">
          <EgAvatar :name="String(index + 1)" :color-index="index" size="lg" />
          <span :class="styles.paletteLabel">{{ index + 1 }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

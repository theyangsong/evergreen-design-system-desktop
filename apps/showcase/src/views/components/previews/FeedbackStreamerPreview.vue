<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgStreamer } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import streamerStyles from './FeedbackStreamerPreview.module.css';
import {
  buildStreamerUsageSnippet,
  streamerButtonCustomizeControls,
  streamerCustomizeControls,
  streamerCustomizeDefaults,
  streamerImportCode,
  streamerLinkCustomizeControls,
  streamerPropRows,
  streamerSymbolCustomizeControls,
  streamerVisualCustomizeControls,
} from './feedbackDocCustomize';

const customize = reactive({
  ...streamerCustomizeDefaults,
  type: streamerCustomizeDefaults.type as 'info' | 'warning' | 'danger',
  visual: streamerCustomizeDefaults.visual as 'brand' | 'moderate',
  buttonTone: streamerCustomizeDefaults.buttonTone as 'brand' | 'decor' | 'subtle',
  buttonVariant: streamerCustomizeDefaults.buttonVariant as 'solid' | 'outline' | 'text',
  buttonSize: streamerCustomizeDefaults.buttonSize as 'lg' | 'md' | 'sm' | 'xs',
  linkTone: streamerCustomizeDefaults.linkTone as 'brand' | 'decor',
  linkSize: streamerCustomizeDefaults.linkSize as 'md',
});

const usageSnippet = computed(() => buildStreamerUsageSnippet(customize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Streamer"
      :show-doc-title="false"
      component-tag="EgStreamer"
      :import-code="streamerImportCode"
      :customize-controls="streamerCustomizeControls"
      :customize-defaults="streamerCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="streamerPropRows"
      props-section-id="feedback-streamer-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.previewInputHost, streamerStyles.streamerHost]"
        >
          <EgStreamer
            :type="customize.type"
            :visual="customize.visual"
            :text="String(customize.text)"
            :show-symbol="Boolean(customize.showSymbol)"
            :show-button="Boolean(customize.showButton)"
            :button-label="String(customize.buttonLabel)"
            :button-variant="customize.buttonVariant"
            :button-tone="customize.buttonTone"
            :button-size="customize.buttonSize"
            :show-link="Boolean(customize.showLink)"
            :link-label="String(customize.linkLabel)"
            :link-tone="customize.linkTone"
            :link-size="customize.linkSize"
          />
        </div>
      </template>

      <template #customize-extra>
        <CustomizePanel
          v-model="customize"
          title="视觉"
          nested
          embedded
          :controls="streamerVisualCustomizeControls"
        />
        <CustomizePanel
          v-model="customize"
          title="显示符号"
          nested
          embedded
          :controls="streamerSymbolCustomizeControls"
        />
        <CustomizePanel
          v-model="customize"
          title="显示按钮"
          nested
          embedded
          :controls="streamerButtonCustomizeControls"
        />
        <CustomizePanel
          v-model="customize"
          title="Link"
          nested
          embedded
          :controls="streamerLinkCustomizeControls"
        />
      </template>
    </ComponentDocLayout>
  </div>
</template>

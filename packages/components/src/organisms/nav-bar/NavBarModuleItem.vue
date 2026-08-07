<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId, useSlots } from 'vue';
import styles from './NavBar.module.css';
import { useNavBarModuleFocus } from './navBarModuleFocus';
import { useNavBarWide } from './navBarWide';

withDefaults(
  defineProps<{
    label?: string;
    active?: boolean;
    showReddot?: boolean;
    /** 应用入口：保留库内图标原色，不参与模块聚焦 icon 切换。 */
    appEntry?: boolean;
  }>(),
  {
    label: 'Label',
    active: false,
    showReddot: false,
    appEntry: false,
  },
);

const slots = useSlots();
const itemId = useId();
const moduleFocus = useNavBarModuleFocus();
const wide = useNavBarWide();

const isFocused = computed(() => moduleFocus?.focusedId.value === itemId);

const itemMotionClass = computed(() => (isFocused.value ? 'motion-none' : 'motion-ease is-hover'));

onMounted(() => {
  moduleFocus?.register(itemId, 'module');
});

onBeforeUnmount(() => {
  moduleFocus?.unregister(itemId);
});

function onModuleButtonClick(event: MouseEvent) {
  moduleFocus?.select(itemId, event);
}
</script>

<template>
  <div class="eds-nav-bar-module" :class="[styles.moduleItem, wide && styles.moduleItemWide]">
    <button
      v-if="wide"
      type="button"
      :class="[
        styles.moduleRowButton,
        itemMotionClass,
        isFocused && styles.moduleRowButtonFocused,
      ]"
      :aria-label="label"
      :aria-current="active ? 'page' : undefined"
      :aria-pressed="isFocused"
      @click="onModuleButtonClick"
    >
      <span
        :class="[
          styles.moduleRowIcon,
          !appEntry && itemMotionClass,
          slots.focusIcon && !appEntry && styles.moduleIconGlyphWithFocus,
          appEntry && styles.moduleIconGlyphAppEntry,
        ]"
      >
        <span :class="styles.moduleIconDefault">
          <slot />
        </span>
        <span v-if="slots.focusIcon && !appEntry" :class="styles.moduleIconFocus">
          <slot name="focusIcon" />
        </span>
      </span>
      <span :class="[styles.moduleRowLabel, active && styles.moduleRowLabelActive]">{{ label }}</span>
      <span v-if="showReddot" :class="styles.moduleRowReddot" aria-hidden="true" />
    </button>
    <template v-else>
      <div :class="styles.moduleIconHost">
        <button
          type="button"
          :class="[
            styles.moduleIconButton,
            itemMotionClass,
            isFocused && styles.moduleIconButtonFocused,
          ]"
          :aria-label="label"
          :aria-current="active ? 'page' : undefined"
          :aria-pressed="isFocused"
          @click="onModuleButtonClick"
        >
          <span
            :class="[
              styles.moduleIconGlyph,
              !appEntry && itemMotionClass,
              slots.focusIcon && !appEntry && styles.moduleIconGlyphWithFocus,
              appEntry && styles.moduleIconGlyphAppEntry,
            ]"
          >
            <span :class="styles.moduleIconDefault">
              <slot />
            </span>
            <span v-if="slots.focusIcon && !appEntry" :class="styles.moduleIconFocus">
              <slot name="focusIcon" />
            </span>
          </span>
        </button>
        <span v-if="showReddot" :class="styles.moduleReddot" aria-hidden="true" />
      </div>
      <span :class="[styles.moduleLabel, active && styles.moduleLabelActive]">
        <span :class="styles.moduleLabelPaint" aria-hidden="true">{{ label }}</span>
        <span :class="styles.moduleLabelSizer">{{ label }}</span>
      </span>
    </template>
  </div>
</template>

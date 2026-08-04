<script setup lang="ts">
import { computed } from 'vue';
import { EgFlotationMenuItem } from '@eds/desktop-components';
import { buildFlotationPresetItems, parseFlotationItemCount } from './flotationDocCustomize';

const customize = defineModel<Record<string, unknown>>('customize', { required: true });

const presetItems = computed(() => {
  const count = parseFlotationItemCount(customize.value);
  return buildFlotationPresetItems(count, customize.value);
});
</script>

<template>
  <EgFlotationMenuItem
    v-for="(item, index) in presetItems"
    :key="`${item.label}-${index}`"
    :box-type="item.boxType ?? 'text'"
    :label="item.label"
    :disabled="item.disabled"
    :focused="item.focused"
    :show-checkbox="item.showCheckbox"
    :checked="item.checked"
    :show-tag="Boolean(item.showTag)"
    :tag-text="item.tag ?? 'Tag'"
    :tag-status="item.tagStatus ?? 'danger'"
    :show-reddot="item.showReddot"
    :show-cascader="item.showCascader"
    :show-message="item.showMessage"
    :message-text="item.messageText ?? '0'"
    :message-type="item.messageType ?? 'subtle'"
    :symbol-icon="item.symbolIcon ?? 'eds-add'"
  />
</template>

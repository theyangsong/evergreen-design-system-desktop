<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId, useSlots, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgMessage, EgReddot, type MessageType } from '../../molecules/feedback';
import { useModuleMenuItemFocus } from './moduleMenuItemFocus';
import styles from './ModuleMenu.module.css';

/** @deprecated 使用 subitem + tier */
export type ModuleMenuItemLevel = 0 | 1;

export type ModuleMenuItemTier = 1 | 2;

const props = withDefaults(
  defineProps<{
    label?: string;
    tier?: ModuleMenuItemTier;
    subitem?: boolean;
    /** @deprecated 用 subitem（1 → subitem） */
    level?: ModuleMenuItemLevel;
    /** 无 EgModuleMenu 聚焦上下文时的受控聚焦。 */
    focused?: boolean;
    /** @deprecated 使用 focused */
    active?: boolean;
    trailingIcon?: string;
    message?: string;
    messageType?: MessageType;
    showReddot?: boolean;
  }>(),
  {
    label: 'Label',
    tier: 1,
    subitem: false,
    level: undefined,
    focused: false,
    active: false,
    trailingIcon: undefined,
    message: undefined,
    messageType: 'subtle',
    showReddot: false,
  },
);

const expanded = defineModel<boolean>('expanded', { default: false });

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const slots = useSlots();
const itemId = useId();
const menuFocus = useModuleMenuItemFocus();

const isSubitem = computed(() => props.subitem || props.level === 1);

const isTier2Parent = computed(() => props.tier === 2 && !isSubitem.value);

const hasSubitems = computed(() => isTier2Parent.value && Boolean(slots.default));

/** 有下属 Item 的分组父级只负责展开/收起，不参与菜单聚焦。 */
const participatesInFocus = computed(() => !(isTier2Parent.value && hasSubitems.value));

function syncFocusRegistration() {
  if (!menuFocus) return;
  if (participatesInFocus.value) {
    menuFocus.register(itemId);
  } else {
    menuFocus.unregister(itemId);
  }
}

onMounted(syncFocusRegistration);
watch(participatesInFocus, syncFocusRegistration);
onBeforeUnmount(() => {
  menuFocus?.unregister(itemId);
});

const isFocused = computed(() => {
  if (!participatesInFocus.value) return false;
  if (menuFocus) {
    return menuFocus.isFocused(itemId);
  }
  return props.focused || props.active;
});

const branchTrailingIcon = computed((): string | undefined => {
  if (!hasSubitems.value) return undefined;
  if (props.trailingIcon) return props.trailingIcon;
  return expanded.value ? 'eds-arrow-up-mini-ios' : 'eds-arrow-right-mini-ios';
});

const showAccessoryMessage = computed(() => Boolean(props.message?.trim()));

const showAccessoryReddot = computed(
  () => props.showReddot && !props.message?.trim() && !slots.accessory,
);

const hasAccessory = computed(
  () => Boolean(slots.accessory) || showAccessoryMessage.value || showAccessoryReddot.value,
);

const itemClass = computed(() => [
  styles.item,
  styles.itemHover,
  isSubitem.value && styles.itemLevel1,
  isFocused.value && styles.itemFocused,
]);

function onBranchClick(event: MouseEvent) {
  if (participatesInFocus.value) {
    menuFocus?.select(itemId, event);
  }
  if (hasSubitems.value) {
    expanded.value = !expanded.value;
  }
  emit('click', event);
}

function onItemClick(event: MouseEvent) {
  menuFocus?.select(itemId, event);
  emit('click', event);
}
</script>

<template>
  <div v-if="isTier2Parent" :class="styles.itemBranch">
    <button
      type="button"
      class="eds-module-menu-item"
      :class="itemClass"
      :aria-expanded="hasSubitems ? expanded : undefined"
      :aria-pressed="isFocused || undefined"
      @click="onBranchClick"
    >
      <span :class="styles.itemIcon">
        <slot name="icon">
          <EgIcon name="eds-add" size="sm" />
        </slot>
      </span>
      <span :class="styles.itemMain">
        <span :class="styles.itemLabel">{{ label }}</span>
        <span v-if="branchTrailingIcon" :class="styles.itemTrailing">
          <EgIcon :name="branchTrailingIcon" size="sm" fit />
        </span>
      </span>
      <span v-if="hasAccessory" :class="styles.itemAccessory">
        <slot name="accessory">
          <EgMessage
            v-if="showAccessoryMessage"
            :text="String(message)"
            :type="messageType"
          />
          <EgReddot v-else-if="showAccessoryReddot" />
        </slot>
      </span>
    </button>
    <div v-if="hasSubitems && expanded" :class="styles.itemSubList">
      <slot />
    </div>
  </div>
  <button
    v-else
    type="button"
    class="eds-module-menu-item"
    :class="itemClass"
    :aria-pressed="isFocused || undefined"
    @click="onItemClick"
  >
    <span :class="styles.itemIcon">
      <slot name="icon">
        <EgIcon name="eds-add" size="sm" />
      </slot>
    </span>
    <span :class="styles.itemMain">
      <span :class="styles.itemLabel">{{ label }}</span>
    </span>
    <span v-if="hasAccessory" :class="styles.itemAccessory">
      <slot name="accessory">
        <EgMessage v-if="showAccessoryMessage" :text="String(message)" :type="messageType" />
        <EgReddot v-else-if="showAccessoryReddot" />
      </slot>
    </span>
  </button>
</template>

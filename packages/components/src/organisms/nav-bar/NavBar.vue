<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, useAttrs, useSlots } from 'vue';
import { EgIcon, getProcessedIcon } from '../../atoms/icons';
import { EgDivider } from '../../atoms/divider';
import NavBarAvatar from './NavBarAvatar.vue';
import NavBarBottomIcon from './NavBarBottomIcon.vue';
import NavBarCorporation from './NavBarCorporation.vue';
import NavBarModuleFocusProvider from './NavBarModuleFocusProvider.vue';
import NavBarModuleItem from './NavBarModuleItem.vue';
import NavBarSystemButtons from './NavBarSystemButtons.vue';
import {
  resolveDeclarativeAppEntries,
  resolveDeclarativeModules,
  type NavBarDeclarativeProps,
} from './navBarDeclarative';
import { navBarDefaultBottomUtilities } from './navBarBottomUtilities';
import { NAV_BAR_WIDE_KEY } from './navBarWide';
import styles from './NavBar.module.css';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    split?: boolean;
    showSystemButtons?: boolean;
    showDivider?: boolean;
    /** false → 74px（scale-18 + scale-05）；true → 210px（scale-50 + scale-2-5）。右侧分割线另计 1px。 */
    wide?: boolean;
    moduleCount?: number;
    appEntryCount?: number;
    corporationLabel?: string;
    corporationTitle?: string;
    corporationSubtitle?: string;
    avatarInitials?: string;
  }>(),
  {
    split: false,
    showSystemButtons: true,
    showDivider: true,
    wide: false,
  },
);

const attrs = useAttrs();
const slots = useSlots();

provide(
  NAV_BAR_WIDE_KEY,
  computed(() => props.wide),
);

const declarativeProps = computed((): NavBarDeclarativeProps => {
  const result: NavBarDeclarativeProps = {
    moduleCount: props.moduleCount,
    appEntryCount: props.appEntryCount,
    corporationLabel: props.corporationLabel,
    corporationTitle: props.corporationTitle,
    corporationSubtitle: props.corporationSubtitle,
    avatarInitials: props.avatarInitials,
  };

  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'string' || typeof value === 'number') {
      result[key] = value;
    }
  }

  return result;
});

const hasDefaultSlot = computed(() => {
  const render = slots.default;
  if (!render) return false;
  return render({}).length > 0;
});

const declarativeModules = computed(() =>
  hasDefaultSlot.value ? [] : resolveDeclarativeModules(declarativeProps.value),
);

const declarativeAppEntries = computed(() =>
  slots.appEntries ? [] : resolveDeclarativeAppEntries(declarativeProps.value),
);

const useDeclarativeLayout = computed(
  () => declarativeModules.value.length > 0 || declarativeAppEntries.value.length > 0,
);

function resolveIcon(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'eds-add';
  if (getProcessedIcon(trimmed)) return trimmed;
  if (/^eds-(application|business)-\d+$/.test(trimmed)) return trimmed;
  return 'eds-add';
}

const moduleRegionRef = ref<HTMLElement | null>(null);
const moduleRegionContentRef = ref<HTMLElement | null>(null);
const corporationChromeShadow = ref(false);
const individualsChromeShadow = ref(false);
let resizeObserver: ResizeObserver | undefined;
const observedElements = new Set<Element>();
let moduleRegionWheelTarget: HTMLElement | null = null;

const SCROLL_EDGE_EPSILON = 2;

function updateModuleChromeShadow() {
  const region = moduleRegionRef.value;

  if (!region) {
    corporationChromeShadow.value = false;
    individualsChromeShadow.value = false;
    return;
  }

  const { scrollTop, clientHeight, scrollHeight } = region;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;

  if (!canScroll) {
    corporationChromeShadow.value = false;
    individualsChromeShadow.value = false;
    return;
  }

  /*
   * 溢出时才可能出现阴影；各自方向独立判断「底下/上方是否还有被遮挡的内容」：
   * - Corporation（下方阴影）：已向下滚 → 模块从下方滚入顶栏底下
   * - Individuals（上方阴影）：未滚到底 → 模块下方仍有未展示内容
   */
  corporationChromeShadow.value = scrollTop > SCROLL_EDGE_EPSILON;
  individualsChromeShadow.value =
    scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;
}

function clampModuleRegionScroll() {
  const region = moduleRegionRef.value;
  if (!region) return;

  const maxScrollTop = Math.max(0, region.scrollHeight - region.clientHeight);
  if (region.scrollTop < 0) {
    region.scrollTop = 0;
  } else if (region.scrollTop > maxScrollTop) {
    region.scrollTop = maxScrollTop;
  }
}

function onModuleRegionWheel(event: WheelEvent) {
  const region = moduleRegionRef.value;
  if (!region) return;

  const maxScrollTop = region.scrollHeight - region.clientHeight;
  if (maxScrollTop <= 0) return;

  const atTop = region.scrollTop <= 0;
  const atBottom = region.scrollTop >= maxScrollTop - SCROLL_EDGE_EPSILON;
  const scrollingUp = event.deltaY < 0;
  const scrollingDown = event.deltaY > 0;

  if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
    event.preventDefault();
  }
}

function bindModuleRegionWheelListener() {
  const region = moduleRegionRef.value;
  if (!region || region === moduleRegionWheelTarget) return;

  moduleRegionWheelTarget?.removeEventListener('wheel', onModuleRegionWheel);
  moduleRegionWheelTarget = region;
  region.addEventListener('wheel', onModuleRegionWheel, { passive: false });
}

function scheduleChromeShadowCheck() {
  nextTick(() => {
    requestAnimationFrame(() => {
      updateModuleChromeShadow();
    });
  });
}

function observeOverflowTargets() {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      scheduleChromeShadowCheck();
    });
  }

  for (const element of [moduleRegionRef.value, moduleRegionContentRef.value]) {
    if (!element || observedElements.has(element)) continue;
    resizeObserver.observe(element);
    observedElements.add(element);
  }
}

function onModuleRegionScroll() {
  clampModuleRegionScroll();
  updateModuleChromeShadow();
}

onMounted(() => {
  observeOverflowTargets();
  bindModuleRegionWheelListener();
  scheduleChromeShadowCheck();
});

onUpdated(() => {
  observeOverflowTargets();
  bindModuleRegionWheelListener();
  scheduleChromeShadowCheck();
});

onBeforeUnmount(() => {
  moduleRegionWheelTarget?.removeEventListener('wheel', onModuleRegionWheel);
  moduleRegionWheelTarget = null;
  resizeObserver?.disconnect();
  observedElements.clear();
});
</script>

<template>
  <div class="eds-nav-bar-shell" :class="styles.shell">
    <nav
      class="eds-nav-bar"
      :class="[styles.root, split && styles.split, wide && styles.rootWide]"
      aria-label="Application navigation"
    >
      <NavBarModuleFocusProvider>
        <div :class="[styles.corporation, corporationChromeShadow && styles.corporationOverflow]">
          <NavBarSystemButtons v-if="showSystemButtons" />
          <slot v-if="slots.corporation" name="corporation" />
          <NavBarCorporation
            v-else-if="useDeclarativeLayout"
            :label="String(declarativeProps.corporationLabel ?? 'G')"
            :title="String(declarativeProps.corporationTitle ?? '')"
            :subtitle="String(declarativeProps.corporationSubtitle ?? '')"
          />
        </div>
        <EgDivider
          v-if="split"
          :class="styles.splitDivider"
          type="page"
          direction="horizontal"
        />
        <div
          ref="moduleRegionRef"
          :class="styles.moduleRegion"
          @scroll="onModuleRegionScroll"
        >
          <div ref="moduleRegionContentRef" :class="styles.moduleRegionContent">
            <div :class="styles.moduleCombo">
              <div :class="styles.moduleGroup">
                <slot v-if="hasDefaultSlot" />
                <template v-else-if="declarativeModules.length > 0">
                  <NavBarModuleItem
                    v-for="(item, index) in declarativeModules"
                    :key="`declarative-module-${index}`"
                    :label="item.label"
                  >
                    <EgIcon :name="resolveIcon(item.icon)" size="md" fit />
                    <template #focusIcon>
                      <EgIcon :name="resolveIcon(item.focusIcon)" size="md" fit />
                    </template>
                  </NavBarModuleItem>
                </template>
              </div>
              <template v-if="slots.appEntries">
                <EgDivider :class="styles.moduleRegionDivider" type="navigator" />
                <div :class="styles.appEntryItems">
                  <slot name="appEntries" />
                </div>
              </template>
              <template v-else-if="declarativeAppEntries.length > 0">
                <EgDivider :class="styles.moduleRegionDivider" type="navigator" />
                <div :class="styles.appEntryItems">
                  <NavBarModuleItem
                    v-for="(item, index) in declarativeAppEntries"
                    :key="`declarative-app-entry-${index}`"
                    app-entry
                    :label="item.label"
                  >
                    <EgIcon :name="resolveIcon(item.icon)" size="md" fit />
                  </NavBarModuleItem>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div :class="[styles.individuals, individualsChromeShadow && styles.individualsOverflow]">
          <div :class="styles.bottomIcons">
            <slot v-if="slots.utilities" name="utilities" />
            <template v-else-if="useDeclarativeLayout">
              <NavBarBottomIcon
                v-for="(utility, index) in navBarDefaultBottomUtilities"
                :key="`declarative-utility-${index}`"
                :label="utility.label"
              >
                <EgIcon :name="resolveIcon(utility.icon)" size="sm" fit />
                <template #focusIcon>
                  <EgIcon :name="resolveIcon(utility.focusIcon)" size="sm" fit />
                </template>
              </NavBarBottomIcon>
            </template>
          </div>
          <slot v-if="slots.avatar" name="avatar" />
          <NavBarAvatar
            v-else-if="useDeclarativeLayout"
            :initials="String(declarativeProps.avatarInitials ?? 'N')"
          />
        </div>
      </NavBarModuleFocusProvider>
    </nav>
    <EgDivider
      v-if="showDivider"
      :class="styles.edgeDivider"
      direction="vertical"
    />
  </div>
</template>

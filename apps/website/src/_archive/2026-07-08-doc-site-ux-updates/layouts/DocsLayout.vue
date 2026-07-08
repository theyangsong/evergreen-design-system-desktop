<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppRail from '@/components/AppRail/AppRail.vue';
import SectionNav from '@/components/SectionNav/SectionNav.vue';
import { pageEnterAnimationKey } from '@/composables/usePageEnterAnimation';
import { usePreventScrollChaining } from '@/composables/usePreventScrollChaining';
import {
  getSectionIdFromPath,
  sectionNavById,
} from '@/config/navigation';
import styles from './DocsLayout.module.css';

const route = useRoute();
const contentShellRef = ref<HTMLElement | null>(null);

usePreventScrollChaining(contentShellRef);

const sectionId = computed(() => getSectionIdFromPath(route.path));
const sectionNav = computed(() =>
  sectionId.value ? sectionNavById[sectionId.value] : undefined,
);
const sectionNavOpen = ref(false);
const pageEnterAnimationEnabled = ref(false);
const suppressNextPageEnter = ref(false);

provide(pageEnterAnimationKey, pageEnterAnimationEnabled);

const isExplore = computed(() => route.name === 'explore');

const sectionNavCollapsed = computed(() => !sectionNavOpen.value);

function toggleSectionNav() {
  sectionNavOpen.value = !sectionNavOpen.value;
}

function openSectionNav() {
  if (!sectionNavOpen.value) {
    suppressNextPageEnter.value = true;
  }
  sectionNavOpen.value = true;
}

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (!oldPath || newPath === oldPath || isExplore.value) {
      pageEnterAnimationEnabled.value = false;
      return;
    }

    if (suppressNextPageEnter.value) {
      pageEnterAnimationEnabled.value = false;
      suppressNextPageEnter.value = false;
      return;
    }

    pageEnterAnimationEnabled.value =
      sectionNavOpen.value &&
      getSectionIdFromPath(newPath) === getSectionIdFromPath(oldPath);
  },
);

</script>

<template>
  <div
    :class="[
      styles.layout,
      !sectionNav && styles.layoutNoSectionNav,
      isExplore && styles.layoutExplore,
      sectionNav && sectionNavOpen && styles.layoutSectionNavOpen,
      sectionNav && !sectionNavOpen && styles.layoutNavCollapsed,
    ]"
  >
    <AppRail
      :class="styles.hideOnMobile"
      :active-section-id="sectionId"
      @toggle-section-nav="toggleSectionNav"
      @open-section-nav="openSectionNav"
    />

    <div
      v-if="sectionNav"
      :class="[
        styles.sectionNavShell,
        !sectionNavOpen && styles.sectionNavShellCollapsed,
        styles.hideOnMobile,
      ]"
    >
      <SectionNav
        :key="sectionId"
        :config="sectionNav"
        :collapsed="sectionNavCollapsed"
      />
    </div>

    <main :class="[styles.main, isExplore && styles.mainExplore]">
      <div
        v-if="!isExplore"
        ref="contentShellRef"
        data-doc-scroll
        :class="[styles.contentShell, styles.contentShellDoc, 'effect-molde-level']"
      >
        <RouterView />
      </div>
      <div v-else :class="[styles.contentShell, 'effect-molde-level']">
        <RouterView />
      </div>
    </main>
  </div>
</template>

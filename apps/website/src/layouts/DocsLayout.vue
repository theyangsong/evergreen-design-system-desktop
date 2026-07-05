<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppRail from '@/components/AppRail/AppRail.vue';
import SectionNav from '@/components/SectionNav/SectionNav.vue';
import {
  getSectionIdFromPath,
  sectionNavById,
} from '@/config/navigation';
import styles from './DocsLayout.module.css';

const route = useRoute();

const sectionId = computed(() => getSectionIdFromPath(route.path));
const sectionNav = computed(() =>
  sectionId.value ? sectionNavById[sectionId.value] : undefined,
);
const sectionNavOpen = ref(false);

const isExplore = computed(() => route.name === 'explore');

function toggleSectionNav() {
  sectionNavOpen.value = !sectionNavOpen.value;
}

function openSectionNav() {
  sectionNavOpen.value = true;
}
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
      <SectionNav :config="sectionNav" :collapsed="!sectionNavOpen" />
    </div>

    <main :class="[styles.main, isExplore && styles.mainExplore, 'effect-molde-level']">
      <div
        v-if="!isExplore"
        :class="[styles.contentShell, styles.contentShellDoc]"
      >
        <RouterView />
      </div>
      <div v-else :class="styles.contentShell">
        <RouterView />
      </div>
    </main>
  </div>
</template>

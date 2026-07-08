<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import type { SectionNavConfig } from '@/config/navigation';
import { usePreventScrollChaining } from '@/composables/usePreventScrollChaining';
import styles from './SectionNav.module.css';

defineProps<{
  config: SectionNavConfig;
  collapsed?: boolean;
  instant?: boolean;
}>();

const route = useRoute();
const groupsRef = ref<HTMLElement | null>(null);

usePreventScrollChaining(groupsRef);
</script>

<template>
  <aside
    :class="[
      styles.nav,
      collapsed && styles.navCollapsed,
      instant && styles.navInstant,
    ]"
    :aria-label="`${config.title} section navigation`"
    :aria-hidden="collapsed"
  >
    <h2 :class="styles.title">{{ config.title }}</h2>

    <div ref="groupsRef" :class="styles.groups">
      <section v-for="(group, index) in config.groups" :key="index">
        <p v-if="group.title" :class="styles.groupTitle">{{ group.title }}</p>

        <div :class="styles.list">
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            :class="[styles.link, route.path === item.to && styles.linkActive]"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </section>
    </div>
  </aside>
</template>

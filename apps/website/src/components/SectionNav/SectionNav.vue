<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import type { SectionNavConfig } from '@/config/navigation';
import styles from './SectionNav.module.css';

defineProps<{
  config: SectionNavConfig;
  collapsed?: boolean;
}>();

const route = useRoute();
</script>

<template>
  <aside
    :class="styles.nav"
    :aria-label="`${config.title} section navigation`"
    :aria-hidden="collapsed"
  >
    <h2 :class="styles.title">{{ config.title }}</h2>

    <div :class="styles.groups">
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

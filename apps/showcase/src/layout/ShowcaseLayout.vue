<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import styles from './ShowcaseLayout.module.css';
import { navItems } from './nav';
import ThemeToggle from '@/components/shared/ThemeToggle.vue';
</script>

<template>
  <div :class="styles.shell">
    <aside :class="styles.sidebar">
      <div :class="styles.sidebarBody">
        <div :class="styles.brand">
          <span :class="styles.brandMark">S</span>
          <div>
            <p :class="styles.brandTitle">ShowCase</p>
            <p :class="styles.brandSub">v1.0</p>
          </div>
        </div>

        <nav :class="styles.nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :class="styles.navLink"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>

      <div :class="styles.sidebarFooter">
        <ThemeToggle />
      </div>
    </aside>

    <main :class="styles.content">
      <RouterView />
    </main>
  </div>
</template>

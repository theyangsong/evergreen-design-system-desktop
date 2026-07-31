<script setup lang="ts">
import type { Component } from 'vue';
import type { CatalogSection } from '@/data/types';
import { catalogSectionId } from '@/data/components/anchors';
import styles from './CatalogInventory.module.css';

type PreviewEntry = {
  slug: string;
  title: string;
  component: Component;
};

withDefaults(
  defineProps<{
    sections: CatalogSection[];
    layout?: 'grid' | 'document';
    previewBySlug?: Record<string, PreviewEntry>;
  }>(),
  {
    layout: 'grid',
    previewBySlug: () => ({}),
  },
);
</script>

<template>
  <div :class="styles.sections">
    <section
      v-for="section in sections"
      :id="catalogSectionId(section.title)"
      :key="section.title"
      :class="styles.section"
    >
      <h2 :class="styles.sectionTitle">{{ section.title }}</h2>

      <template v-if="layout === 'document'">
        <div :class="styles.entries">
          <template v-if="section.groups">
            <div v-for="group in section.groups" :key="group.title" :class="styles.group">
              <h3 :class="styles.groupTitle">{{ group.title }}</h3>
              <div
                v-for="item in group.items"
                :id="item.slug"
                :key="item.slug"
                :class="styles.entry"
              >
                <h3 :class="styles.itemTitle">{{ item.name }}</h3>
                <component :is="previewBySlug[item.slug].component" v-if="previewBySlug[item.slug]" />
              </div>
            </div>
          </template>

          <div
            v-for="item in section.items"
            :id="item.slug"
            :key="item.slug"
            :class="styles.entry"
          >
            <h3 :class="styles.itemTitle">{{ item.name }}</h3>
            <component :is="previewBySlug[item.slug].component" v-if="previewBySlug[item.slug]" />
          </div>
        </div>
      </template>

      <template v-else>
        <template v-if="section.groups">
          <div v-for="group in section.groups" :key="group.title" :class="styles.group">
            <h3 :class="styles.groupTitle">{{ group.title }}</h3>
            <ul :class="styles.list">
              <li
                v-for="item in group.items"
                :id="item.slug"
                :key="item.slug"
                :class="styles.item"
              >
                <span>{{ item.name }}</span>
                <span
                  v-if="item.status"
                  :class="[styles.badge, item.status === 'implemented' && styles.badgeDone]"
                >
                  {{ item.status }}
                </span>
              </li>
            </ul>
          </div>
        </template>

        <ul v-else :class="styles.list">
          <li
            v-for="item in section.items"
            :id="item.slug"
            :key="item.slug"
            :class="styles.item"
          >
            <span>{{ item.name }}</span>
            <span
              v-if="item.status"
              :class="[styles.badge, item.status === 'implemented' && styles.badgeDone]"
            >
              {{ item.status }}
            </span>
          </li>
        </ul>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DocPageCommon from '@/components/DocPageCommon/DocPageCommon.vue';
import DocPageFooter from '@/components/DocPageFooter/DocPageFooter.vue';
import PageToc from '@/components/PageToc/PageToc.vue';
import { getDocPage } from '@/config/navigation';
import NotFoundView from '@/views/NotFoundView.vue';
import styles from './DocPageView.module.css';

const route = useRoute();
const router = useRouter();
const mode = ref<'design' | 'develop'>('design');

const docPath = computed(
  () => (route.meta.docPath as string | undefined) ?? route.path,
);
const page = computed(() => getDocPage(docPath.value));

const sections = computed(() => {
  if (!page.value) {
    return [];
  }

  if (mode.value === 'develop') {
    return page.value.developSections ?? [];
  }

  return page.value.designSections ?? page.value.placeholderSections ?? [];
});

const tocItems = computed(() =>
  sections.value.map((section) => ({ id: section.id, label: section.title })),
);

watch(mode, () => {
  router.replace({ path: route.path, hash: '' }).catch(() => undefined);
});

watch(
  () => route.path,
  () => {
    mode.value = 'design';
  },
);
</script>

<template>
  <template v-if="page">
    <article :class="styles.content" data-doc-scroll>
      <DocPageCommon
        :title="page.title"
        :description="page.description"
        :meta="page.meta"
      />

      <div :class="styles.body" data-doc-body>
        <section
          v-for="section in sections"
          :id="section.id"
          :key="`${mode}-${section.id}`"
          :class="styles.section"
        >
          <h2 :class="styles.sectionTitle">{{ section.title }}</h2>
        </section>
      </div>

      <DocPageFooter />
    </article>

    <PageToc
      v-model:mode="mode"
      :class="styles.tocColumn"
      :items="tocItems"
    />
  </template>

  <NotFoundView v-else />
</template>

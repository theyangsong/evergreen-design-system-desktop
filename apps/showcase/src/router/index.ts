import { createRouter, createWebHistory } from 'vue-router';
import ShowcaseLayout from '@/layout/ShowcaseLayout.vue';
import TokensView from '@/views/tokens/TokensView.vue';
import ComponentsView from '@/views/components/ComponentsView.vue';
import ComponentDetailView from '@/views/components/ComponentDetailView.vue';
import ScenesView from '@/views/scenes/ScenesView.vue';
import SceneDetailView from '@/views/scenes/SceneDetailView.vue';
import {
  defaultComponentSlug,
  findCatalogItem,
  isValidComponentSlug,
} from '@/data/components/navigation';
import { defaultSceneSlug, isValidSceneSlug, legacyListFieldsSlug } from '@/data/scenes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ShowcaseLayout,
      children: [
        { path: '', redirect: '/components' },
        { path: 'tokens', name: 'tokens', component: TokensView },
        {
          path: 'components',
          component: ComponentsView,
          children: [
            {
              path: '',
              redirect: {
                name: 'component-detail',
                params: { slug: defaultComponentSlug },
              },
            },
            {
              path: ':slug',
              name: 'component-detail',
              component: ComponentDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (typeof slug !== 'string') {
                  return {
                    name: 'component-detail',
                    params: { slug: defaultComponentSlug },
                  };
                }

                const inputHashToPage: Record<string, string> = {
                  'input-input': 'input-input',
                  'input-textarea': 'input-textarea',
                  'input-search': 'input-search',
                  'input-combo': 'input-combo',
                };

                const buttonHashToPage: Record<string, string> = {
                  'button-text': 'button-text',
                  'button-icon': 'button-icon',
                  'button-icon-pro': 'button-icon-pro',
                  'button-link': 'button-link',
                  'button-pagination': 'button-pagination',
                  'button-combo': 'button-combo',
                };

                const tagHashToPage: Record<string, string> = {
                  'tag-system': 'tag-system',
                  'tag-status': 'tag-status',
                  'tag-colorful': 'tag-colorful',
                  'tag-custom': 'tag-custom',
                };

                const toggleHashToPage: Record<string, string> = {
                  'toggle-checkbox': 'toggle-checkbox',
                  'toggle-radio': 'toggle-radio',
                  'toggle-decide': 'toggle-decide',
                  'toggle-switch': 'toggle-switch',
                };

                const tabHashToPage: Record<string, string> = {
                  'tab-segmented-control': 'tab-segmented-control',
                  'tab-tabs': 'tab-tabs',
                };

                const feedbackHashToPage: Record<string, string> = {
                  'feedback-end-feedback-card': 'feedback-end-feedback-card',
                  'feedback-toast': 'feedback-toast',
                  'feedback-message': 'feedback-message',
                  'feedback-reddot': 'feedback-reddot',
                  'feedback-form-submission': 'feedback-form-submission',
                };

                const tooltipHashToPage: Record<string, string> = {
                  'tooltip-container': 'tooltip-container',
                  'tooltip-flotation': 'tooltip-flotation',
                  'tooltip-popup': 'tooltip-popup',
                  'tooltip-subtle': 'tooltip-subtle',
                  'tooltip-molde': 'tooltip-molde',
                };

                if (slug === 'input') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target = anchorId && inputHashToPage[anchorId] ? inputHashToPage[anchorId] : 'input-input';
                  return { path: `/components/${target}` };
                }

                if (slug === 'button') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && buttonHashToPage[anchorId] ? buttonHashToPage[anchorId] : 'button-text';
                  return { path: `/components/${target}` };
                }

                if (slug === 'tag') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && tagHashToPage[anchorId] ? tagHashToPage[anchorId] : 'tag-system';
                  return { path: `/components/${target}` };
                }

                if (slug === 'toggle') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && toggleHashToPage[anchorId]
                      ? toggleHashToPage[anchorId]
                      : 'toggle-checkbox';
                  return { path: `/components/${target}` };
                }

                if (slug === 'tab') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && tabHashToPage[anchorId]
                      ? tabHashToPage[anchorId]
                      : 'tab-segmented-control';
                  return { path: `/components/${target}` };
                }

                if (slug === 'feedback') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && feedbackHashToPage[anchorId]
                      ? feedbackHashToPage[anchorId]
                      : 'feedback-end-feedback-card';
                  return { path: `/components/${target}` };
                }

                if (slug === 'tooltip') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && tooltipHashToPage[anchorId]
                      ? tooltipHashToPage[anchorId]
                      : 'tooltip-container';
                  return { path: `/components/${target}` };
                }

                if (slug === 'menu-box') {
                  return { path: '/components/tooltip-container' };
                }

                if (slug === 'combo') {
                  return { path: '/components/button-combo' };
                }

                if (slug === 'icon-button') {
                  return { path: '/components/button-icon' };
                }

                const buttonLegacySlugs: Record<string, string> = {
                  link: 'button-link',
                  pagination: 'button-pagination',
                  'icon-button-pro': 'button-icon-pro',
                };

                if (slug in buttonLegacySlugs) {
                  return { path: `/components/${buttonLegacySlugs[slug]}` };
                }

                if (!isValidComponentSlug(slug)) {
                  return {
                    name: 'component-detail',
                    params: { slug: defaultComponentSlug },
                  };
                }
              },
            },
          ],
        },
        {
          path: 'scenes',
          component: ScenesView,
          children: [
            {
              path: '',
              redirect: {
                name: 'scene-detail',
                params: { slug: defaultSceneSlug },
              },
            },
            {
              path: ':slug',
              name: 'scene-detail',
              component: SceneDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (slug === legacyListFieldsSlug) {
                  return {
                    name: 'scene-detail',
                    params: { slug: 'list-field-currency' },
                  };
                }
                if (typeof slug !== 'string' || !isValidSceneSlug(slug)) {
                  return {
                    name: 'scene-detail',
                    params: { slug: defaultSceneSlug },
                  };
                }
              },
            },
          ],
        },
      ],
    },
  ],
});

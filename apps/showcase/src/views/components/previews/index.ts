import type { Component } from 'vue';
import IconPreview from './IconPreview.vue';
import CryptoPreview from './CryptoPreview.vue';
import FlotationPreview from './FlotationPreview.vue';
import FlotationTriggerPreview from './FlotationTriggerPreview.vue';
import FlotationBoxPreview from './FlotationBoxPreview.vue';
import TooltipPanelKindPreview from './TooltipPanelKindPreview.vue';
import InputInputPreview from './InputInputPreview.vue';
import InputTextareaPreview from './InputTextareaPreview.vue';
import InputSearchPreview from './InputSearchPreview.vue';
import InputComboPreview from './InputComboPreview.vue';
import ButtonTextPreview from './ButtonTextPreview.vue';
import ButtonIconPreview from './ButtonIconPreview.vue';
import ButtonIconProPreview from './ButtonIconProPreview.vue';
import ButtonLinkPreview from './ButtonLinkPreview.vue';
import ButtonPaginationPreview from './ButtonPaginationPreview.vue';
import ButtonComboPreview from './ButtonComboPreview.vue';
import DividerPreview from './DividerPreview.vue';
import TagSystemPreview from './TagSystemPreview.vue';
import TagStatusPreview from './TagStatusPreview.vue';
import TagColorfulPreview from './TagColorfulPreview.vue';
import ToggleCheckboxPreview from './ToggleCheckboxPreview.vue';
import ToggleRadioPreview from './ToggleRadioPreview.vue';
import ToggleDecidePreview from './ToggleDecidePreview.vue';
import ToggleSwitchPreview from './ToggleSwitchPreview.vue';
import TabSegmentedControlPreview from './TabSegmentedControlPreview.vue';
import TabTabsPreview from './TabTabsPreview.vue';
import FeedbackEndFeedbackCardPreview from './FeedbackEndFeedbackCardPreview.vue';
import FeedbackToastPreview from './FeedbackToastPreview.vue';
import FeedbackMessagePreview from './FeedbackMessagePreview.vue';
import FeedbackReddotPreview from './FeedbackReddotPreview.vue';
import FeedbackFormSubmissionPreview from './FeedbackFormSubmissionPreview.vue';
import NavBarPreview from './NavBarPreview.vue';
import ModuleMenuPreview from './ModuleMenuPreview.vue';
import ToolBarPreview from './ToolBarPreview.vue';
import PaginerPreview from './PaginerPreview.vue';
import ReminderPreview from './ReminderPreview.vue';
import BatchBarPreview from './BatchBarPreview.vue';
import DataListPreview from './DataListPreview.vue';
import ContainerPreview from './ContainerPreview.vue';
import LayoutPreview from './LayoutPreview.vue';
import PopupPreview from './PopupPreview.vue';
import SkidPreview from './SkidPreview.vue';

export type ComponentPreviewEntry = {
  slug: string;
  title: string;
  component: Component;
  /** Component doc layout: no molecule lead; hide doc h2 when it matches page title. */
  usesComponentDocHeader?: boolean;
};

/** Showcase 文档页：预览区高度 280px（见 --showcase-doc-preview-height-compact）。 */
export const compactComponentPreviewSlugs = new Set<string>([
  'input-input',
  'input-textarea',
  'input-search',
  'input-combo',
  'button-text',
  'button-icon',
  'button-icon-pro',
  'button-link',
  'button-pagination',
  'button-combo',
  'tooltip-container',
  'tooltip-flotation',
  'tooltip-popup',
  'tooltip-subtle',
  'tooltip-molde',
  'flotation-trigger',
  'flotation',
  'tag-system',
  'tag-status',
  'tag-colorful',
  'toggle-checkbox',
  'toggle-radio',
  'toggle-decide',
  'toggle-switch',
  'tab-segmented-control',
  'tab-tabs',
  'feedback-end-feedback-card',
  'feedback-toast',
  'feedback-message',
  'feedback-reddot',
  'feedback-form-submission',
  'tool-bar',
  'paginer',
]);

export function usesCompactComponentPreview(slug: string): boolean {
  return compactComponentPreviewSlugs.has(slug);
}

export const componentPreviews: ComponentPreviewEntry[] = [
  { slug: 'input-input', title: 'Input', component: InputInputPreview, usesComponentDocHeader: true },
  { slug: 'input-textarea', title: 'Textarea', component: InputTextareaPreview, usesComponentDocHeader: true },
  { slug: 'input-search', title: 'Search', component: InputSearchPreview, usesComponentDocHeader: true },
  { slug: 'input-combo', title: 'Combo', component: InputComboPreview, usesComponentDocHeader: true },
  { slug: 'button-text', title: 'Button', component: ButtonTextPreview, usesComponentDocHeader: true },
  { slug: 'button-icon', title: 'iCons Container Simple', component: ButtonIconPreview, usesComponentDocHeader: true },
  { slug: 'button-icon-pro', title: 'iCons Container Professional', component: ButtonIconProPreview, usesComponentDocHeader: true },
  { slug: 'button-link', title: 'Link', component: ButtonLinkPreview, usesComponentDocHeader: true },
  { slug: 'button-pagination', title: 'Pagination', component: ButtonPaginationPreview, usesComponentDocHeader: true },
  { slug: 'button-combo', title: 'Combo', component: ButtonComboPreview, usesComponentDocHeader: true },
  { slug: 'divider', title: 'Divider', component: DividerPreview, usesComponentDocHeader: true },
  { slug: 'tag-system', title: 'System', component: TagSystemPreview, usesComponentDocHeader: true },
  { slug: 'tag-status', title: 'Status', component: TagStatusPreview, usesComponentDocHeader: true },
  { slug: 'tag-colorful', title: 'Colorful', component: TagColorfulPreview, usesComponentDocHeader: true },
  { slug: 'toggle-checkbox', title: 'Checkbox', component: ToggleCheckboxPreview, usesComponentDocHeader: true },
  { slug: 'toggle-radio', title: 'Radio', component: ToggleRadioPreview, usesComponentDocHeader: true },
  { slug: 'toggle-decide', title: 'Decide', component: ToggleDecidePreview, usesComponentDocHeader: true },
  { slug: 'toggle-switch', title: 'Switch', component: ToggleSwitchPreview, usesComponentDocHeader: true },
  {
    slug: 'tab-segmented-control',
    title: 'Segmented Control',
    component: TabSegmentedControlPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'tab-tabs', title: 'Tabs', component: TabTabsPreview, usesComponentDocHeader: true },
  {
    slug: 'feedback-end-feedback-card',
    title: 'End Feedback Card',
    component: FeedbackEndFeedbackCardPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'feedback-toast', title: 'Toast', component: FeedbackToastPreview, usesComponentDocHeader: true },
  { slug: 'feedback-message', title: 'Message', component: FeedbackMessagePreview, usesComponentDocHeader: true },
  { slug: 'feedback-reddot', title: 'Reddot', component: FeedbackReddotPreview, usesComponentDocHeader: true },
  {
    slug: 'feedback-form-submission',
    title: 'Form Submission',
    component: FeedbackFormSubmissionPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'nav-bar', title: 'Nav Bar', component: NavBarPreview, usesComponentDocHeader: true },
  { slug: 'module-menu', title: 'Module Menu', component: ModuleMenuPreview, usesComponentDocHeader: true },
  { slug: 'tool-bar', title: 'Tool Bar', component: ToolBarPreview, usesComponentDocHeader: true },
  { slug: 'paginer', title: 'Paginer', component: PaginerPreview, usesComponentDocHeader: true },
  { slug: 'data-list', title: 'Data List', component: DataListPreview, usesComponentDocHeader: true },
  { slug: 'reminder', title: 'Reminder', component: ReminderPreview, usesComponentDocHeader: true },
  { slug: 'batch-bar', title: 'Batch Bar', component: BatchBarPreview, usesComponentDocHeader: true },
  { slug: 'container', title: 'Container', component: ContainerPreview, usesComponentDocHeader: true },
  { slug: 'layout', title: 'Layout', component: LayoutPreview, usesComponentDocHeader: true },
  { slug: 'popup', title: 'Popup', component: PopupPreview, usesComponentDocHeader: true },
  { slug: 'skid', title: 'Skid', component: SkidPreview, usesComponentDocHeader: true },
  { slug: 'icons', title: 'Icon', component: IconPreview },
  { slug: 'crypto', title: 'Crypto', component: CryptoPreview },
  ...([
    { slug: 'tooltip-container', title: 'Container Box' },
    { slug: 'tooltip-flotation', title: 'Flotation Box' },
    { slug: 'tooltip-popup', title: 'Popup Box' },
    { slug: 'tooltip-subtle', title: 'Subtle Card' },
    { slug: 'tooltip-molde', title: 'Molde Level' },
  ] as const).map(({ slug, title }) => ({
    slug,
    title,
    component: TooltipPanelKindPreview,
    usesComponentDocHeader: true,
  })),
  { slug: 'flotation', title: 'Combo', component: FlotationPreview, usesComponentDocHeader: true },
  {
    slug: 'flotation-trigger',
    title: 'Trigger',
    component: FlotationTriggerPreview,
    usesComponentDocHeader: true,
  },
  {
    slug: 'flotation-box',
    title: 'Box',
    component: FlotationBoxPreview,
    usesComponentDocHeader: true,
  },
];

export const componentPreviewBySlug = Object.fromEntries(
  componentPreviews.map((entry) => [entry.slug, entry]),
) as Record<string, ComponentPreviewEntry>;

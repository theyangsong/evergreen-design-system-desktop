import type { CatalogSection } from '../types';

export const componentCatalog: CatalogSection[] = [
  {
    title: 'Atoms',
    items: [
      {
        name: 'Icons',
        slug: 'icons',
        description: 'SVG icon set for Desktop applications.',
        status: 'implemented',
      },
      {
        name: 'Crypto',
        slug: 'crypto',
        description: 'Cryptocurrency icons and asset marks.',
        status: 'implemented',
      },
      {
        name: 'Avatar',
        slug: 'avatar',
        description: 'User avatar with initials or robot fallback.',
        status: 'implemented',
      },
      {
        name: 'Divider',
        slug: 'divider',
        description: 'Horizontal and vertical content dividers.',
        status: 'implemented',
      },
      {
        name: 'ScensMotion',
        slug: 'scens-motion',
        description: 'Scenario-based motion previews for Desktop components.',
        status: 'implemented',
      },
    ],
  },
  {
    title: 'Molecules',
    items: [
      {
        name: 'Input',
        slug: 'input',
        description: '文本与金额输入框，支持清空、单位与 Max 操作。',
        status: 'implemented',
        children: [
          { id: 'input-input', label: 'Input', standalonePage: true },
          { id: 'input-textarea', label: 'Textarea', standalonePage: true },
          { id: 'input-search', label: 'Scens', standalonePage: true },
          { id: 'input-combo', label: 'Combo', standalonePage: true },
        ],
      },
      {
        name: 'Button',
        slug: 'button',
        description: 'Label, icon, link, and pagination button variants for actions and navigation.',
        status: 'implemented',
        children: [
          { id: 'button-text', label: 'Button', standalonePage: true },
          { id: 'button-icon', label: 'iCons Container Simple', standalonePage: true },
          { id: 'button-icon-pro', label: 'iCons Container Professional', standalonePage: true },
          { id: 'button-link', label: 'Link', standalonePage: true },
          { id: 'button-pagination', label: 'Scens', standalonePage: true },
          { id: 'button-combo', label: 'Combo', standalonePage: true },
        ],
      },
      {
        name: 'Tooltip',
        slug: 'tooltip',
        description: '点击打开的磨砂浮层面板；支持自适应/固定宽度，高度可配置。',
        status: 'implemented',
        children: [
          { id: 'tooltip-container', label: 'Container Box', standalonePage: true },
          { id: 'tooltip-flotation', label: 'Flotation Box', standalonePage: true },
          { id: 'tooltip-popup', label: 'Popup Box', standalonePage: true },
          { id: 'tooltip-subtle', label: 'Subtle Card', standalonePage: true },
          { id: 'tooltip-molde', label: 'Molde Level', standalonePage: true },
        ],
      },
      {
        name: 'Flotation',
        slug: 'flotation',
        description:
          '浮层下拉：#trigger / #content 插槽；预置 Trigger（Style/Size）与 Box（Type），Menu 嵌套 EgTooltip。',
        status: 'implemented',
        children: [
          { id: 'flotation-trigger', label: 'Trigger', standalonePage: true },
          { id: 'flotation-box', label: 'Box', standalonePage: true },
          { id: 'flotation-overview', label: 'Combo', standalonePage: true, pageSlug: 'flotation' },
        ],
      },
      {
        name: 'Tag',
        slug: 'tag',
        description: 'Compact labels for status and metadata.',
        status: 'implemented',
        children: [
          { id: 'tag-system', label: 'System', standalonePage: true },
          { id: 'tag-status', label: 'Status', standalonePage: true },
          { id: 'tag-colorful', label: 'Colorful', standalonePage: true },
          { id: 'tag-custom', label: 'Custom', standalonePage: true },
        ],
      },
      {
        name: 'Toggle',
        slug: 'toggle',
        description: 'Checkbox, radio, decide, and switch controls.',
        status: 'implemented',
        children: [
          { id: 'toggle-checkbox', label: 'Checkbox', standalonePage: true },
          { id: 'toggle-radio', label: 'Radio', standalonePage: true },
          { id: 'toggle-decide', label: 'Decide', standalonePage: true },
          { id: 'toggle-switch', label: 'Switch', standalonePage: true },
        ],
      },
      {
        name: 'Tab',
        slug: 'tab',
        description: 'Segmented control and underline tabs.',
        status: 'implemented',
        children: [
          { id: 'tab-segmented-control', label: 'Segmented Control', standalonePage: true },
          { id: 'tab-tabs', label: 'Tabs', standalonePage: true },
        ],
      },
      {
        name: 'Feedback',
        slug: 'feedback',
        description: 'Inline feedback messages and callouts.',
        status: 'implemented',
        children: [
          { id: 'feedback-end-feedback-card', label: 'End Feedback Card', standalonePage: true },
          { id: 'feedback-toast', label: 'Toast', standalonePage: true },
          { id: 'feedback-message', label: 'Message', standalonePage: true },
          { id: 'feedback-reddot', label: 'Reddot', standalonePage: true },
          { id: 'feedback-form-submission', label: 'Form Submission', standalonePage: true },
          { id: 'feedback-streamer', label: 'Streamer', standalonePage: true },
        ],
      },
      {
        name: 'Popovers',
        slug: 'popovers',
        description: 'Anchored overlays for menus and lightweight panels.',
        status: 'implemented',
        children: [
          { id: 'popovers-popover', label: 'Popover', standalonePage: true },
          { id: 'popovers-scens', label: 'Scens', standalonePage: true },
        ],
      },
      {
        name: 'Countdown',
        slug: 'countdown',
        description: 'Time remaining display for timed actions.',
        status: 'placeholder',
      },
      {
        name: 'Progress',
        slug: 'progress',
        description: 'Linear and circular progress indicators.',
        status: 'implemented',
      },
      {
        name: 'Loading',
        slug: 'loading',
        description: 'Loading spinners and skeleton placeholders.',
        status: 'placeholder',
      },
      {
        name: 'Upload',
        slug: 'upload',
        description: 'File upload trigger and drag-and-drop area.',
        status: 'placeholder',
      },
    ],
  },
  {
    title: 'Organisms',
    items: [
      {
        name: 'Nav Bar',
        slug: 'nav-bar',
        description: 'Top application navigation bar.',
        status: 'implemented',
      },
      {
        name: 'Module Menu',
        slug: 'module-menu',
        description: 'Module switcher for multi-area applications.',
        status: 'implemented',
      },
      {
        name: 'Tool Bar',
        slug: 'tool-bar',
        description: 'Contextual toolbar for page-level actions.',
        status: 'implemented',
      },
      {
        name: 'Paginer',
        slug: 'paginer',
        description: 'Pagination controls for long lists and tables.',
        status: 'implemented',
      },
      {
        name: 'Detail',
        slug: 'detail',
        description: 'Popup detail layout for entity inspection (880px).',
        status: 'implemented',
      },
      {
        name: 'Data Table View',
        slug: 'data-table-view',
        description: 'Read-only data table with sorting and filters.',
        status: 'placeholder',
      },
      {
        name: 'Data Table Edit',
        slug: 'data-table-edit',
        description: 'Editable data table for inline record updates.',
        status: 'placeholder',
      },
      {
        name: 'Data List',
        slug: 'data-list',
        description: 'Scrollable list layout for structured records.',
        status: 'implemented',
      },
      {
        name: 'Reminder',
        slug: 'reminder',
        description: 'Reminder banner for pending user actions.',
        status: 'implemented',
      },
      {
        name: 'Verify',
        slug: 'verify',
        description: 'Verification step flow for security checks.',
        status: 'implemented',
      },
      {
        name: 'Filter',
        slug: 'filter',
        description: 'Filter panel for narrowing list and table results.',
        status: 'implemented',
      },
      {
        name: 'Batch Bar',
        slug: 'batch-bar',
        description: 'Bulk action bar for multi-selected items.',
        status: 'implemented',
      },
    ],
  },
  {
    title: 'Templates',
    items: [
      {
        name: 'Container',
        slug: 'container',
        description: 'Page container with standard content width.',
        status: 'implemented',
      },
      {
        name: 'Layout',
        slug: 'layout',
        description: 'Application shell layout scaffold.',
        status: 'implemented',
      },
      {
        name: 'Popup',
        slug: 'popup',
        description: 'Modal and popup page framing.',
        status: 'implemented',
      },
      {
        name: 'Skid',
        slug: 'skid',
        description: 'Sliding panel template for secondary flows.',
        status: 'implemented',
      },
    ],
  },
];

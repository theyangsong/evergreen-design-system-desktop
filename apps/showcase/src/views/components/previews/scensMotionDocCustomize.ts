import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { propLabelSelectOptions } from '@/data/showcasePropLabels';

export const scensMotionScenarioLabels = {
  'verify-ring-dots': '验证外圈点阵',
  'done-tick': '成功',
} as const;

export type ScensMotionScenario = keyof typeof scensMotionScenarioLabels;

export const scensMotionInteractionLabels = {
  full: '完整',
  idle: '默认',
  verifying: '进行中',
  success: '成功',
  error: '失败',
} as const;

export type ScensMotionInteraction = keyof typeof scensMotionInteractionLabels;

export const scensMotionToneLabels = {
  success: '成功',
  brand: '品牌',
} as const;

export type ScensMotionTone = keyof typeof scensMotionToneLabels;

export const scensMotionCustomizeDefaults = {
  scenario: 'verify-ring-dots' as ScensMotionScenario,
  interaction: 'full' as ScensMotionInteraction,
  tone: 'success' as ScensMotionTone,
};

export const scensMotionCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'scenario',
    label: '场景化',
    options: propLabelSelectOptions(
      Object.keys(scensMotionScenarioLabels) as ScensMotionScenario[],
      scensMotionScenarioLabels,
    ),
  },
  {
    kind: 'select',
    key: 'tone',
    label: '色调',
    options: propLabelSelectOptions(
      Object.keys(scensMotionToneLabels) as ScensMotionTone[],
      scensMotionToneLabels,
    ),
    visibleWhen: (state) => state.scenario === 'done-tick',
  },
  {
    kind: 'select',
    key: 'interaction',
    label: '交互',
    options: propLabelSelectOptions(
      Object.keys(scensMotionInteractionLabels) as ScensMotionInteraction[],
      scensMotionInteractionLabels,
    ),
    visibleWhen: (state) => state.scenario === 'verify-ring-dots',
  },
];

export const scensMotionRingDotsImportCode =
  "import { EgVerifyRingDots } from '@eds/desktop-components';";

export const scensMotionDoneTickImportCode =
  "import { EgDoneTick } from '@eds/desktop-components';";

export const scensMotionRingDotsPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'false',
    description:
      '为 true 时 36 点追光（--verify-ring-dot-color: var(--material-brand-primary)）；false 时静止（--material-brand-quaternary）。',
  },
];

export const scensMotionDoneTickPropRows: DocPropRow[] = [
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description:
      'EgDoneTick 无 props；挂载后播放 SVG 描边动画（eds-animation-done 时序）；颜色由 --done-tick-color 控制（默认 var(--status-success)，品牌 var(--material-brand-primary)）。',
  },
];

/** @deprecated use scensMotionRingDotsImportCode */
export const scensMotionImportCode = scensMotionRingDotsImportCode;

/** @deprecated use scensMotionRingDotsPropRows */
export const scensMotionPropRows = scensMotionRingDotsPropRows;

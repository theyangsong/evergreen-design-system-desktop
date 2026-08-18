import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { propLabelSelectOptions } from '@/data/showcasePropLabels';

export const scensMotionScenarioLabels = {
  'verify-ring-dots': '验证外圈点阵',
  'done-tick': '成功',
  'motion-processing': '时间',
  'ripple-pulse': '波纹脉冲',
  'mnemonic-verify': '助记词校验中',
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

export const scensMotionProcessingToneLabels = {
  warning: '进行中',
  brand: '品牌',
} as const;

export type ScensMotionTone = keyof typeof scensMotionToneLabels;
export type ScensMotionProcessingTone = keyof typeof scensMotionProcessingToneLabels;

export const scensMotionCustomizeDefaults = {
  scenario: 'verify-ring-dots' as ScensMotionScenario,
  interaction: 'full' as ScensMotionInteraction,
  tone: 'brand' as ScensMotionTone,
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
    key: 'interaction',
    label: '交互',
    options: propLabelSelectOptions(
      Object.keys(scensMotionInteractionLabels) as ScensMotionInteraction[],
      scensMotionInteractionLabels,
    ),
    visibleWhen: (state) => state.scenario === 'verify-ring-dots',
  },
];

export const scensMotionSuccessBrandToneControl: DocCustomizeControl = {
  kind: 'select',
  key: 'tone',
  label: '色调',
  options: propLabelSelectOptions(
    Object.keys(scensMotionToneLabels) as ScensMotionTone[],
    scensMotionToneLabels,
  ),
};

export const scensMotionProcessingToneControl: DocCustomizeControl = {
  kind: 'select',
  key: 'tone',
  label: '色调',
  options: propLabelSelectOptions(
    Object.keys(scensMotionProcessingToneLabels) as ScensMotionProcessingTone[],
    scensMotionProcessingToneLabels,
  ),
};

export function buildScensMotionCustomizeControls(options?: {
  lockScenario?: boolean;
  scenario?: ScensMotionScenario;
}): DocCustomizeControl[] {
  const scenario = options?.scenario ?? scensMotionCustomizeDefaults.scenario;
  const controls: DocCustomizeControl[] = [];

  if (!options?.lockScenario) {
    controls.push(scensMotionCustomizeControls[0]);
  }

  if (scenario === 'verify-ring-dots') {
    controls.push(scensMotionCustomizeControls[1]);
    controls.push(scensMotionSuccessBrandToneControl);
  } else if (scenario === 'motion-processing') {
    controls.push(scensMotionProcessingToneControl);
  } else if (
    scenario === 'done-tick' ||
    scenario === 'ripple-pulse' ||
    scenario === 'mnemonic-verify'
  ) {
    controls.push(scensMotionSuccessBrandToneControl);
  }

  return controls;
}

export const scensMotionRingDotsImportCode =
  "import { EgVerifyRingDots } from '@eds/desktop-components';";

export const scensMotionDoneTickImportCode =
  "import { EgDoneTick } from '@eds/desktop-components';";

export const scensMotionMotionProcessingImportCode =
  "import { EgMotionProcessing } from '@eds/desktop-components';";

export const scensMotionRipplePulseImportCode =
  "import { EgRipplePulse } from '@eds/desktop-components';";

export const scensMotionMnemonicVerifyImportCode =
  "import { EgMnemonicVerify } from '@eds/desktop-components';";

export const scensMotionRingDotsPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'false',
    description:
      '为 true 时 36 点追光（--verify-ring-dot-color: var(--material-brand-primary)）；false 时静止（--material-brand-tertiary）。',
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

export const scensMotionMotionProcessingPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description:
      '为 true 时长轴 1.2s / 短轴 20s 独立匀速旋转（短轴初始 45°）；false 时静止。--motion-processing-size 缩放轴长/中心点（基准 26）；--motion-processing-stroke 线宽（默认 2px，不随 size 变）；--motion-processing-color 颜色。',
  },
];

export const scensMotionRipplePulsePropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description:
      '为 true 时三环 ripple（1.5s ease-out，stagger 500ms，scale 0.1→1.2）；false 时静止。--ripple-pulse-size（80px）/ --ripple-pulse-stroke（0.5px）/ --ripple-pulse-duration / --ripple-pulse-stagger / --ripple-pulse-start-scale / --ripple-pulse-end-scale / --ripple-pulse-color。',
  },
];

export const scensMotionMnemonicVerifyPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description:
      '为 true 时 4×4 方块沿对角线 scale 0→1→0（1533ms / stagger 100ms，Lottie 46f@30fps）；false 时静止满格。--mnemonic-verify-size（32px）/ --mnemonic-verify-duration / --mnemonic-verify-stagger / --mnemonic-verify-color。',
  },
];

/** @deprecated use scensMotionRingDotsImportCode */
export const scensMotionImportCode = scensMotionRingDotsImportCode;

/** @deprecated use scensMotionRingDotsPropRows */
export const scensMotionPropRows = scensMotionRingDotsPropRows;

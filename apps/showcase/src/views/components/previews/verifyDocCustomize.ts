import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import type { VerifyType } from '@eds/desktop-components';
import { getVerifyTypePreset, VERIFY_TYPE_PRESETS } from '@eds/desktop-components';
import { propLabelSelectOptions } from '@/data/showcasePropLabels';

export const verifyFigmaNode = '0:115';

export const showcaseVerifyTypeLabels = {
  'single-email': '单-邮箱验证',
  'single-google': '单-Google验证',
  'single-trade-password': '单-交易密码',
  'single-login-password': '单-登录密码',
  'single-passkey': '单-PassKey',
  'dual-2fa': '双-2FA',
  locked: '锁定',
} as const;

export const showcaseVerifyStateLabels = {
  idle: '默认',
  verifying: '校验中',
  success: '校验成功',
  error: '校验失败',
} as const;

export const showcaseVerifyActionToneLabels = {
  brand: 'Brand',
  decor: 'Decor',
} as const;

const VERIFY_TYPES = Object.keys(VERIFY_TYPE_PRESETS) as VerifyType[];

const isPasswordVerifyType = (type: unknown) =>
  type === 'single-trade-password' || type === 'single-login-password';

export const verifyCustomizeDefaults = {
  type: 'single-email' as VerifyType,
  state: 'idle' as 'idle' | 'verifying' | 'success' | 'error',
  title: VERIFY_TYPE_PRESETS['single-email'].title,
  secondaryText: VERIFY_TYPE_PRESETS['single-email'].secondaryText,
  countdownSeconds: '60',
  switchLabel: VERIFY_TYPE_PRESETS['single-email'].switchLabel,
  switchDisabled: false,
  demoCode: '',
  confirmLabel: '确定',
  cancelLabel: '取消',
  actionTone: 'decor',
};

export function applyVerifyTypePresetToState(
  state: Record<string, unknown>,
  type: VerifyType,
): void {
  const preset = getVerifyTypePreset(type);
  state.type = type;
  state.title = preset.title;
  state.secondaryText = preset.secondaryText;
  state.switchLabel = preset.switchLabel;
  if (type === 'locked') {
    state.switchDisabled = true;
  }
}

export function applyVerifyTypePresetToPopupState(
  state: Record<string, unknown>,
  type: VerifyType,
): void {
  applyVerifyTypePresetToState(state, type);
  state.verifyType = type;
}

export const popupVerifyCustomizeDefaults = {
  verifyType: verifyCustomizeDefaults.type,
};

export const popupVerifyCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'verifyType',
    label: '验证方式',
    options: propLabelSelectOptions(VERIFY_TYPES, showcaseVerifyTypeLabels),
    visibleWhen: (state) => state.uses === 'verify',
  },
];

export const verifyCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '验证方式',
    options: propLabelSelectOptions(VERIFY_TYPES, showcaseVerifyTypeLabels),
  },
  {
    kind: 'select',
    key: 'state',
    label: '状态',
    options: propLabelSelectOptions(
      ['idle', 'verifying', 'success', 'error'] as const,
      showcaseVerifyStateLabels,
    ),
  },
  { kind: 'text', key: 'title', label: '标题' },
  { kind: 'text', key: 'secondaryText', label: '副文案' },
  {
    kind: 'text',
    key: 'countdownSeconds',
    label: '倒计时（秒）',
    visibleWhen: (state) =>
      state.state !== 'error'
      && state.type !== 'locked'
      && state.type !== 'single-trade-password'
      && state.type !== 'single-login-password',
  },
  {
    kind: 'text',
    key: 'switchLabel',
    label: '切换文案',
    visibleWhen: (state) =>
      state.type !== 'locked'
      && state.type !== 'single-trade-password'
      && state.type !== 'single-login-password',
  },
  {
    kind: 'boolean',
    key: 'switchDisabled',
    label: '切换不可用',
    visibleWhen: (state) =>
      state.state === 'error'
      && state.type !== 'locked'
      && state.type !== 'single-trade-password'
      && state.type !== 'single-login-password',
  },
  {
    kind: 'text',
    key: 'confirmLabel',
    label: '确认文案',
    visibleWhen: (state) => isPasswordVerifyType(state.type),
  },
  {
    kind: 'text',
    key: 'cancelLabel',
    label: '取消文案',
    visibleWhen: (state) => isPasswordVerifyType(state.type),
  },
  {
    kind: 'select',
    key: 'actionTone',
    label: '按钮 Tone',
    options: propLabelSelectOptions(
      ['brand', 'decor'] as const,
      showcaseVerifyActionToneLabels,
    ),
    visibleWhen: (state) => isPasswordVerifyType(state.type),
  },
];

export const verifyPropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'single-email' | 'single-google' | … | 'locked'",
    defaultValue: "'single-email'",
    description:
      '验证场景。Popup Box 固定宽高随 type 变化（如邮箱 328×436、2FA 358×459），不可在 Showcase 改。',
  },
  {
    name: 'state',
    type: "'idle' | 'verifying' | 'success' | 'error'",
    defaultValue: "'idle'",
    description:
      '校验状态。外圈 36 点静止/追光（仅 verifying 动）；success 仅内圈勾号；error 时 OTP 红底 + 左右晃动；重新输入 emit recover。',
  },
  {
    name: 'title',
    type: 'string',
    defaultValue: '—',
    description: '标题；省略时使用 type 预设。',
  },
  {
    name: 'secondaryText',
    type: 'string',
    defaultValue: '—',
    description: '说明文案；省略时使用 type 预设。',
  },
  {
    name: 'modelValue (v-model)',
    type: 'string',
    defaultValue: "''",
    description: '验证码字符串；OTP 满 codeLength 位或密码点确定 emit complete。',
  },
  {
    name: 'forgotPasswordLabel',
    type: 'string',
    defaultValue: "'忘记密码?'",
    description: '交易/登录密码场景「忘记密码」链接文案。',
  },
  {
    name: 'confirmLabel',
    type: 'string',
    defaultValue: "'确定'",
    description: '交易/登录密码场景确认按钮文案。',
  },
  {
    name: 'cancelLabel',
    type: 'string',
    defaultValue: "'取消'",
    description: '交易/登录密码场景取消按钮文案。',
  },
  {
    name: 'actionTone',
    type: "'brand' | 'decor'",
    defaultValue: "'decor'",
    description: '交易/登录密码场景 EgComboActionPopupWindow 按钮 Tone（确认 solid、取消 text 同 tone）。',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: "'请输入'",
    description: '交易/登录密码输入框占位文案。',
  },
  {
    name: 'codeLength',
    type: 'number',
    defaultValue: '6',
    description: '验证码位数。',
  },
  {
    name: 'countdownSeconds',
    type: 'number | null',
    defaultValue: '60',
    description: '倒计时秒数（默认 60）；归零后在倒计时位置显示 retryLabel；error 时 retryLabel 在底部。',
  },
  {
    name: 'switchDisabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '底部切换不可用（仍展示，勿隐藏）。',
  },
];

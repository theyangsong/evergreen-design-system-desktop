/** Showcase 文档站支持的语言。 */
export const SHOWCASE_LOCALES = ['en', 'zh-Hans', 'zh-Hant'] as const;

export type ShowcaseLocale = (typeof SHOWCASE_LOCALES)[number];

/** 英 / 简中 / 繁中三元文案。 */
export type ShowcaseI18nText = Record<ShowcaseLocale, string>;

export type ShowcaseI18nNamespace =
  | 'components'
  | 'patterns'
  | 'scenes'
  | 'animations'
  | 'nav'
  | 'section'
  | 'group';

/** 稳定键：`{namespace}:{slug|id}`，如 `components:family:input`、`components:page:input-search`。 */
export type ShowcaseI18nKey = `${ShowcaseI18nNamespace}:${string}`;

export type ShowcaseI18nEntry = {
  key: ShowcaseI18nKey;
  name: ShowcaseI18nText;
  description?: ShowcaseI18nText;
};

export type ShowcaseI18nRegistry = {
  readonly locale: ShowcaseLocale;
  setLocale: (locale: ShowcaseLocale) => void;
  /** 解析任意已注册键的显示名。 */
  name: (key: ShowcaseI18nKey | string, fallback?: string) => string;
  /** 解析任意已注册键的说明文案。 */
  description: (key: ShowcaseI18nKey | string, fallback?: string) => string;
  /** 直接解析三元文案。 */
  t: (text: ShowcaseI18nText) => string;
  /** 可选解析：未注册时返回 undefined。 */
  tryName: (key: ShowcaseI18nKey | string) => string | undefined;
  entries: () => readonly ShowcaseI18nEntry[];
  has: (key: ShowcaseI18nKey | string) => boolean;
};

export type ShowcaseI18nPartialText = {
  en: string;
  'zh-Hans'?: string;
  'zh-Hant'?: string;
};

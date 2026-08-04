import type { ListFieldSceneSlug } from '@/data/scenes/catalog';

export const LIST_FIELDS_DOC_ID = 'eds-biz-list-fields';

export const SAMPLE_ADDRESS =
  'bc1qmakjy7ns2z8vwgptf9vs8fndp304fg0p9xafm2bc1qmakjy7ns2z8vwgpt';

export const SAMPLE_HASH =
  'c014965e2c178ef53e8f7a2b9d4e6f1a0b3c5d7e9f2a4b6c8d0e1f3a5b7c9d1e3';

export const SAMPLE_ID = 'id014965e2c178ef53e8f7a2b9d4e6f1a0b3c5d7e9f2a4b6c8d0e1f3';

export const SAMPLE_HASH_SECONDARY = SAMPLE_ID;

export const SAMPLE_ID_SECONDARY = SAMPLE_HASH;

export const SAMPLE_GENERAL_TITLE = 'Title';

export const SAMPLE_GENERAL_SECONDARY = 'Secondary Title';

export const listFieldHashLikeSlugs = [
  'list-field-transaction-hash',
  'list-field-identifier',
  'list-field-general-structure',
] as const;

export type ListFieldHashLikeSlug = (typeof listFieldHashLikeSlugs)[number];

export function isListFieldHashLikeSlug(slug: string): slug is ListFieldHashLikeSlug {
  return (listFieldHashLikeSlugs as readonly string[]).includes(slug);
}

export function listFieldHashLikePrimarySample(slug: ListFieldHashLikeSlug): string {
  if (slug === 'list-field-identifier') return SAMPLE_ID;
  if (slug === 'list-field-general-structure') return SAMPLE_GENERAL_TITLE;
  return SAMPLE_HASH;
}

export function listFieldHashLikeSecondarySample(slug: ListFieldHashLikeSlug): string {
  if (slug === 'list-field-identifier') return SAMPLE_ID_SECONDARY;
  if (slug === 'list-field-general-structure') return SAMPLE_GENERAL_SECONDARY;
  return SAMPLE_HASH_SECONDARY;
}

export function truncateMiddle(value: string, head = 8, tail = 8): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function truncateTail(value: string, max = 22): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
}

export type ListFieldStatus = 'danger' | 'warning' | 'success' | 'ready' | 'invalid';

export const listFieldStatusExamples: Array<{ status: ListFieldStatus; label: string }> = [
  { status: 'danger', label: 'Failed' },
  { status: 'warning', label: 'Pending' },
  { status: 'success', label: 'Success' },
  { status: 'ready', label: 'Ready' },
  { status: 'invalid', label: 'Expired' },
];

export const fiatExamples = ['$10', '$1.1', '$0'] as const;

export type ListFieldSceneMeta = {
  slug: ListFieldSceneSlug;
  docAnchor: string;
};

export const listFieldSceneMetaBySlug: Record<ListFieldSceneSlug, ListFieldSceneMeta> = {
  'list-field-currency': { slug: 'list-field-currency', docAnchor: 'currency' },
  'list-field-address': { slug: 'list-field-address', docAnchor: 'address' },
  'list-field-transaction-hash': {
    slug: 'list-field-transaction-hash',
    docAnchor: 'transaction-hash',
  },
  'list-field-identifier': { slug: 'list-field-identifier', docAnchor: 'identifier' },
  'list-field-general-structure': {
    slug: 'list-field-general-structure',
    docAnchor: 'general-structure',
  },
  'list-field-amount': { slug: 'list-field-amount', docAnchor: 'amount' },
  'list-field-time': { slug: 'list-field-time', docAnchor: 'time' },
  'list-field-status': { slug: 'list-field-status', docAnchor: 'status' },
  'list-field-action': { slug: 'list-field-action', docAnchor: 'action' },
};

export const LIST_FIELD_MORE_ACTION_COUNT_MAX = 10;

export function parseListFieldMoreActionCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.moreActionCount ?? '2'), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(LIST_FIELD_MORE_ACTION_COUNT_MAX, parsed);
}

export function buildListFieldMoreActions(state: Record<string, unknown>) {
  const count = parseListFieldMoreActionCount(state);
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const action: { key: string; label: string; danger?: boolean } = {
      key: `more-${n}`,
      label: String(state[`moreAction${n}Label`] ?? `Action ${n}`),
    };
    if (state[`moreAction${n}Danger`] === true) {
      action.danger = true;
    }
    return action;
  });
}

export function listFieldActionCustomizeDefaults(): Record<string, unknown> {
  const defaults: Record<string, unknown> = {
    primaryLabel: 'Action',
    minWidth: '',
    moreActionCount: '2',
    moreAction1Label: 'Copy',
    moreAction1Danger: false,
    moreAction2Label: 'Delete',
    moreAction2Danger: true,
  };

  for (let n = 3; n <= LIST_FIELD_MORE_ACTION_COUNT_MAX; n += 1) {
    defaults[`moreAction${n}Label`] = `Action ${n}`;
    defaults[`moreAction${n}Danger`] = false;
  }

  return defaults;
}

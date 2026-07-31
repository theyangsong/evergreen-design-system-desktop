import { processSvg, type IconFillTone, type IconKind, type ProcessedIcon } from './processSvg';

const iconSvgModules = import.meta.glob('./*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const appEntrySvgModules = import.meta.glob('../avatar/eds-application-*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const svgModules: Record<string, string> = { ...iconSvgModules };

for (const [path, raw] of Object.entries(appEntrySvgModules)) {
  const base = path.replace(/^\.\.\/avatar\//, '').replace(/\.svg$/i, '');
  svgModules[`./${base}.svg`] = raw;
}

function fileBaseFromModulePath(path: string): string {
  return path.replace(/^\.\//, '').replace(/\.svg$/i, '');
}

/** 与 SVG 文件名一致（无 .svg 后缀），作为 `EgIcon` 的 `name`。 */
export const iconNames = Object.keys(svgModules)
  .map(fileBaseFromModulePath)
  .sort((a, b) => a.localeCompare(b));

export type IconName = (typeof iconNames)[number];

export const iconFileNames = iconNames;

const processedCache = new Map<string, ProcessedIcon>();

/** 对外 icon name → 磁盘文件名（修正历史文件名差异）。 */
const ICON_NAME_ALIASES: Record<string, string> = {
  'eds-global-payments-fill': 'eds-global-payments -fill',
};

function resolveFileName(name: string): string | undefined {
  const aliased = ICON_NAME_ALIASES[name] ?? name;
  if (svgModules[`./${aliased}.svg`]) return aliased;
  return undefined;
}

export function resolveIconFileName(name: string): string | undefined {
  return resolveFileName(name);
}

export function getProcessedIcon(name: string): ProcessedIcon | undefined {
  const fileName = resolveFileName(name);
  if (!fileName) return undefined;

  const cached = processedCache.get(fileName);
  if (cached) return cached;

  const raw = svgModules[`./${fileName}.svg`];
  if (!raw) return undefined;

  const processed = processSvg(fileName, raw);
  processedCache.set(fileName, processed);
  return processed;
}

export function getIconKind(name: string): IconKind | undefined {
  return getProcessedIcon(name)?.kind;
}

export function getIconFillTone(name: string): IconFillTone | undefined {
  return getProcessedIcon(name)?.fillTone;
}

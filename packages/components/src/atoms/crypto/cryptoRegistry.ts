const cryptoSvgModules = import.meta.glob('./*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function fileBaseFromModulePath(path: string): string {
  return path.replace(/^\.\//, '').replace(/\.svg$/i, '');
}

/** 与 SVG 文件名一致（无 .svg 后缀），作为 `EgCrypto` 的 `name`。 */
export const cryptoNames = Object.keys(cryptoSvgModules)
  .map(fileBaseFromModulePath)
  .sort((a, b) => a.localeCompare(b));

export type CryptoName = (typeof cryptoNames)[number];

export const cryptoFileNames = cryptoNames;

export type ProcessedCrypto = {
  markup: string;
};

const markupCache = new Map<string, ProcessedCrypto>();

function resolveFileName(name: string): string | undefined {
  if (cryptoSvgModules[`./${name}.svg`]) return name;
  return undefined;
}

export function resolveCryptoFileName(name: string): string | undefined {
  return resolveFileName(name);
}

/** 原样输出 SVG 源文件，仅去掉 XML 声明。 */
function prepareRawCryptoMarkup(raw: string): string {
  return raw.replace(/<\?xml[^?]*\?\>\s*/i, '').trim();
}

export function getProcessedCrypto(name: string): ProcessedCrypto | undefined {
  const fileName = resolveFileName(name);
  if (!fileName) return undefined;

  const cached = markupCache.get(fileName);
  if (cached) return cached;

  const raw = cryptoSvgModules[`./${fileName}.svg`];
  if (!raw) return undefined;

  const processed = { markup: prepareRawCryptoMarkup(raw) };
  markupCache.set(fileName, processed);
  return processed;
}

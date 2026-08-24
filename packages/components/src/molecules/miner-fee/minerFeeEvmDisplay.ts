import type { MinerFeeCustomSaved } from './minerFeeCustomTypes';
import type { MinerFeeOptionId } from './MinerFeeListPanel.vue';
import { formatGroupedAmountText } from '../../utils/formatGroupedAmountText';
import {
  minerFeeSpeedCryptoRangeKey,
  minerFeeSpeedUsdRangeKey,
  resolveMinerFeeEvmShellVariant,
  type MinerFeeEvmShellVariant,
} from './minerFeeEvmShellVariant';

export const MINER_FEE_ETH_MIN_FRACTION_DIGITS = 12;

function firstRangeSegment(text: string): string {
  const segment = text.split('~')[0]?.trim();
  return segment || text.trim();
}

function countFractionDigits(normalized: string): number {
  const dot = normalized.indexOf('.');
  if (dot === -1) {
    return 0;
  }
  return normalized.length - dot - 1;
}

function resolveMinerFeeCryptoMinFractionDigits(symbol: string): number {
  return symbol.trim().toUpperCase() === 'ETH' ? MINER_FEE_ETH_MIN_FRACTION_DIGITS : 0;
}

export { resolveMinerFeeCryptoMinFractionDigits };

/** Crypto 数值：ETH 至少 12 位小数（不足补 0）；保留更多源精度 + 千分位。 */
export function formatMinerFeeCryptoAmountToken(
  rawAmount: string,
  options?: { minFractionDigits?: number },
): string {
  const normalized = rawAmount.replace(/,/g, '');
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    return rawAmount;
  }

  const minFractionDigits = options?.minFractionDigits ?? 0;
  const fractionDigits = Math.max(minFractionDigits, countFractionDigits(normalized));
  return formatGroupedAmountText(numeric.toFixed(fractionDigits));
}

/** 选项行 crypto：i18n 区间文案取首段单值，去掉 `≤` 前缀。 */
export function formatMinerFeeOptionCryptoDisplay(text: string): string {
  const segment = firstRangeSegment(text).replace(/^≤\s*/, '').trim();
  const match = segment.match(/^([\d,.]+)(\s+.*)$/);
  if (!match) {
    return formatGroupedAmountText(segment);
  }

  const [, rawAmount, symbolSuffix] = match;
  const symbol = symbolSuffix.trim();
  return `${formatMinerFeeCryptoAmountToken(rawAmount, {
    minFractionDigits: resolveMinerFeeCryptoMinFractionDigits(symbol),
  })} ${symbol}`;
}

/** 选项行 USD：首段单值；ETH 系 `≤$` 规范为 `≈ $`。 */
export function formatMinerFeeOptionUsdDisplay(text: string): string {
  const segment = firstRangeSegment(text);
  if (/^≤\$/.test(segment)) {
    return segment.replace(/^≤\$/, '≈ $');
  }
  return segment;
}

function formatMinerFeeOptionUsdAmount(text: string): string {
  const segment = firstRangeSegment(text);
  if (/^≤\$/.test(segment)) {
    return `$${segment.slice(2).trim()}`;
  }
  if (/^≈\s*\$/.test(segment)) {
    return segment.replace(/^≈\s*/, '');
  }
  return segment;
}

export function buildEvmMinerFeeDisplay(
  optionId: MinerFeeOptionId | null,
  customSaved: MinerFeeCustomSaved | null,
  translate: (key: string) => string,
  symbol = 'ETH',
): string | null {
  if (!optionId) {
    return null;
  }

  const variant = resolveMinerFeeEvmShellVariant(symbol);

  if (optionId === 'custom') {
    if (!customSaved) {
      return null;
    }
    if (variant === 'btc') {
      return formatGroupedAmountText(`${customSaved.cryptoRange} ${customSaved.usdRange}`);
    }
    return formatGroupedAmountText(
      `${formatMinerFeeOptionCryptoDisplay(customSaved.cryptoRange)} ≈ ${customSaved.usdRange}`,
    );
  }

  const cryptoKey = minerFeeSpeedCryptoRangeKey(variant, optionId);
  const usdKey = minerFeeSpeedUsdRangeKey(variant, optionId);

  const cryptoText = translate(cryptoKey);
  const usdText = translate(usdKey);

  if (variant === 'btc') {
    return formatGroupedAmountText(`${cryptoText} ${usdText}`);
  }

  return formatGroupedAmountText(
    `${formatMinerFeeOptionCryptoDisplay(cryptoText)} ≈ ${formatMinerFeeOptionUsdAmount(usdText)}`,
  );
}

export function resolveEvmShellVariantFromSymbol(symbol: string): MinerFeeEvmShellVariant {
  return resolveMinerFeeEvmShellVariant(symbol);
}

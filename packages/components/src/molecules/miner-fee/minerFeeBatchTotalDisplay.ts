import type { MinerFeeCustomSaved } from './minerFeeCustomTypes';
import {
  minerFeeSpeedCryptoRangeKey,
  minerFeeSpeedUsdRangeKey,
  resolveMinerFeeEvmShellVariant,
} from './minerFeeEvmShellVariant';
import {
  formatMinerFeeOptionCryptoDisplay,
  formatMinerFeeOptionUsdDisplay,
  resolveMinerFeeCryptoMinFractionDigits,
} from './minerFeeEvmDisplay';
import { resolveTonLikeMinerFeeQuote } from './minerFeeTonLikeDisplay';
import { resolveTronMinerFeeQuote } from './minerFeeTronDisplay';
import { formatGroupedAmountText } from '../../utils/formatGroupedAmountText';

type MinerFeeOptionId = 'fast' | 'normal' | 'slow' | 'custom';

export function scaleUsdAmountsInText(text: string, count: number): string {
  if (count <= 1) {
    return text.trim();
  }

  const scaled = text.replace(/\$([\d,.]+)/g, (_, raw: string) => {
    const value = Number.parseFloat(raw.replace(/,/g, ''));
    if (!Number.isFinite(value)) {
      return `$${raw}`;
    }
    const fraction = raw.includes('.') ? raw.split('.')[1]?.length ?? 0 : 0;
    const next = value * count;
    const formatted =
      fraction > 0 ? next.toFixed(fraction) : String(Math.round(next));
    return `$${formatted}`;
  });

  return formatGroupedAmountText(scaled.trim());
}

export function scaleCryptoAmountsInText(text: string, count: number): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^([\d,.]+)(\s+.+)$/);
  if (!match) {
    return formatMinerFeeOptionCryptoDisplay(trimmed);
  }

  const [, raw, suffix] = match;
  const symbol = suffix.trim();
  const value = Number.parseFloat(raw.replace(/,/g, ''));
  if (!Number.isFinite(value)) {
    return formatMinerFeeOptionCryptoDisplay(trimmed);
  }

  if (count <= 1) {
    return formatMinerFeeOptionCryptoDisplay(trimmed);
  }

  const next = value * count;
  const sourceFraction = raw.includes('.') ? raw.replace(/,/g, '').split('.')[1]?.length ?? 0 : 0;
  const scaledFraction = String(next).includes('.') ? String(next).split('.')[1]?.length ?? 0 : 0;
  const minFractionDigits = resolveMinerFeeCryptoMinFractionDigits(symbol);
  const fractionDigits = Math.max(minFractionDigits, sourceFraction, scaledFraction);
  const scaledAmount = next.toFixed(fractionDigits);
  return formatMinerFeeOptionCryptoDisplay(`${scaledAmount} ${symbol}`);
}

function buildScaledCryptoUsdBatchTotalDisplay(
  crypto: string,
  usd: string,
  transactionCount: number,
): string {
  const scaledCrypto = scaleCryptoAmountsInText(crypto, transactionCount);
  const scaledUsd = scaleUsdAmountsInText(usd, transactionCount).trim();
  const joined = /^≈/.test(scaledUsd)
    ? `${scaledCrypto} ${scaledUsd}`
    : `${scaledCrypto} ≈ ${scaledUsd}`;
  return formatGroupedAmountText(joined);
}

export function buildEvmMinerFeeBatchTotalDisplay(
  optionId: MinerFeeOptionId | null,
  customSaved: MinerFeeCustomSaved | null,
  translate: (key: string) => string,
  symbol: string,
  transactionCount: number,
): string {
  if (transactionCount <= 1 || !optionId) {
    return '';
  }

  if (optionId === 'custom') {
    if (!customSaved) {
      return '';
    }
    return buildScaledCryptoUsdBatchTotalDisplay(
      formatMinerFeeOptionCryptoDisplay(customSaved.cryptoRange),
      formatMinerFeeOptionUsdDisplay(customSaved.usdRange),
      transactionCount,
    );
  }

  const variant = resolveMinerFeeEvmShellVariant(symbol);
  const cryptoKey = minerFeeSpeedCryptoRangeKey(variant, optionId);
  const usdKey = minerFeeSpeedUsdRangeKey(variant, optionId);
  return buildScaledCryptoUsdBatchTotalDisplay(
    formatMinerFeeOptionCryptoDisplay(translate(cryptoKey)),
    formatMinerFeeOptionUsdDisplay(translate(usdKey)),
    transactionCount,
  );
}

export function buildTonLikeMinerFeeBatchTotalDisplay(
  symbol: string,
  transactionCount: number,
): string {
  if (transactionCount <= 1) {
    return '';
  }
  const quote = resolveTonLikeMinerFeeQuote(symbol);
  const ticker = symbol.trim().toUpperCase() || '—';
  return buildScaledCryptoUsdBatchTotalDisplay(
    `${quote.cryptoAmount} ${ticker}`,
    quote.usdApprox.startsWith('$') ? `≈ ${quote.usdApprox}` : quote.usdApprox,
    transactionCount,
  );
}

export function buildTronMinerFeeBatchTotalDisplay(transactionCount: number): string {
  if (transactionCount <= 1) {
    return '';
  }
  const quote = resolveTronMinerFeeQuote();
  return buildScaledCryptoUsdBatchTotalDisplay(
    `${quote.estimatedTrx} TRX`,
    `≈ ${quote.estimatedUsd}`,
    transactionCount,
  );
}

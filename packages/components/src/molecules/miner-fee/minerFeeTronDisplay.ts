import { formatGroupedAmountText, formatGroupedTemplateValue } from '../../utils/formatGroupedAmountText';

export type TronMinerFeeQuote = {
  bandwidth: number;
  energy: number;
  availableBandwidth: number;
  availableEnergy: number;
  activationExtraTrx: number;
  estimatedTrx: string;
  estimatedUsd: string;
  estimatedUsdOriginal: string;
};

/** TRON 演示用固定资源与能量模式报价。 */
export function resolveTronMinerFeeQuote(): TronMinerFeeQuote {
  return {
    bandwidth: 345,
    energy: 885,
    availableBandwidth: 1200,
    availableEnergy: 560,
    activationExtraTrx: 1,
    estimatedTrx: '6.75',
    estimatedUsd: '$10.09',
    estimatedUsdOriginal: '$12.08',
  };
}

export function fillMinerFeeUiTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, formatGroupedTemplateValue(value)),
    template,
  );
}

export function buildTronMinerFeeDisplay(quote?: TronMinerFeeQuote): string {
  const resolved = quote ?? resolveTronMinerFeeQuote();
  return formatGroupedAmountText(`预计费用: ${resolved.estimatedUsd}`);
}

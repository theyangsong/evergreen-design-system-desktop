import { formatGroupedNumber } from './formatGroupedNumber';

function formatGroupedDecimalAmount(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith('$')) {
    return `$${formatGroupedDecimalAmount(trimmed.slice(1))}`;
  }

  const normalized = trimmed.replace(/,/g, '');
  const dotIndex = normalized.indexOf('.');
  if (dotIndex === -1) {
    return formatGroupedNumber(normalized);
  }

  const whole = normalized.slice(0, dotIndex);
  const fraction = normalized.slice(dotIndex + 1);
  if (!whole) {
    return fraction ? `0.${fraction}` : '0';
  }

  const groupedWhole = formatGroupedNumber(whole);
  return fraction ? `${groupedWhole}.${fraction}` : groupedWhole;
}

/** 文案中的数字 token（含可选 `$`）统一千分位。 */
export function formatGroupedAmountText(text: string): string {
  return text.replace(/(\$?)([\d,]+(?:\.\d+)?)/g, (match, dollar: string, num: string) => {
    if (!num) return match;
    return `${dollar}${formatGroupedDecimalAmount(num)}`;
  });
}

export function formatGroupedTemplateValue(value: string | number): string {
  if (typeof value === 'number') {
    return formatGroupedNumber(value);
  }
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^[\d,$]/.test(trimmed) || /^[\d,]+(?:\.\d+)?$/.test(trimmed.replace(/,/g, ''))) {
    return formatGroupedDecimalAmount(trimmed);
  }
  return value;
}

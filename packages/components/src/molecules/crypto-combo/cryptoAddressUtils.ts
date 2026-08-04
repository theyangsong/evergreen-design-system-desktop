/** 中间省略：前 head + … + 后 tail */
export function truncateAddressMiddle(
  value: string,
  head = 6,
  tail = 6,
): string {
  if (!value || value.includes('...')) return value;
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function formatAddressDisplayText(options: {
  address: string;
  alias?: string;
  mode: 'single' | 'double';
  minWidth?: number;
}): string {
  const alias = options.alias?.trim();
  if (alias) return alias;

  return truncateAddressMiddle(options.address, 6, 6);
}

export function formatAddressTooltipLine(address: string, alias?: string): string {
  const trimmedAlias = alias?.trim();
  if (trimmedAlias) {
    return `${trimmedAlias} ${address}`;
  }
  return address;
}

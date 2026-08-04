import { resolveCryptoNameFromSymbol } from './listFieldCryptoResolve';

export type CryptoAddressFamily =
  | 'evm'
  | 'btc'
  | 'zec'
  | 'trx'
  | 'sol'
  | 'xrp'
  | 'ltc'
  | 'doge';

const FAMILY_BY_SYMBOL: Record<string, CryptoAddressFamily> = {
  ZEC: 'zec',
  BTC: 'btc',
  WBTC: 'btc',
  ETH: 'evm',
  WETH: 'evm',
  USDT: 'evm',
  USDC: 'evm',
  DAI: 'evm',
  BNB: 'evm',
  MATIC: 'evm',
  POL: 'evm',
  AVAX: 'evm',
  OP: 'evm',
  ARB: 'evm',
  BASE: 'evm',
  TRX: 'trx',
  TRON: 'trx',
  SOL: 'sol',
  XRP: 'xrp',
  LTC: 'ltc',
  DOGE: 'doge',
};

const FAMILY_BY_CRYPTO_NAME: Record<string, CryptoAddressFamily> = {
  zec: 'zec',
  zcash: 'zec',
  btc: 'btc',
  bitcoin: 'btc',
  eth: 'evm',
  ethereum: 'evm',
  trx: 'trx',
  tron: 'trx',
  sol: 'sol',
  solana: 'sol',
  xrp: 'xrp',
  ripple: 'xrp',
  ltc: 'ltc',
  litecoin: 'ltc',
  doge: 'doge',
  dogecoin: 'doge',
};

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const SAMPLE_ADDRESS_POOL: Record<CryptoAddressFamily, string[]> = {
  zec: expandAddressPool('t1g722FZ7XH5mdUoQ1YNMPZ9YfqXJKnQfK', 20),
  btc: expandAddressPool('bc1qmakjy7ns2z8vwgptf9vs8fndp304fg0p9xafm2', 20),
  evm: expandAddressPool('0x55e8f6900963c095ff6dd6538749d31c38', 20),
  trx: expandAddressPool('TLa2f6VPqDgRE67v1736s7bJ8nyEwRS9WB', 20),
  sol: expandAddressPool('7EcDhSYGxXyscsz7oxWLzbDy5zvHshFv5ECjNjA9yLx', 20),
  xrp: expandAddressPool('rDsbeomae4FXwgQTJp9BkLLBn2GXQkEiB3', 20),
  ltc: expandAddressPool('ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 20),
  doge: expandAddressPool('DDogpoomE6m9LzqD5F8K3N2v7XyZ1wQ4Rs9Tu', 20),
};

function expandAddressPool(base: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => {
    if (index === 0) return base;
    const marker = BASE58[index % BASE58.length];
    if (base.startsWith('0x')) {
      return `${base.slice(0, -1)}${marker}`;
    }
    return `${base.slice(0, -1)}${marker}`;
  });
}

export function resolveAddressFamily(symbol: string): CryptoAddressFamily {
  const upper = symbol.trim().toUpperCase();
  if (FAMILY_BY_SYMBOL[upper]) return FAMILY_BY_SYMBOL[upper];

  const cryptoName = resolveCryptoNameFromSymbol(symbol);
  if (cryptoName) {
    const lower = cryptoName.toLowerCase();
    for (const [key, family] of Object.entries(FAMILY_BY_CRYPTO_NAME)) {
      if (lower.includes(key)) return family;
    }
  }

  return 'evm';
}

export function addressMatchesFamily(address: string, family: CryptoAddressFamily): boolean {
  const value = address.trim();
  if (!value) return false;

  switch (family) {
    case 'zec':
      return /^(t1|t3|zs1)[1-9A-HJ-NP-Za-km-z]+$/.test(value);
    case 'btc':
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]+$/.test(value);
    case 'evm':
      return /^0x[0-9a-fA-F]{40}$/.test(value);
    case 'trx':
      return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(value);
    case 'sol':
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value) && !value.startsWith('0x');
    case 'xrp':
      return /^r[1-9A-HJ-NP-Za-km-z]{24,33}$/.test(value);
    case 'ltc':
      return /^(ltc1|[LM])[a-zA-HJ-NP-Z0-9]+$/.test(value);
    case 'doge':
      return /^D[1-9A-HJ-NP-Za-km-z]{33}$/.test(value);
    default:
      return false;
  }
}

export function resolveSampleAddressForSymbol(symbol: string, index = 1): string {
  const family = resolveAddressFamily(symbol);
  const pool = SAMPLE_ADDRESS_POOL[family];
  const slot = Math.max(0, index - 1);
  return pool[slot % pool.length] ?? pool[0];
}

export function sideAddressPoolIndex(prefix: 'from' | 'to', itemIndex: number): number {
  const sideOffset = prefix === 'from' ? 0 : 10;
  return itemIndex + sideOffset;
}

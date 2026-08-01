/** Crypto — 加密货币图标。 */
export { default as EgCrypto } from './Crypto.vue';
export {
  cryptoNames,
  cryptoFileNames,
  resolveCryptoFileName,
  getProcessedCrypto,
} from './cryptoRegistry';
export type { CryptoName, ProcessedCrypto } from './cryptoRegistry';

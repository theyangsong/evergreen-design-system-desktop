import { inject, provide, type InjectionKey } from 'vue';

export type MinerFeeTranslate = (key: string) => string;

const MINER_FEE_TRANSLATE_KEY: InjectionKey<MinerFeeTranslate> = Symbol('minerFeeTranslate');

export function provideMinerFeeTranslate(translate: MinerFeeTranslate) {
  provide(MINER_FEE_TRANSLATE_KEY, translate);
}

export function useMinerFeeTranslate(): MinerFeeTranslate {
  const translate = inject(MINER_FEE_TRANSLATE_KEY);
  if (!translate) {
    return (key: string) => key;
  }
  return translate;
}

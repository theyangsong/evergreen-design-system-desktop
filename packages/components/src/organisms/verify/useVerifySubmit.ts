import { computed, onScopeDispose, reactive, type ComputedRef } from 'vue';
import type { VerifyState } from './Verify.vue';

/** 校验中最短停留（ms）— 输入完成后立即进入 verifying，至少停留此时长再进入 success / error。 */
export const VERIFY_SUBMIT_VERIFYING_MS = 1800;
/** 校验成功停留（ms）— success 展示此时长后触发 requestClose。 */
export const VERIFY_SUBMIT_SUCCESS_MS = 1300;

export type UseVerifySubmitOptions = {
  submit: (code: string) => boolean | Promise<boolean>;
  /** 校验成功动效结束后关闭 Popup（由 EgPopup v-model:open 消费）。 */
  requestClose: () => void;
};

export type UseVerifySubmitState = {
  code: string;
  state: VerifyState;
  switchDisabled: boolean;
};

export type UseVerifySubmitReturn = {
  verify: UseVerifySubmitState;
  countdownSeconds: ComputedRef<number | null | undefined>;
  onComplete: (code: string) => Promise<void>;
  onRecover: () => void;
  reset: () => void;
  wasAccepted: () => boolean;
};

export function useVerifySubmit(options: UseVerifySubmitOptions): UseVerifySubmitReturn {
  const verify = reactive<UseVerifySubmitState>({
    code: '',
    state: 'idle',
    switchDisabled: false,
  });

  let accepted = false;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  const countdownSeconds = computed(() => (verify.state === 'error' ? null : undefined));

  function clearSettleTimer() {
    if (settleTimer !== undefined) {
      clearTimeout(settleTimer);
      settleTimer = undefined;
    }
  }

  function delay(ms: number) {
    return new Promise<void>((resolve) => {
      settleTimer = setTimeout(() => {
        settleTimer = undefined;
        resolve();
      }, ms);
    });
  }

  function reset() {
    clearSettleTimer();
    verify.code = '';
    verify.state = 'idle';
    verify.switchDisabled = false;
    accepted = false;
  }

  async function onComplete(submittedCode: string) {
    if (verify.state === 'verifying' || verify.state === 'success') {
      return;
    }

    verify.state = 'verifying';
    const verifyingStarted = Date.now();

    const ok = await Promise.resolve(options.submit(submittedCode));
    const verifyingRemain = Math.max(0, VERIFY_SUBMIT_VERIFYING_MS - (Date.now() - verifyingStarted));

    await delay(verifyingRemain);

    if (!ok) {
      verify.state = 'error';
      verify.code = '';
      verify.switchDisabled = true;
      return;
    }

    verify.state = 'success';
    accepted = true;

    await delay(VERIFY_SUBMIT_SUCCESS_MS);
    options.requestClose();
  }

  function onRecover() {
    if (verify.state !== 'error') {
      return;
    }
    verify.state = 'idle';
    verify.switchDisabled = false;
  }

  function wasAccepted() {
    return accepted;
  }

  onScopeDispose(() => {
    clearSettleTimer();
  });

  return {
    verify,
    countdownSeconds,
    onComplete,
    onRecover,
    reset,
    wasAccepted,
  };
}

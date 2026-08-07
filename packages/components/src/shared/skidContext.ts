import type { InjectionKey, Ref } from 'vue';

/** Layout Skid 动效 — DS 内部用 recipe shift duration + `--motion-recipe-shift` 属性子集。 */
export const SKID_PUSH_TRANSITION_MS = 300;

/**
 * Skid 是否仍影响主内容区（尾列隐藏、操作区隐藏等）。
 * 关闭 Skid 时在推动动效结束后再变为 false。
 */
export const SKID_AFFECTING_MAIN_KEY: InjectionKey<Ref<boolean>> = Symbol('edsLayoutSkidAffectingMain');

/** EgLayout 注入：EgSkid 关闭按钮会调用以触发 v-model:show-skid。 */
export const SKID_REQUEST_CLOSE_KEY: InjectionKey<() => void> = Symbol('edsLayoutSkidRequestClose');

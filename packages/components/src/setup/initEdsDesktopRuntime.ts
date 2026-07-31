import {
  initCornerSmoothing,
  rescanCornerSmoothing,
} from '@eds/desktop-tokens/corner-smoothing';

/** Bind Figma/iOS squircle (--corner-smoothing) to all rounded Desktop components. */
export function initEdsDesktopRuntime(options?: { root?: HTMLElement }) {
  if (typeof document === 'undefined') {
    return [];
  }

  return initCornerSmoothing(options);
}

export { initCornerSmoothing, rescanCornerSmoothing };

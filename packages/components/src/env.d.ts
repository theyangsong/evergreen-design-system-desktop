/// <reference types="vite/client" />

declare module '*.svg?raw' {
  const content: string;
  export default content;
}

declare module '@eds/desktop-tokens/corner-smoothing' {
  export function initCornerSmoothing(options?: { root?: HTMLElement }): unknown[];
  export function rescanCornerSmoothing(root?: HTMLElement): unknown[];
  export function attachCornerSmoothing(element: HTMLElement): unknown;
  export function detachCornerSmoothing(element: HTMLElement): void;
}

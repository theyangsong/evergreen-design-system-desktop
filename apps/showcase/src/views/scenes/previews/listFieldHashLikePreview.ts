export function readHashLikeCopyOnRowHover(customize: Record<string, unknown>): boolean {
  if (customize.copyOnRowHover != null) {
    return Boolean(customize.copyOnRowHover);
  }
  return Boolean(customize.showCopy);
}

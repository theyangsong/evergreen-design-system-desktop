export type MinerFeeBatchStubKind = 'btc' | 'ada' | 'fil' | 'tron';

export type MinerFeeBatchProfileKind = 'evm' | 'ton-xrp' | 'tron';

export function resolveMinerFeeBatchStubKind(
  symbol: string,
  profileKind: MinerFeeBatchProfileKind,
  transactionCount: number,
): MinerFeeBatchStubKind | null {
  if (!Number.isFinite(transactionCount) || transactionCount <= 1) {
    return null;
  }
  if (profileKind === 'tron') {
    return 'tron';
  }
  const ticker = symbol.trim().toUpperCase();
  if (ticker === 'BTC') return 'btc';
  if (ticker === 'ADA') return 'ada';
  if (ticker === 'FIL') return 'fil';
  return null;
}

export function minerFeeBatchStubMessageKey(kind: MinerFeeBatchStubKind): string {
  const keys: Record<MinerFeeBatchStubKind, string> = {
    btc: 'Miner fee batch stub btc',
    ada: 'Miner fee batch stub ada',
    fil: 'Miner fee batch stub fil',
    tron: 'Miner fee batch stub tron',
  };
  return keys[kind];
}

export function minerFeeBatchStubStreamerMessageKey(): string {
  return 'Miner fee batch stub tron streamer';
}

/** TRON batch stub 文案按空行拆成 4 段；其余网络为单段。 */
export function splitMinerFeeBatchStubParagraphs(
  kind: MinerFeeBatchStubKind | null,
  message: string,
): string[] {
  const text = message.trim();
  if (!text) return [];
  if (kind === 'tron') {
    return text.split(/\n\n+/).map((part) => part.trim()).filter(Boolean);
  }
  return [text];
}

export type MinerFeeBatchStubBlock =
  | { kind: 'lead'; text: string }
  | { kind: 'step'; title: string; body: string }
  | { kind: 'text'; text: string };

/** TRON：导语 + 三步（标题 / 正文拆分）；其余网络为单段 text。 */
export function parseMinerFeeBatchStubBlocks(
  kind: MinerFeeBatchStubKind | null,
  message: string,
): MinerFeeBatchStubBlock[] {
  const paragraphs = splitMinerFeeBatchStubParagraphs(kind, message);
  if (kind !== 'tron') {
    return paragraphs.map((text) => ({ kind: 'text', text }));
  }

  return paragraphs.map((paragraph, index) => {
    if (index === 0) {
      return { kind: 'lead', text: paragraph };
    }

    const newlineIndex = paragraph.indexOf('\n');
    if (newlineIndex === -1) {
      return { kind: 'text', text: paragraph };
    }

    return {
      kind: 'step',
      title: paragraph.slice(0, newlineIndex).trim(),
      body: paragraph.slice(newlineIndex + 1).trim(),
    };
  });
}

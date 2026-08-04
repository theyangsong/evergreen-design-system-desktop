#!/usr/bin/env node
/**
 * Sync list-field-currency runtime helpers from showcase → desktop consumers.
 *
 * Showcase doc-only controls stay in apps/showcase; consumers keep slim runtime copies
 * under src/scenes/tasks/list-field/ (must stay aligned on tag/address defaults).
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EDS_ROOT = resolve(__dirname, '..');
const SHOWCASE_LIST_FIELD = join(
  EDS_ROOT,
  'apps/showcase/src/views/scenes/previews',
);

/** consumer folder name → list-field target dir (relative to consumer root) */
const CONSUMER_TARGETS = {
  'work-cregis-desktop': 'src/scenes/tasks/list-field',
};

/** Copied verbatim from showcase (runtime shared). */
const COPY_VERBATIM = [
  'listFieldCurrencyShared.ts',
  'listFieldCryptoSampleAddresses.ts',
  'listFieldCryptoResolve.ts',
];

/** Consumer tag customize must include these markers (custom tag family + AML risk). */
const TAG_CUSTOMIZE_MARKERS = [
  "return 'aml-danger'",
  "buildTagSlotArray(side, addressIndex, 'system', 'custom'",
  "buildTagSlotArray(side, addressIndex, 'custom', 'custom'",
];

export function syncListFieldCurrencyForConsumer(consumerName, consumerRoot) {
  const relTarget = CONSUMER_TARGETS[consumerName];
  if (!relTarget) return { skipped: true };

  const targetDir = join(consumerRoot, relTarget);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const copied = [];

  for (const fileName of COPY_VERBATIM) {
    const source = join(SHOWCASE_LIST_FIELD, fileName);
    const dest = join(targetDir, fileName);
    if (!existsSync(source)) {
      console.warn(`  skip ${fileName}: missing in showcase`);
      continue;
    }
    copyFileSync(source, dest);
    copied.push(fileName);
  }

  const tagCustomizePath = join(targetDir, 'listFieldCurrencyTagCustomize.ts');
  let tagCustomizeOk = false;
  if (existsSync(tagCustomizePath)) {
    const content = readFileSync(tagCustomizePath, 'utf8');
    tagCustomizeOk = TAG_CUSTOMIZE_MARKERS.every((marker) => content.includes(marker));
    if (!tagCustomizeOk) {
      console.warn(
        '  ⚠ listFieldCurrencyTagCustomize.ts is stale — expected custom/aml tag defaults.',
      );
      console.warn(
        '    Update src/scenes/tasks/list-field/listFieldCurrencyTagCustomize.ts to match showcase runtime.',
      );
    }
  } else {
    console.warn('  ⚠ missing listFieldCurrencyTagCustomize.ts in consumer');
  }

  if (copied.length > 0) {
    console.log(`  list-field-currency: copied ${copied.join(', ')}`);
  }
  if (tagCustomizeOk) {
    console.log('  list-field-currency: tag customize markers OK');
  }

  return { copied, tagCustomizeOk };
}

function main() {
  const consumerName = process.argv[2] ?? 'work-cregis-desktop';
  const consumerRoot = resolve(EDS_ROOT, '..', consumerName);
  if (!existsSync(consumerRoot)) {
    console.error(`Consumer not found: ${consumerRoot}`);
    process.exit(1);
  }
  syncListFieldCurrencyForConsumer(consumerName, consumerRoot);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

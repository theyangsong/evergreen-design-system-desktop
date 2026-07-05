#!/usr/bin/env node
/**
 * Figma → Repo token sync helper for EverGreen Design System (Desktop)
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const figmaConfigPath = join(repoRoot, 'figma.config.json');
const specPath = join(repoRoot, 'packages/tokens/spec');

console.log('EverGreen Design System (Desktop) — Figma Token Sync\n');

if (!existsSync(figmaConfigPath)) {
  console.error('✗ figma.config.json not found at repo root');
  process.exit(1);
}

const config = JSON.parse(readFileSync(figmaConfigPath, 'utf-8'));

console.log('Linked Figma file');
console.log(`  Name:    ${config.fileName}`);
console.log(`  Key:     ${config.fileKey}`);
console.log(`  URL:     ${config.fileUrl}`);
console.log('');

if (config.variableCollections?.length) {
  console.log('Detected variable collections in Figma:');
  for (const collection of config.variableCollections) {
    console.log(`  • ${collection.name}`);
  }
  console.log('');
}

console.log('Token source of truth (repo):');
console.log(`  ${specPath}`);
console.log('');
console.log('Layered spec layout:');
console.log('  spec/scale/       — base + semantic');
console.log('  spec/typography/  — base + semantic + global');
console.log('  spec/text/        — typography utility classes');
console.log('  spec/color/       — base + semantic (light/dark)');
console.log('  spec/effect/      — base + semantic + liquid-glass');
console.log('');

console.log('Sync workflow:');
console.log('  1. Open the Figma file:');
console.log(`     ${config.fileUrl}`);
console.log('  2. Compare Figma variables with packages/tokens/spec/*.json');
console.log('  3. Update the relevant spec JSON files');
console.log('  4. Rebuild CSS variables:');
console.log('     pnpm build:tokens');
console.log('');

console.log('Expected token naming (examples):');
console.log('  Color:  Text/Base Primary  →  --text-base-primary');
console.log('  Scale:  spacing-4 / radius-md / stroke-sm');
console.log('  Type:   typography-body-medium / .typography-body-medium');
console.log('  Effect: .effect-flotation-box / .effect-popup-box');
console.log('');
console.log('✓ Sync helper complete. No remote changes made.');

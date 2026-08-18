#!/usr/bin/env node
/**
 * Discover and sync local projects that link to @eds/desktop-* from eds-desktop.
 *
 * Usage:
 *   node scripts/sync-local-consumers.mjs          # build + install all consumers
 *   node scripts/sync-local-consumers.mjs --list   # list consumers only
 *   node scripts/sync-local-consumers.mjs --skip-build
 *   node scripts/sync-local-consumers.mjs work-cregis-desktop  # single project by folder name
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncListFieldCurrencyForConsumer } from './sync-list-field-currency.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EDS_ROOT = resolve(__dirname, '..');
const PROJECTS_ROOT = resolve(EDS_ROOT, '..');
const EDS_PACKAGES = join(EDS_ROOT, 'packages');

const EDS_DEPS = ['@eds/desktop-components', '@eds/desktop-tokens', '@eds/desktop-animations'];

function parseArgs(argv) {
  const listOnly = argv.includes('--list');
  const skipBuild = argv.includes('--skip-build');
  const targets = argv.filter((a) => !a.startsWith('--'));
  return { listOnly, skipBuild, targets };
}

function linksToEdsDesktop(value) {
  if (typeof value !== 'string') return false;
  if (!value.startsWith('link:') && !value.startsWith('file:')) return false;
  const pathPart = value.replace(/^(link:|file:)/, '');
  const resolved = resolve(dirname(join(PROJECTS_ROOT, '_probe', 'package.json')), pathPart);
  // resolve relative to a dummy dir under PROJECTS_ROOT — re-resolve per project below
  return pathPart.includes('eds-desktop');
}

function projectLinksToEds(projectDir) {
  const pkgPath = join(projectDir, 'package.json');
  if (!existsSync(pkgPath)) return false;

  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    return false;
  }

  const sections = [pkg.dependencies, pkg.devDependencies, pkg.peerDependencies].filter(Boolean);
  for (const section of sections) {
    for (const name of EDS_DEPS) {
      const value = section[name];
      if (!value || typeof value !== 'string') continue;
      if (!value.startsWith('link:') && !value.startsWith('file:')) continue;
      const pathPart = value.replace(/^(link:|file:)/, '');
      const resolved = resolve(projectDir, pathPart);
      if (resolved.startsWith(EDS_ROOT) || pathPart.includes('eds-desktop')) {
        return true;
      }
    }
  }
  return false;
}

function discoverConsumers() {
  if (!existsSync(PROJECTS_ROOT)) return [];

  const found = [];
  for (const entry of readdirSync(PROJECTS_ROOT)) {
    if (entry === 'eds-desktop') continue;
    const projectDir = join(PROJECTS_ROOT, entry);
    try {
      if (!statSync(projectDir).isDirectory()) continue;
    } catch {
      continue;
    }
    if (projectLinksToEds(projectDir)) {
      found.push({ name: entry, path: projectDir });
    }
  }
  return found.sort((a, b) => a.name.localeCompare(b.name));
}

function run(cmd, cwd) {
  console.log(`\n→ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function main() {
  const { listOnly, skipBuild, targets } = parseArgs(process.argv.slice(2));
  let consumers = discoverConsumers();

  if (targets.length > 0) {
    consumers = consumers.filter((c) =>
      targets.some((t) => c.name === t || c.path.endsWith(t)),
    );
    if (consumers.length === 0) {
      console.error(`No matching consumer for: ${targets.join(', ')}`);
      console.error('Known consumers:', discoverConsumers().map((c) => c.name).join(', ') || '(none)');
      process.exit(1);
    }
  }

  console.log('eds-desktop local consumers:');
  if (consumers.length === 0) {
    console.log('  (none found under', PROJECTS_ROOT + ')');
  } else {
    for (const c of consumers) {
      console.log(`  • ${c.name}  ${c.path}`);
    }
  }

  if (listOnly) return;

  if (!skipBuild) {
    console.log('\n=== Building eds-desktop ===');
    run('pnpm build:tokens && pnpm build:animations && pnpm build:components', EDS_ROOT);
  }

  for (const c of consumers) {
    console.log(`\n=== Syncing ${c.name} ===`);
    const viteCache = join(c.path, 'node_modules', '.vite');
    if (existsSync(viteCache)) {
      try {
        rmSync(viteCache, { recursive: true, force: true });
        console.log('  cleared node_modules/.vite (stale pre-bundle cache)');
      } catch {
        // ignore
      }
    }
    syncListFieldCurrencyForConsumer(c.name, c.path);
    run('pnpm install', c.path);
  }

  console.log('\n✓ Sync complete.');
  if (consumers.length > 0) {
    console.log('If a dev server is running in a consumer project, restart it to pick up changes.');
  }
}

main();

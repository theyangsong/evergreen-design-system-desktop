import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const desktopRoot = resolve(__dirname, '..');
const repoRoot = resolve(desktopRoot, '..');
const distRoot = join(desktopRoot, 'dist');

const SOURCES = [
  { name: 'tokens', from: join(repoRoot, 'tokens/dist'), to: join(distRoot, 'tokens') },
  { name: 'animations', from: join(repoRoot, 'animations/dist'), to: join(distRoot, 'animations') },
  { name: 'components', from: join(repoRoot, 'components/dist'), to: join(distRoot, 'components') },
  { name: 'patterns', from: join(repoRoot, 'patterns/dist'), to: join(distRoot, 'patterns') },
  { name: 'workflows', from: join(repoRoot, 'workflows/dist'), to: join(distRoot, 'workflows') },
];

const WORKSPACE_IMPORTS = [
  '@eds/desktop-animations',
  '@eds/desktop-tokens/corner-smoothing',
];

function copyDir(from, to) {
  cpSync(from, to, { recursive: true });
}

function walkFiles(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walkFiles(fullPath, callback);
      continue;
    }
    callback(fullPath);
  }
}

function patchWorkspaceImports(filePath) {
  if (!/\.(?:js|mjs|cjs|d\.ts)$/.test(filePath)) {
    return;
  }

  let source = readFileSync(filePath, 'utf8');
  let next = source;

  for (const specifier of WORKSPACE_IMPORTS) {
    const fromDir = dirname(filePath);
    let targetPath = '';

    if (specifier === '@eds/desktop-animations') {
      targetPath = relative(fromDir, join(distRoot, 'animations/index.js')).replace(/\\/g, '/');
    } else if (specifier === '@eds/desktop-tokens/corner-smoothing') {
      targetPath = relative(fromDir, join(distRoot, 'tokens/js/corner-smoothing.js')).replace(/\\/g, '/');
    }

    if (!targetPath.startsWith('.')) {
      targetPath = `./${targetPath}`;
    }

    next = next.replaceAll(`"${specifier}"`, `"${targetPath}"`);
    next = next.replaceAll(`'${specifier}'`, `'${targetPath}'`);
  }

  if (next !== source) {
    writeFileSync(filePath, next);
  }
}

function buildTokenExports() {
  const tokensPackage = JSON.parse(
    readFileSync(join(repoRoot, 'tokens/package.json'), 'utf8'),
  );
  const exportsMap = {};

  for (const [subpath, target] of Object.entries(tokensPackage.exports ?? {})) {
    const distTarget = String(target).replace(/^\.\/dist\//, './dist/tokens/');
    const exportKey = subpath === '.' ? './tokens' : `./tokens${subpath.slice(1)}`;
    exportsMap[exportKey] = distTarget;
  }

  return exportsMap;
}

/** Run manually when token export map changes: node scripts/sync-exports.mjs */
function syncPackageExports() {
  const tokenExports = buildTokenExports();
  const desktopPackagePath = join(desktopRoot, 'package.json');
  const desktopPackage = JSON.parse(readFileSync(desktopPackagePath, 'utf8'));

  desktopPackage.exports = {
    '.': {
      import: './dist/index.js',
      types: './dist/index.d.ts',
    },
    './animations': {
      import: './dist/animations/index.js',
      types: './dist/animations/index.d.ts',
    },
    './animations/style.css': './dist/animations/index.css',
    './components': {
      import: './dist/components/index.js',
      types: './dist/components/index.d.ts',
    },
    './components/style.css': './dist/components/index.css',
    './patterns': {
      import: './dist/patterns/index.js',
      types: './dist/patterns/index.d.ts',
    },
    './workflows': {
      import: './dist/workflows/index.js',
      types: './dist/workflows/index.d.ts',
    },
    ...tokenExports,
  };

  writeFileSync(desktopPackagePath, `${JSON.stringify(desktopPackage, null, 2)}\n`);
  console.log('✓ Synced packages/desktop/package.json exports from tokens');
}

if (process.argv.includes('--sync-exports')) {
  syncPackageExports();
  process.exit(0);
}

function writeRootEntry() {
  const pkg = JSON.parse(readFileSync(join(desktopRoot, 'package.json'), 'utf8'));
  const entry = `/** EverGreen Design System (Desktop) — unified npm package */\nexport const version = '${pkg.version}';\nexport const pillars = ['tokens', 'animations', 'components', 'patterns', 'workflows'] as const;\n`;
  writeFileSync(join(distRoot, 'index.js'), entry);
  writeFileSync(
    join(distRoot, 'index.d.ts'),
    `export declare const version: '${pkg.version}';\nexport declare const pillars: readonly ['tokens', 'animations', 'components', 'patterns', 'workflows'];\n`,
  );
}

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(distRoot, { recursive: true });

for (const source of SOURCES) {
  copyDir(source.from, source.to);
}

walkFiles(join(distRoot, 'components'), patchWorkspaceImports);

writeRootEntry();

console.log('✓ @eds-evergreen/desktop assembled into packages/desktop/dist');

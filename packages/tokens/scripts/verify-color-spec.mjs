import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const specDir = join(rootDir, 'spec');
const distPath = join(rootDir, 'dist/json/tokens.json');

function loadJson(relativePath) {
  return JSON.parse(readFileSync(join(specDir, relativePath), 'utf-8'));
}

export function verifyColorSpecAgainstDist() {
  const baseSpec = loadJson('color/base.json');
  const semanticSpec = loadJson('color/semantic.json');
  const dist = JSON.parse(readFileSync(distPath, 'utf-8'));

  const errors = [];

  for (const token of semanticSpec.tokens) {
    for (const theme of ['light', 'dark']) {
      const key = `colorSemantic_${theme}`;
      const actual = dist[key]?.[token.name];
      if (actual !== token[theme]) {
        errors.push(
          `semantic ${token.name} (${theme}): spec ${JSON.stringify(token[theme])} ≠ dist ${JSON.stringify(actual)}`,
        );
      }
    }
  }

  for (const theme of ['light', 'dark']) {
    const key = `colorBase_${theme}`;
    for (const [name, value] of Object.entries(baseSpec[theme])) {
      const actual = dist[key]?.[name];
      if (JSON.stringify(actual) !== JSON.stringify(value)) {
        errors.push(`base ${name} (${theme}): spec ≠ dist`);
      }
    }
  }

  const distLightCount = Object.keys(dist.colorSemantic_light ?? {}).length;
  if (distLightCount !== semanticSpec.tokens.length) {
    errors.push(
      `semantic token count: spec ${semanticSpec.tokens.length} ≠ dist light ${distLightCount}`,
    );
  }

  return errors;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = verifyColorSpecAgainstDist();
  if (errors.length > 0) {
    console.error('Color spec verification failed:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('✓ Color spec matches dist/json/tokens.json');
}

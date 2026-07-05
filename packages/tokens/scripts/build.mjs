import { mkdirSync, readFileSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const specDir = join(rootDir, 'spec');
const distDir = join(rootDir, 'dist');
const cssDir = join(distDir, 'css');

function loadJson(relativePath) {
  return JSON.parse(readFileSync(join(specDir, relativePath), 'utf-8'));
}

function mapEntriesToVariables(entries) {
  return Object.entries(entries)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ name, value }));
}

function appendCssCommentBlock(lines, commentLines, indent = '  ') {
  if (!commentLines?.length) {
    return;
  }

  if (commentLines.length === 1) {
    lines.push(`${indent}/* ${commentLines[0]} */`);
    return;
  }

  lines.push(`${indent}/* ${commentLines[0]}`);
  for (const line of commentLines.slice(1)) {
    const normalized = line.startsWith('*') ? line : `* ${line}`;
    lines.push(`${indent}   ${normalized}`);
  }
  lines.push(`${indent}   */`);
}

const COLOR_SEMANTIC_GROUP_ORDER = [
  { prefix: 'box', comment: 'Box（容器 / 背景）' },
  { prefix: 'event', comment: 'Event（交互状态）' },
  { prefix: 'stroke', comment: 'Stroke（描边 / 分割线）' },
  { prefix: 'text', comment: 'Text（文本色）' },
  { prefix: 'material', comment: 'Material（材质 / 填充）' },
  { prefix: 'data-table', comment: 'Data Table（表格）' },
  { prefix: 'effect', comment: 'Effect（特效色）' },
];

function groupColorSemanticTokens(tokens) {
  const assigned = new Set();

  const groups = COLOR_SEMANTIC_GROUP_ORDER.map(({ prefix, comment }) => {
    const groupTokens = tokens.filter((token) => {
      if (assigned.has(token.name)) {
        return false;
      }

      const matches =
        prefix === 'data-table'
          ? token.name.startsWith('data-table')
          : token.name.startsWith(`${prefix}-`);

      if (matches) {
        assigned.add(token.name);
      }

      return matches;
    });

    return { comment, tokens: groupTokens };
  }).filter((group) => group.tokens.length > 0);

  const remaining = tokens.filter((token) => !assigned.has(token.name));
  if (remaining.length > 0) {
    groups.push({ comment: 'Other', tokens: remaining });
  }

  return groups;
}

function flattenScaleSemanticTokens(semanticSpec) {
  return (semanticSpec.groups ?? []).flatMap((group) => group.tokens);
}

function resolveScaleBaseUnit(baseSpec) {
  return baseSpec.scaleBase ?? baseSpec.controlBase ?? 4;
}

function buildScaleBaseVariables(baseSpec) {
  const unit = resolveScaleBaseUnit(baseSpec);
  const scaleVars = [{ name: 'scale-base', value: `${unit}px` }];

  for (const [name, entry] of Object.entries(baseSpec.scale)) {
    if (typeof entry === 'number') {
      scaleVars.push({
        name,
        value: `calc(${entry} * var(--scale-base))`,
        comment: `${entry} × ${unit}px`,
      });
      continue;
    }

    scaleVars.push({ name, value: entry });
  }

  const strokeVars = Object.entries(baseSpec.stroke).map(([name, value]) => ({ name, value }));

  return { unit, scaleVars, strokeVars };
}

function writeScaleBaseCssFile(destination, selector, baseSpec, headerLines = []) {
  const { unit, scaleVars, strokeVars } = buildScaleBaseVariables(baseSpec);
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
    '',
    '  /* 原始尺度引擎（Primitive Scale Engine）',
    '     scale(n) = n × var(--scale-base)',
    '     离散映射：仅预定义以下值 */',
    `  --scale-base: ${unit}px;`,
  ];

  for (const token of scaleVars.slice(1)) {
    if (token.comment) {
      const declaration = `  --${token.name}: ${token.value};`;
      const padding = Math.max(1, 34 - declaration.length);
      lines.push(`${declaration}${' '.repeat(padding)}/* ${token.comment} */`);
      continue;
    }

    lines.push(`  --${token.name}: ${token.value};`);
  }

  lines.push('');
  lines.push('  /* 描边系统（Stroke System）');
  lines.push('     独立于 4px 体系，用于视觉精度 */');
  for (const token of strokeVars) {
    lines.push(`  --${token.name}: ${token.value};`);
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function formatScaleSemanticLine(token) {
  const declaration = `  --${token.name}: ${token.value};`;
  if (!token.comment) {
    return declaration;
  }

  const padding = Math.max(1, 34 - declaration.length);
  return `${declaration}${' '.repeat(padding)}/* ${token.comment} */`;
}

function writeScaleSemanticCssFile(destination, selector, groups, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
  ];

  for (const group of groups) {
    lines.push('');
    lines.push(`  /* ${group.comment} */`);
    for (const token of group.tokens) {
      lines.push(formatScaleSemanticLine(token));
    }
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function flattenGroupedSemanticTokens(spec) {
  return (spec.groups ?? []).flatMap((group) => group.tokens);
}

function writeTypographyBaseCssFile(destination, selector, baseSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
    '',
    '  /* ---- 原始字体排印令牌（Primitive Tokens） ---- */',
  ];

  for (const group of baseSpec.groups) {
    lines.push(`  /* ${group.comment} */`);
    for (const [name, value] of Object.entries(group.tokens)) {
      lines.push(`  --${name}: ${value};`);
    }
    lines.push('');
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeTypographySemanticCssFile(destination, selector, semanticSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
    '',
    '  /* ---- 语义角色令牌（Semantic Role Tokens） ---- */',
  ];

  for (const group of semanticSpec.groups) {
    lines.push(`  /* ${group.comment} */`);
    for (const token of group.tokens) {
      lines.push(`  --${token.name}: ${token.value};`);
    }
    lines.push('');
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeTypographyGlobalCssFile(destination, globalSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    '/* ---- 全局字体家族 ---- */',
    `${globalSpec.selector} {`,
  ];

  for (const [property, value] of Object.entries(globalSpec.properties)) {
    lines.push(`  ${property}: ${value};`);
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeTextStylesCssFile(destination, stylesSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    '/* ========================================',
    '   语义角色类',
    '   名称与 Figma Text Styles 完全一致',
    '   ======================================== */',
    '',
  ];

  for (const style of stylesSpec.styles) {
    if (style.title) {
      lines.push(`/* ${style.title} */`);
    }

    lines.push(`.${style.className} {`);
    for (const [property, value] of Object.entries(style.properties)) {
      lines.push(`  ${property}: ${value};`);
    }

    appendCssCommentBlock(lines, style.notes ?? [], '  ');

    lines.push('}', '');
  }

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function formatEffectLayers(layers) {
  if (layers.length === 1) {
    return layers[0];
  }

  return `\n    ${layers.join(',\n    ')}`;
}

function appendEffectGroupTokens(lines, groups) {
  for (const group of groups) {
    lines.push('');
    lines.push('  /* ========================================');
    lines.push(`     ${group.comment}`);
    lines.push('     ======================================== */');
    lines.push('');

    for (const token of group.tokens) {
      if (token.title) {
        lines.push(`  /* ${token.title} */`);
      }

      if (token.placeholder || (!token.layers && !token.value && !token.glowLayers?.length)) {
        appendCssCommentBlock(lines, token.implementationNotes ?? []);
        if (token.note) {
          appendCssCommentBlock(lines, [token.note]);
        }
        appendCssCommentBlock(lines, token.usageNotes ?? []);
        lines.push('');
        continue;
      }

      const value = token.layers ? formatEffectLayers(token.layers) : token.value;

      if (token.glowLayers?.length) {
        const blendMode = token.glowBlendMode ?? 'plus-darker';
        const normalLayerCount = token.layers?.length ?? 0;
        const pseudoElement = token.glowPseudo ?? (token.glowOnly ? '::before' : '::after');

        if (token.glowOnly || normalLayerCount === 0) {
          lines.push(
            `  /* Figma 共 ${token.glowLayers.length} 层：全部 ${blendMode}（${pseudoElement} + mix-blend-mode） */`,
          );
        } else {
          lines.push(
            `  /* Figma 共 ${token.glowLayers.length + normalLayerCount} 层：第 1–${token.glowLayers.length} 层 ${blendMode}（${pseudoElement} + mix-blend-mode） */`,
          );
          lines.push(`  /* 第 ${token.glowLayers.length + 1} 层起：Normal */`);
        }

        lines.push(`  --${token.name}-glow: ${formatEffectLayers(token.glowLayers)};`);
        lines.push(`  --${token.name}-glow-blend-mode: ${blendMode};`);
      }

      if (token.glowOnly) {
        lines.push(`  --${token.name}: var(--${token.name}-glow);`);
      } else if (token.layers) {
        lines.push(`  --${token.name}: ${value};`);
      } else if (token.value) {
        lines.push(`  --${token.name}: ${value};`);
      }
      appendCssCommentBlock(lines, token.usageNotes ?? []);
      lines.push('');
    }
  }
}

function appendLiquidGlassTokens(lines, liquidGlassSpec) {
  lines.push('');
  lines.push('  /* Liquid Glass — https://github.com/shuding/liquid-glass (MIT) */');

  const profiles = liquidGlassSpec.profiles ?? {
    glassBg: {
      cssPrefix: 'effect-glass-bg',
      backdrop: liquidGlassSpec.backdrop,
      shader: liquidGlassSpec.shader,
      surface: liquidGlassSpec.surface,
      fallback: liquidGlassSpec.fallback,
    },
  };

  for (const profile of Object.values(profiles)) {
    appendLiquidGlassProfileTokens(lines, profile);
  }
}

function appendLiquidGlassProfileTokens(lines, profile) {
  const prefix = profile.cssPrefix;
  const { backdrop, shader, surface, fallback } = profile;

  if (profile.title) {
    lines.push(`  /* ${profile.title} */`);
  }

  if (profile.figma) {
    lines.push(
      `  /* Figma Glass: angle ${profile.figma.lightAngle}° intensity ${profile.figma.lightIntensity} refraction ${profile.figma.refraction} depth ${profile.figma.depth} frost ${profile.figma.frost} splay ${profile.figma.splay} */`,
    );
  }

  appendCssCommentBlock(lines, profile.mappingNotes ?? []);

  lines.push(`  --${prefix}-blur: ${backdrop.blur};`);
  lines.push(`  --${prefix}-contrast: ${backdrop.contrast};`);
  lines.push(`  --${prefix}-brightness: ${backdrop.brightness};`);
  lines.push(`  --${prefix}-saturate: ${backdrop.saturate};`);
  lines.push(`  --${prefix}-shader-edge-start: ${shader.edgeStart};`);
  lines.push(`  --${prefix}-shader-edge-end: ${shader.edgeEnd};`);
  lines.push(`  --${prefix}-shader-edge-offset: ${shader.edgeOffset};`);
  lines.push(`  --${prefix}-shader-rect-inset-x: ${shader.rectInsetX};`);
  lines.push(`  --${prefix}-shader-rect-inset-y: ${shader.rectInsetY};`);
  lines.push(`  --${prefix}-shader-corner-radius: ${shader.cornerRadius};`);
  lines.push(`  --${prefix}-refraction-scale: ${shader.refractionScale};`);
  lines.push(`  --${prefix}-surface: ${mapColorTokenValue(surface.background)};`);
  if (profile.tint) {
    lines.push(`  --${prefix}-tint: ${mapColorTokenValue(profile.tint)};`);
  }
  lines.push(`  --${prefix}-fallback: ${fallback.backdropFilter};`);
  lines.push(`  --${prefix}-fallback-surface: ${mapColorTokenValue(fallback.background)};`);
  lines.push(
    `  --${prefix}: blur(var(--${prefix}-blur)) contrast(var(--${prefix}-contrast)) brightness(var(--${prefix}-brightness)) saturate(var(--${prefix}-saturate));`,
  );
  lines.push('');
}

function writeEffectThemeBaseCssFile(
  destination,
  selector,
  themeName,
  baseSpec,
  liquidGlassSpec,
  headerLines = [],
) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' * Color primitives reference var(--eds-*) from the matching color theme.',
    ' */',
    '',
    `${selector} {`,
  ];

  const themeColors = baseSpec.colors?.[themeName];
  if (themeColors && Object.keys(themeColors).length > 0) {
    lines.push('  /* Effect 色 primitive（引用 color 基色） */');
    for (const [name, value] of Object.entries(themeColors)) {
      lines.push(`  --${name}: ${mapColorTokenValue(value)};`);
    }
  }

  appendEffectGroupTokens(lines, baseSpec.groups);
  appendLiquidGlassTokens(lines, liquidGlassSpec);
  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeEffectReadyCssFile(destination, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    '.effect-flotation-box__glass[data-liquid-glass-ready], .effect-popup-box__glass[data-liquid-glass-ready] {',
    '  /* backdrop-filter 由 initLiquidGlass() 按元素尺寸注入 SVG filter url */',
    '}',
    '',
  ];

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function buildLiquidGlassAssets() {
  const source = join(rootDir, 'src/liquid-glass.js');
  const destination = join(distDir, 'js/liquid-glass.js');
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
}

function effectThemeSelector(themeName) {
  return `[data-theme="${themeName}"]`;
}

function buildEffectSemanticClassSelector(themeName, className, pseudo = '') {
  return `[data-theme="${themeName}"] .${className}${pseudo}`;
}

function findEffectToken(baseSpec, name) {
  for (const group of baseSpec.groups ?? []) {
    const token = group.tokens?.find((entry) => entry.name === name);
    if (token) {
      return token;
    }
  }

  return null;
}

function applyShadowStack(style, baseSpec, options = {}) {
  if (!style.shadowStack) {
    return style;
  }

  const token = findEffectToken(baseSpec, style.shadowStack);
  if (!token?.glowLayers?.length) {
    throw new Error(`Unknown effect shadowStack token: ${style.shadowStack}`);
  }

  const properties = { ...(style.properties ?? {}) };
  const pseudo = { ...(style.pseudo ?? {}) };

  properties.position = properties.position ?? 'relative';
  properties.isolation = properties.isolation ?? 'isolate';
  properties.overflow = properties.overflow ?? 'visible';
  properties['box-shadow'] = `var(--${token.name})`;

  pseudo['::after'] = {
    content: "''",
    position: 'absolute',
    inset: '0',
    'z-index': '0',
    'border-radius': 'inherit',
    'box-shadow': `var(--${token.name}-glow)`,
    'mix-blend-mode': 'plus-darker',
    '-webkit-mix-blend-mode': 'plus-darker',
    'pointer-events': 'none',
    ...pseudo['::after'],
  };

  if (options.skipChild) {
    return { ...style, properties, pseudo };
  }

  const hasBefore = Boolean(pseudo['::before']);
  const child = style.child ?? {
    selector: '> *',
    properties: {
      position: 'relative',
      'z-index': hasBefore ? '2' : '1',
    },
  };

  if (hasBefore && child.properties?.['z-index'] === '1') {
    child.properties = { ...child.properties, 'z-index': '2' };
  }

  return { ...style, properties, pseudo, child };
}

function applyGlassStack(style, baseSpec, options = {}) {
  if (!style.glassStack) {
    return style;
  }

  const token = findEffectToken(baseSpec, style.glassStack);
  if (!token?.glowLayers?.length) {
    throw new Error(`Unknown effect glassStack token: ${style.glassStack}`);
  }

  const pseudo = { ...(style.pseudo ?? {}) };

  const shadowVar = token.glowOnly ? `var(--${token.name})` : `var(--${token.name}-glow)`;

  pseudo['::before'] = {
    content: "''",
    position: 'absolute',
    inset: '0',
    'z-index': '1',
    'border-radius': 'inherit',
    'box-shadow': shadowVar,
    'mix-blend-mode': 'plus-lighter',
    '-webkit-mix-blend-mode': 'plus-lighter',
    'pointer-events': 'none',
    ...pseudo['::before'],
  };

  if (options.skipChild) {
    return { ...style, pseudo };
  }

  const child = style.child ?? {
    selector: '> *',
    properties: {
      position: 'relative',
      'z-index': '2',
    },
  };

  if (child.properties?.['z-index'] === '1') {
    child.properties = { ...child.properties, 'z-index': '2' };
  }

  return { ...style, pseudo, child };
}

function resolveLayerStyle(baseStyle, layer, baseSpec) {
  let layerStyle = {
    className: `${baseStyle.className}${layer.suffix}`,
    properties: { ...(layer.properties ?? {}) },
    pseudo: { ...(layer.pseudo ?? {}) },
  };

  if (layer.shadowStack) {
    layerStyle = applyShadowStack(
      { ...layerStyle, shadowStack: layer.shadowStack },
      baseSpec,
      { skipChild: true },
    );
  }

  if (layer.glassStack) {
    layerStyle = applyGlassStack(
      { ...layerStyle, glassStack: layer.glassStack },
      baseSpec,
      { skipChild: true },
    );
  }

  return layerStyle;
}

function appendEffectStyleRules(lines, themeName, resolvedStyle, { includeNotes = false } = {}) {
  lines.push(`${buildEffectSemanticClassSelector(themeName, resolvedStyle.className)} {`);
  for (const [property, value] of Object.entries(resolvedStyle.properties ?? {})) {
    lines.push(`  ${property}: ${value};`);
  }

  if (includeNotes) {
    for (const note of resolvedStyle.notes ?? []) {
      lines.push(`  /* ${note} */`);
    }
  }

  lines.push('}', '');

  for (const [pseudo, properties] of Object.entries(resolvedStyle.pseudo ?? {})) {
    lines.push(`${buildEffectSemanticClassSelector(themeName, resolvedStyle.className, pseudo)} {`);
    for (const [property, value] of Object.entries(properties)) {
      lines.push(`  ${property}: ${value};`);
    }
    lines.push('}', '');
  }

  if (resolvedStyle.child) {
    const childSelector = resolvedStyle.child.selector ?? '> *';
    lines.push(
      `${buildEffectSemanticClassSelector(themeName, resolvedStyle.className)} ${childSelector} {`,
    );
    for (const [property, value] of Object.entries(resolvedStyle.child.properties ?? {})) {
      lines.push(`  ${property}: ${value};`);
    }
    lines.push('}', '');
  }
}

function appendLayeredComposition(lines, themeName, style, baseSpec) {
  if (style.title) {
    lines.push(`/* ${style.title} */`);
  }

  appendEffectStyleRules(
    lines,
    themeName,
    {
      className: style.className,
      properties: {
        position: 'relative',
        isolation: 'isolate',
        overflow: 'visible',
        ...(style.properties ?? {}),
      },
      notes: style.notes,
    },
    { includeNotes: true },
  );

  if (style.bgLayer) {
    appendEffectStyleRules(lines, themeName, {
      className: `${style.className}${style.bgLayer.suffix}`,
      properties: style.bgLayer.properties ?? {},
    });
    for (const layer of style.bgLayer.layers ?? []) {
      appendEffectStyleRules(lines, themeName, resolveLayerStyle(style, layer, baseSpec));
    }
  } else {
    for (const layer of style.layers ?? []) {
      appendEffectStyleRules(lines, themeName, resolveLayerStyle(style, layer, baseSpec));
    }
  }

  if (style.contentLayer) {
    appendEffectStyleRules(lines, themeName, {
      className: `${style.className}${style.contentLayer.suffix}`,
      properties: style.contentLayer.properties ?? {},
    });
  }
}

function formatShadowStackComment(token) {
  const blendMode = token.glowBlendMode ?? 'plus-darker';
  const normalLayerCount = token.layers?.length ?? 0;

  if (token.glowOnly || normalLayerCount === 0) {
    return `${token.title ?? token.name} — ${token.glowLayers.length} layers, all ${blendMode}`;
  }

  return `${token.title ?? token.name} — layers 1–${token.glowLayers.length} ${blendMode}, layer ${token.glowLayers.length + 1}+ Normal`;
}

function appendShadowStackUtilityClasses(lines, themeName, baseSpec) {
  lines.push('/* ========================================');
  lines.push('   Shadow Stack Utilities');
  lines.push('   ======================================== */');
  lines.push('');

  for (const group of baseSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      if (!token.glowLayers?.length || token.glowOnly) {
        continue;
      }

      const className = `${token.name}-stack`;
      lines.push(`/* ${formatShadowStackComment(token)} */`);
      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} {`);
      lines.push('  position: relative;');
      lines.push('  isolation: isolate;');
      lines.push('  overflow: visible;');
      lines.push(`  box-shadow: var(--${token.name});`);
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className, '::after')} {`);
      lines.push("  content: '';");
      lines.push('  position: absolute;');
      lines.push('  inset: 0;');
      lines.push('  z-index: 0;');
      lines.push('  border-radius: inherit;');
      lines.push(`  box-shadow: var(--${token.name}-glow);`);
      lines.push(`  mix-blend-mode: plus-darker;`);
      lines.push(`  -webkit-mix-blend-mode: plus-darker;`);
      lines.push('  pointer-events: none;');
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} > * {`);
      lines.push('  position: relative;');
      lines.push('  z-index: 1;');
      lines.push('}', '');
    }
  }
}

function appendGlassStackUtilityClasses(lines, themeName, baseSpec) {
  lines.push('/* ========================================');
  lines.push('   Glass Stack Utilities');
  lines.push('   ======================================== */');
  lines.push('');

  for (const group of baseSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      if (!token.glowLayers?.length || !token.glowOnly) {
        continue;
      }

      const className = `${token.name}-stack`;
      lines.push(`/* ${formatShadowStackComment(token)} */`);
      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} {`);
      lines.push('  position: relative;');
      lines.push('  isolation: isolate;');
      lines.push('  overflow: visible;');
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className, '::before')} {`);
      lines.push("  content: '';");
      lines.push('  position: absolute;');
      lines.push('  inset: 0;');
      lines.push('  z-index: 1;');
      lines.push('  border-radius: inherit;');
      lines.push(`  box-shadow: var(--${token.name}-glow);`);
      lines.push(`  mix-blend-mode: plus-darker;`);
      lines.push(`  -webkit-mix-blend-mode: plus-darker;`);
      lines.push('  pointer-events: none;');
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} > * {`);
      lines.push('  position: relative;');
      lines.push('  z-index: 2;');
      lines.push('}', '');
    }
  }
}

function writeEffectThemeSemanticCssFile(
  destination,
  themeName,
  semanticSpec,
  baseSpec,
  headerLines = [],
) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
  ];

  for (const group of semanticSpec.groups) {
    lines.push('/* ========================================');
    lines.push(`   ${group.comment}`);
    lines.push('   ======================================== */');
    lines.push('');

    for (const style of group.styles) {
      if (style.composition === 'layered') {
        appendLayeredComposition(lines, themeName, style, baseSpec);
        continue;
      }

      const resolvedStyle = applyGlassStack(applyShadowStack(style, baseSpec), baseSpec);

      if (resolvedStyle.title) {
        lines.push(`/* ${resolvedStyle.title} */`);
      }

      appendEffectStyleRules(lines, themeName, resolvedStyle, { includeNotes: true });
    }
  }

  appendShadowStackUtilityClasses(lines, themeName, baseSpec);
  appendGlassStackUtilityClasses(lines, themeName, baseSpec);

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function formatDisplayP3Component(value) {
  return Number(value.toFixed(4)).toString();
}

function resolveColorBaseEntry(entry) {
  if (typeof entry === 'string') {
    return { hex: entry, displayP3: null };
  }

  return entry;
}

function formatColorBaseCssDeclarations(name, entry) {
  const { hex, displayP3 } = resolveColorBaseEntry(entry);
  const lines = [`  --${name}: ${hex};`];

  if (displayP3) {
    const [r, g, b] = displayP3;
    lines.push(
      `  --${name}: color(display-p3 ${formatDisplayP3Component(r)} ${formatDisplayP3Component(g)} ${formatDisplayP3Component(b)});`,
    );
  }

  return lines;
}

function writeColorBaseCssFile(destination, selector, themeName, baseSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' * Values: sRGB fallback + color(display-p3) from Figma node 2008:41.',
    ' */',
    '',
    `${selector} {`,
    '  /* 基色（Primitives@Cregis）— hex 为回退，下一行 display-p3 为正式值 */',
  ];

  for (const [name, entry] of Object.entries(baseSpec[themeName]).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    lines.push(...formatColorBaseCssDeclarations(name, entry));
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function parseEdsColorReference(value) {
  const match = value.match(/^color\(var\((--eds-[a-z-]+)\)\s*\/\s*([0-9.]+)\)$/);
  if (!match) {
    return null;
  }

  const [, varName, alphaRaw] = match;
  return { varName, edsKey: varName.slice(2), alpha: Number(alphaRaw) };
}

function mapColorTokenValue(value) {
  const reference = parseEdsColorReference(value);
  if (!reference) {
    return value;
  }

  const { varName, alpha } = reference;

  if (alpha === 0) {
    return 'transparent';
  }

  if (alpha === 1) {
    return `var(${varName})`;
  }

  const percent = `${Math.round(alpha * 1000) / 10}%`;
  return `color-mix(in display-p3, var(${varName}) ${percent}, transparent)`;
}

function writeColorSemanticCssFile(destination, selector, groups, themeName, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' * Mapped with color-mix(in display-p3) referencing var(--eds-*).',
    ' */',
    '',
    `${selector} {`,
  ];

  for (const group of groups) {
    lines.push('');
    lines.push(`  /* ${group.comment} */`);
    for (const token of group.tokens) {
      const comment = token.comment ? ` /* ${token.comment} */` : '';
      const mappedValue = mapColorTokenValue(token[themeName]);
      lines.push(`  --${token.name}: ${mappedValue};${comment}`);
    }
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeCssFile(destination, selector, variables, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
  ];

  for (const variable of variables) {
    const comment = variable.description ? ` /** ${variable.description} */` : '';
    lines.push(`  --${variable.name}: ${variable.value};${comment}`);
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeImportAggregator(destination, imports, title) {
  const lines = [
    '/**',
    ` * ${title}`,
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
    ...imports.map((file) => `@import '${file}';`),
    '',
  ];

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function themeSelector(themeName) {
  return themeName === 'light' ? ':root, [data-theme="light"]' : `[data-theme="${themeName}"]`;
}

function buildScaleSystem() {
  const baseSpec = loadJson('scale/base.json');
  const semanticSpec = loadJson('scale/semantic.json');

  writeScaleBaseCssFile(join(cssDir, 'scale/base.css'), ':root', baseSpec, [
    ' * Scale System — base primitives (基数).',
    ' * Source: spec/scale/base.json',
    ' * Formula: scale(n) = n × var(--scale-base). Stroke is independent of the 4px grid.',
  ]);

  writeScaleSemanticCssFile(
    join(cssDir, 'scale/semantic.css'),
    ':root',
    semanticSpec.groups,
    [
      ' * Scale System — semantic mappings (语义尺度 → 基数).',
      ' * Source: spec/scale/semantic.json',
    ],
  );

  writeImportAggregator(
    join(cssDir, 'scale/index.css'),
    ['./base.css', './semantic.css'],
    'Scale System entry',
  );
}

function buildTypographySystem() {
  const baseSpec = loadJson('typography/base.json');
  const semanticSpec = loadJson('typography/semantic.json');
  const globalSpec = loadJson('typography/global.json');

  writeTypographyBaseCssFile(join(cssDir, 'typography/base.css'), ':root', baseSpec, [
    ' * Typography System — base primitives (原始字体排印令牌).',
    ' * Source: spec/typography/base.json',
  ]);

  writeTypographySemanticCssFile(
    join(cssDir, 'typography/semantic.css'),
    ':root',
    semanticSpec,
    [
      ' * Typography System — semantic role tokens (语义角色令牌 → base).',
      ' * Source: spec/typography/semantic.json',
    ],
  );

  writeTypographyGlobalCssFile(join(cssDir, 'typography/global.css'), globalSpec, [
    ' * Typography System — global defaults.',
    ' * Source: spec/typography/global.json',
  ]);

  writeImportAggregator(
    join(cssDir, 'typography/index.css'),
    ['./base.css', './semantic.css', './global.css'],
    'Typography System entry',
  );
}

function buildTextSystem() {
  const stylesSpec = loadJson('text/styles.json');

  writeTextStylesCssFile(join(cssDir, 'text/styles.css'), stylesSpec, [
    ' * Text System — semantic role classes (文本样式 → typography).',
    ' * Source: spec/text/styles.json',
    ' * Class names match Figma Text Styles.',
  ]);

  writeImportAggregator(
    join(cssDir, 'text/index.css'),
    ['../typography/index.css', './styles.css'],
    'Text System entry',
  );
}

function buildEffectSystem() {
  const baseSpec = loadJson('effect/base.json');
  const semanticSpec = loadJson('effect/semantic.json');
  const liquidGlassSpec = loadJson('effect/liquid-glass.json');

  for (const themeName of ['light', 'dark']) {
    const selector = effectThemeSelector(themeName);
    const themeDir = join(cssDir, 'effect/themes', themeName);

    writeEffectThemeBaseCssFile(
      join(themeDir, 'base.css'),
      selector,
      themeName,
      baseSpec,
      liquidGlassSpec,
      [
        ` * Effect System — base tokens (${themeName}).`,
        ' * Source: spec/effect/base.json, spec/effect/liquid-glass.json',
      ],
    );

    writeEffectThemeSemanticCssFile(
      join(themeDir, 'semantic.css'),
      themeName,
      semanticSpec,
      baseSpec,
      [
        ` * Effect System — semantic classes (${themeName}).`,
        ' * Source: spec/effect/semantic.json, spec/effect/base.json (shadow stacks)',
      ],
    );

    writeImportAggregator(
      join(cssDir, 'effect/themes', `${themeName}.css`),
      [`./${themeName}/base.css`, `./${themeName}/semantic.css`],
      `Effect System entry (${themeName})`,
    );
  }

  writeEffectReadyCssFile(join(cssDir, 'effect/ready.css'), [' * Effect System — liquid glass ready hook.']);

  buildLiquidGlassAssets();

  writeImportAggregator(
    join(cssDir, 'effect/index.css'),
    ['./themes/light.css', './themes/dark.css', './ready.css'],
    'Effect System entry (all themes)',
  );
}

function buildColorSystem() {
  const baseSpec = loadJson('color/base.json');
  const semanticSpec = loadJson('color/semantic.json');

  for (const themeName of ['light', 'dark']) {
    const selector = themeSelector(themeName);
    const themeDir = join(cssDir, 'color/themes', themeName);

    const semanticGroups = groupColorSemanticTokens(semanticSpec.tokens);

    writeColorBaseCssFile(join(themeDir, 'base.css'), selector, themeName, baseSpec, [
      ` * Color System — base palette (${themeName}).`,
      ' * Source: spec/color/base.json',
      ' * Figma: node 2008:41 (Primitives@Cregis)',
    ]);

    writeColorSemanticCssFile(join(themeDir, 'semantic.css'), selector, semanticGroups, themeName, [
      ` * Color System — semantic colors referencing base (${themeName}).`,
      ' * Source: spec/color/semantic.json',
      ' * Figma: node 2536:5814 (Variable Name column)',
    ]);

    writeImportAggregator(
      join(cssDir, 'color/themes', `${themeName}.css`),
      [`./${themeName}/base.css`, `./${themeName}/semantic.css`],
      `Color System entry (${themeName})`,
    );
  }

  writeImportAggregator(
    join(cssDir, 'color/index.css'),
    ['./themes/light.css', './themes/dark.css'],
    'Color System entry (all themes)',
  );
}

function buildRootIndex() {
  writeImportAggregator(
    join(cssDir, 'index.css'),
    [
      './scale/index.css',
      './typography/index.css',
      './text/index.css',
      './color/index.css',
      './effect/index.css',
    ],
    'EverGreen Design Tokens — layered CSS architecture',
  );
}

function buildJsonExport() {
  const scaleBaseSpec = loadJson('scale/base.json');
  const scaleSemanticSpec = loadJson('scale/semantic.json');
  const typographyBaseSpec = loadJson('typography/base.json');
  const typographySemanticSpec = loadJson('typography/semantic.json');
  const textStylesSpec = loadJson('text/styles.json');
  const effectBaseSpec = loadJson('effect/base.json');
  const effectSemanticSpec = loadJson('effect/semantic.json');

  const scaleUnit = resolveScaleBaseUnit(scaleBaseSpec);
  const scaleMultipliers = {};
  const scaleLiterals = {};
  const scaleFormulas = {};
  const scaleResolved = {};

  for (const [name, entry] of Object.entries(scaleBaseSpec.scale)) {
    if (typeof entry === 'number') {
      scaleMultipliers[name] = entry;
      scaleFormulas[name] = `calc(${entry} * var(--scale-base))`;
      scaleResolved[name] = `${entry * scaleUnit}px`;
      continue;
    }

    scaleLiterals[name] = entry;
    scaleFormulas[name] = entry;
    scaleResolved[name] = entry;
  }

  const scaleBase = {
    scaleBase: scaleUnit,
    multipliers: scaleMultipliers,
    literals: scaleLiterals,
    stroke: scaleBaseSpec.stroke,
    formulas: scaleFormulas,
    resolved: scaleResolved,
  };
  const scaleSemantic = Object.fromEntries(
    flattenScaleSemanticTokens(scaleSemanticSpec).map((token) => [token.name, token.value]),
  );

  const typographyBase = Object.fromEntries(
    typographyBaseSpec.groups.flatMap((group) => Object.entries(group.tokens)),
  );
  const typographySemantic = Object.fromEntries(
    flattenGroupedSemanticTokens(typographySemanticSpec).map((token) => [token.name, token.value]),
  );

  const payload = {
    scaleBase,
    scaleSemantic,
    scale: {
      'scale-base': `${scaleUnit}px`,
      ...scaleFormulas,
      ...scaleBaseSpec.stroke,
      ...scaleSemantic,
    },
    typographyBase,
    typographySemantic,
    typography: {
      ...typographyBase,
      ...typographySemantic,
    },
    textStyles: Object.fromEntries(
      textStylesSpec.styles.map((style) => [style.className, style.properties]),
    ),
    effectBase: {
      colors: effectBaseSpec.colors,
      tokens: Object.fromEntries(
        effectBaseSpec.groups.flatMap((group) =>
          group.tokens
            .filter((token) => !token.placeholder)
            .map((token) => [
              token.name,
              token.layers ? token.layers.join(', ') : token.value,
            ]),
        ),
      ),
    },
    effectSemantic: Object.fromEntries(
      effectSemanticSpec.groups.flatMap((group) =>
        group.styles.map((style) => [style.className, style.properties ?? {}]),
      ),
    ),
  };

  const baseSpec = loadJson('color/base.json');
  const semanticSpec = loadJson('color/semantic.json');

  for (const themeName of ['light', 'dark']) {
    payload[`colorBase_${themeName}`] = baseSpec[themeName];
    payload[`colorSemantic_${themeName}`] = Object.fromEntries(
      semanticSpec.tokens.map((token) => [token.name, token[themeName]]),
    );
  }

  mkdirSync(join(distDir, 'json'), { recursive: true });
  writeFileSync(join(distDir, 'json/tokens.json'), JSON.stringify(payload, null, 2));
}

function buildAll() {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  buildScaleSystem();
  buildTypographySystem();
  buildTextSystem();
  buildEffectSystem();
  buildColorSystem();
  buildRootIndex();
  buildJsonExport();

  console.log('✓ Tokens built with layered CSS architecture');
}

buildAll();

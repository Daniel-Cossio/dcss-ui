#!/usr/bin/env node
/**
 * dcss-ui — Build System
 * Minimalist Design System & UI Kit
 *
 * Compiles and minifies CSS and JavaScript artifacts into dist/:
 * - dist/dcss.css (unminified bundle)
 * - dist/dcss.min.css (minified CSS)
 * - dist/dcss.esm.js (ESM bundle)
 * - dist/dcss.js (Standalone IIFE / UMD bundle)
 * - dist/dcss.min.js (minified Standalone IIFE)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const BANNER_CSS = '/*! dcss-ui v0.1.0 | MIT License | Minimalist Design System & UI Kit */\n';
const BANNER_JS = '/*! dcss-ui v0.1.0 | MIT License | Minimalist Design System & UI Kit */\n';

/**
 * Recursively resolve @import statements in CSS files
 */
function bundleCSS(entryPath, visited = new Set()) {
  const normalizedPath = path.resolve(entryPath);
  if (visited.has(normalizedPath)) {
    return '';
  }
  visited.add(normalizedPath);

  const baseDir = path.dirname(normalizedPath);
  const rawContent = fs.readFileSync(normalizedPath, 'utf8');

  return rawContent.replace(/@import\s+["']([^"']+)["'];?/g, (match, importFile) => {
    const targetPath = path.resolve(baseDir, importFile);
    if (!fs.existsSync(targetPath)) {
      throw new Error(`Imported CSS file not found: ${targetPath} (from ${entryPath})`);
    }
    return bundleCSS(targetPath, visited);
  });
}

/**
 * Minify CSS: strip comments, redundant spaces, newlines, and symbol padding
 */
function minifyCSS(css) {
  return BANNER_CSS + css
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Collapse all whitespace to single spaces
    .replace(/\s+/g, ' ')
    // Remove spaces around braces, semicolons, colons, commas, and operators
    .replace(/\s*([\{\}\;\:\,\>\~])\s*/g, '$1')
    // Remove trailing semicolons before closing braces
    .replace(/;\}/g, '}')
    // Remove empty rulesets
    .replace(/[^\}\{\/]+?\{\}/g, '')
    .trim();
}

/**
 * Tokenize and minify JavaScript safely preserving strings, regexes and operators
 */
function minifyJS(code) {
  const tokens = [];
  let i = 0;
  const len = code.length;

  while (i < len) {
    const ch = code[i];
    const next = code[i + 1];

    // Single-line comment
    if (ch === '/' && next === '/') {
      i += 2;
      while (i < len && code[i] !== '\n' && code[i] !== '\r') i++;
      continue;
    }

    // Multi-line comment
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < len && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    // Whitespace
    if (/\s/.test(ch)) {
      while (i < len && /\s/.test(code[i])) i++;
      tokens.push({ type: 'ws' });
      continue;
    }

    // String literals (single-quote, double-quote, template literal)
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      let str = quote;
      i++;
      while (i < len) {
        const c = code[i];
        str += c;
        if (c === '\\') {
          i++;
          if (i < len) str += code[i];
        } else if (c === quote) {
          break;
        }
        i++;
      }
      i++;
      tokens.push({ type: 'str', val: str });
      continue;
    }

    // Identifiers, numbers, keywords
    if (/[a-zA-Z0-9_$\.]/.test(ch)) {
      let word = '';
      while (i < len && /[a-zA-Z0-9_$\.]/.test(code[i])) {
        word += code[i];
        i++;
      }
      tokens.push({ type: 'word', val: word });
      continue;
    }

    // Multi-character operators
    const two = ch + (next || '');
    const three = two + (code[i + 2] || '');
    if (three === '===' || three === '!==' || three === '...') {
      tokens.push({ type: 'op', val: three });
      i += 3;
      continue;
    }
    if (['==', '!=', '<=', '>=', '&&', '||', '??', '=>', '++', '--', '+=', '-=', '*=', '/='].includes(two)) {
      tokens.push({ type: 'op', val: two });
      i += 2;
      continue;
    }

    // Single-character operator/punctuation
    tokens.push({ type: 'op', val: ch });
    i++;
  }

  // Assemble minified output
  let out = '';
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k];
    if (t.type === 'ws') {
      const prev = tokens[k - 1];
      const next = tokens[k + 1];
      if (prev && next) {
        if (prev.type === 'word' && next.type === 'word') {
          out += ' ';
        } else if (prev.type === 'word' && next.type === 'str') {
          out += ' ';
        } else if (prev.type === 'str' && next.type === 'word') {
          out += ' ';
        } else if (prev.val === '+' && next.val && next.val.startsWith('+')) {
          out += ' ';
        } else if (prev.val === '-' && next.val && next.val.startsWith('-')) {
          out += ' ';
        }
      }
      continue;
    }
    out += t.val;
  }

  return BANNER_JS + out.trim();
}

/**
 * Bundle JS source modules
 */
function buildJSSources() {
  const moduleNames = ['theme', 'toast', 'modal', 'dropdown', 'tabs', 'drawer'];
  let modulesCode = '';

  for (const name of moduleNames) {
    const filePath = path.join(srcDir, 'js', `${name}.js`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`JS source module not found: ${filePath}`);
    }
    let code = fs.readFileSync(filePath, 'utf8');

    // Remove import and export statements
    code = code.replace(/^\s*import\s+[^;]+;\s*$/gm, '');
    code = code.replace(/^\s*export\s+default\s+[^;]+;\s*$/gm, '');
    code = code.replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, '$1 ');

    modulesCode += `\n/* --- Module: ${name} --- */\nconst ${name} = (() => {\n${code.trim()}\n  return ${name};\n})();\n`;
  }

  // Extract initAll implementation from src/js/index.js
  const indexJsPath = path.join(srcDir, 'js', 'index.js');
  const indexJsContent = fs.readFileSync(indexJsPath, 'utf8');
  const initAllMatch = indexJsContent.match(/function\s+initAll[\s\S]*?\n\}/);
  const initAllCode = initAllMatch
    ? initAllMatch[0]
    : 'function initAll(root) { theme.init(); dropdown.init(root); tabs.init(root); drawer.init(root); }';

  const dcssObjectCode = `
const DCSS = {
  theme,
  toast,
  modal,
  dropdown,
  tabs,
  drawer,
  initAll
};
`;

  const autoInitCode = `
if (typeof window !== 'undefined') {
  window.DCSS = DCSS;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initAll(document);
      });
    } else {
      initAll(document);
    }
  }
}
`;

  // ESM bundle
  const esmBundle = `${BANNER_JS}
${modulesCode}
${initAllCode}
${dcssObjectCode}
${autoInitCode}
export { theme, toast, modal, dropdown, tabs, drawer, initAll, DCSS };
export default DCSS;
`;

  // Standalone IIFE / UMD bundle
  const iifeBundle = `${BANNER_JS}(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var api = factory();
    global.DCSS = api;
    if (typeof window !== 'undefined') {
      window.DCSS = api;
    }
  }
})(this, (function () {
  'use strict';
${modulesCode}
${initAllCode}
${dcssObjectCode}
${autoInitCode}
  return DCSS;
}));
`;

  return { esmBundle, iifeBundle };
}

/**
 * Main build executor
 */
export function build() {
  const startTime = Date.now();
  console.log('📦 Starting dcss-ui build...');

  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 1. Bundle CSS
  console.log('  -> Bundling CSS...');
  const cssEntry = path.join(srcDir, 'css', 'index.css');
  const rawCSS = bundleCSS(cssEntry);
  const bundledCSS = `${BANNER_CSS}\n${rawCSS}`;
  const dcssCssPath = path.join(distDir, 'dcss.css');
  fs.writeFileSync(dcssCssPath, bundledCSS, 'utf8');

  // 2. Minify CSS
  console.log('  -> Minifying CSS...');
  const minifiedCSS = minifyCSS(rawCSS);
  const dcssMinCssPath = path.join(distDir, 'dcss.min.css');
  fs.writeFileSync(dcssMinCssPath, minifiedCSS, 'utf8');

  // 3. Bundle JS (ESM & Standalone IIFE)
  console.log('  -> Bundling JavaScript...');
  const { esmBundle, iifeBundle } = buildJSSources();

  const dcssEsmPath = path.join(distDir, 'dcss.esm.js');
  fs.writeFileSync(dcssEsmPath, esmBundle, 'utf8');

  const dcssJsPath = path.join(distDir, 'dcss.js');
  fs.writeFileSync(dcssJsPath, iifeBundle, 'utf8');

  // 4. Minify JS (Standalone IIFE minified)
  console.log('  -> Minifying JavaScript (IIFE)...');
  const minifiedJS = minifyJS(iifeBundle);
  const dcssMinJsPath = path.join(distDir, 'dcss.min.js');
  fs.writeFileSync(dcssMinJsPath, minifiedJS, 'utf8');

  const elapsed = Date.now() - startTime;

  // Format file size
  const formatSize = (bytes) => `${(bytes / 1024).toFixed(2)} KB (${bytes} bytes)`;

  const stats = [
    { name: 'dist/dcss.css', size: fs.statSync(dcssCssPath).size },
    { name: 'dist/dcss.min.css', size: fs.statSync(dcssMinCssPath).size },
    { name: 'dist/dcss.esm.js', size: fs.statSync(dcssEsmPath).size },
    { name: 'dist/dcss.js', size: fs.statSync(dcssJsPath).size },
    { name: 'dist/dcss.min.js', size: fs.statSync(dcssMinJsPath).size }
  ];

  console.log(`\n✨ Build completed in ${elapsed}ms:`);
  stats.forEach(({ name, size }) => {
    console.log(`   - ${name.padEnd(20)} ${formatSize(size)}`);
  });

  return stats;
}

// Execute directly if run as CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    build();
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

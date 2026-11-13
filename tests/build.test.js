import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from '../scripts/build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const expectedFiles = {
  css: path.join(distDir, 'dcss.css'),
  minCss: path.join(distDir, 'dcss.min.css'),
  esm: path.join(distDir, 'dcss.esm.js'),
  js: path.join(distDir, 'dcss.js'),
  minJs: path.join(distDir, 'dcss.min.js')
};

test('Hito 4: Verification of Build Execution and Artifact Generation', async (t) => {
  await t.test('Build execution runs cleanly and creates dist artifacts', () => {
    const stats = build();
    assert.ok(Array.isArray(stats), 'build() should return stats array');
    assert.strictEqual(stats.length, 5, 'Should generate 5 artifacts');

    for (const [key, filePath] of Object.entries(expectedFiles)) {
      assert.ok(fs.existsSync(filePath), `Artifact ${key} (${path.basename(filePath)}) must exist in dist/`);
      const size = fs.statSync(filePath).size;
      assert.ok(size > 0, `Artifact ${path.basename(filePath)} must not be empty`);
    }
  });

  await t.test('Minification verification: .min files are smaller than unminified counterparts', () => {
    const cssSize = fs.statSync(expectedFiles.css).size;
    const minCssSize = fs.statSync(expectedFiles.minCss).size;
    const jsSize = fs.statSync(expectedFiles.js).size;
    const minJsSize = fs.statSync(expectedFiles.minJs).size;

    assert.ok(
      minCssSize < cssSize,
      `dcss.min.css (${minCssSize}B) should be smaller than dcss.css (${cssSize}B)`
    );
    assert.ok(
      minJsSize < jsSize,
      `dcss.min.js (${minJsSize}B) should be smaller than dcss.js (${jsSize}B)`
    );

    // Verify minimum 15% reduction
    const cssRatio = minCssSize / cssSize;
    const jsRatio = minJsSize / jsSize;
    assert.ok(cssRatio < 0.85, `CSS compression should achieve at least 15% reduction, got ${(1 - cssRatio) * 100}%`);
    assert.ok(jsRatio < 0.85, `JS compression should achieve at least 15% reduction, got ${(1 - jsRatio) * 100}%`);
  });
});

test('Hito 4: Verification of Bundled CSS Content and Syntax', async (t) => {
  const css = fs.readFileSync(expectedFiles.css, 'utf8');
  const minCss = fs.readFileSync(expectedFiles.minCss, 'utf8');

  await t.test('CSS bundles contain tokens from tokens.css', () => {
    const tokenSnippets = [
      '--dcss-bg-canvas',
      '--dcss-text-primary',
      '--dcss-primary',
      '--dcss-font-sans',
      '--dcss-font-mono',
      '--dcss-space-4',
      '--dcss-radius-md',
      '--dcss-shadow-md',
      '--dcss-glass-blur',
      '--dcss-bg-surface-glass'
    ];

    for (const token of tokenSnippets) {
      assert.ok(css.includes(token), `dcss.css must contain design token ${token}`);
      assert.ok(minCss.includes(token), `dcss.min.css must contain design token ${token}`);
    }
  });

  await t.test('CSS bundles contain selectors from all component stylesheets', () => {
    const componentSelectors = [
      '.dcss-btn',
      '.dcss-btn-primary',
      '.dcss-card',
      '.dcss-card-body',
      '.dcss-form-group',
      '.dcss-input',
      '.dcss-switch',
      '.dcss-badge',
      '.dcss-badge-pill',
      '.dcss-table',
      '.dcss-container',
      '.dcss-grid',
      '.dcss-modal',
      '.dcss-toast',
      '.dcss-dropdown',
      '.dcss-tabs',
      '.dcss-drawer',
      '.dcss-kbd',
      '.dcss-list-item',
      '.dcss-command-bar',
      '.dcss-action-bar',
      '.dcss-split-view'
    ];

    for (const sel of componentSelectors) {
      assert.ok(css.includes(sel), `dcss.css must contain component selector ${sel}`);
      assert.ok(minCss.includes(sel), `dcss.min.css must contain component selector ${sel}`);
    }
  });

  await t.test('CSS minified syntax has balanced braces and parentheses', () => {
    let braceCount = 0;
    let parenCount = 0;

    for (let i = 0; i < minCss.length; i++) {
      const char = minCss[i];
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      else if (char === '(') parenCount++;
      else if (char === ')') parenCount--;

      assert.ok(braceCount >= 0, `Unmatched closing brace in minified CSS at index ${i}`);
      assert.ok(parenCount >= 0, `Unmatched closing parenthesis in minified CSS at index ${i}`);
    }

    assert.strictEqual(braceCount, 0, 'Minified CSS must have balanced braces');
    assert.strictEqual(parenCount, 0, 'Minified CSS must have balanced parentheses');
  });
});

test('Hito 4: Verification of JavaScript ESM Bundle (dcss.esm.js)', async (t) => {
  await t.test('ESM bundle exports expected API and modules', async () => {
    const esmModule = await import(`file://${expectedFiles.esm}`);

    assert.ok(esmModule.default, 'ESM must export default DCSS object');
    assert.strictEqual(typeof esmModule.default, 'object');

    const expectedKeys = ['theme', 'toast', 'modal', 'dropdown', 'tabs', 'drawer', 'initAll'];
    for (const key of expectedKeys) {
      assert.ok(key in esmModule.default, `default export must include ${key}`);
      assert.ok(key in esmModule, `named export ${key} must exist`);
    }

    assert.strictEqual(typeof esmModule.default.initAll, 'function');
    assert.strictEqual(typeof esmModule.default.theme.toggle, 'function');
    assert.strictEqual(typeof esmModule.default.toast, 'function');
    assert.strictEqual(typeof esmModule.default.modal.open, 'function');
    assert.strictEqual(typeof esmModule.default.dropdown.toggle, 'function');
    assert.strictEqual(typeof esmModule.default.tabs.activate, 'function');
    assert.strictEqual(typeof esmModule.default.drawer.open, 'function');
  });
});

test('Hito 4: Verification of JavaScript Standalone Bundles (dcss.js and dcss.min.js)', async (t) => {
  const codeJs = fs.readFileSync(expectedFiles.js, 'utf8');
  const codeMinJs = fs.readFileSync(expectedFiles.minJs, 'utf8');

  await t.test('Standalone dcss.js evaluates in CommonJS environment', () => {
    const ctx = {
      module: { exports: {} },
      exports: {},
      globalThis: {}
    };
    vm.createContext(ctx);
    vm.runInContext(codeJs, ctx);

    const dcss = ctx.module.exports;
    assert.ok(dcss, 'dcss.js should export to module.exports in CJS');
    assert.strictEqual(typeof dcss.initAll, 'function');
    assert.strictEqual(typeof dcss.theme, 'object');
    assert.strictEqual(typeof dcss.toast, 'function');
    assert.strictEqual(typeof dcss.modal, 'object');
    assert.strictEqual(typeof dcss.dropdown, 'object');
    assert.strictEqual(typeof dcss.tabs, 'object');
    assert.strictEqual(typeof dcss.drawer, 'object');
  });

  await t.test('Standalone dcss.min.js evaluates in CommonJS environment', () => {
    const ctx = {
      module: { exports: {} },
      exports: {},
      globalThis: {}
    };
    vm.createContext(ctx);
    vm.runInContext(codeMinJs, ctx);

    const dcss = ctx.module.exports;
    assert.ok(dcss, 'dcss.min.js should export to module.exports in CJS');
    assert.strictEqual(typeof dcss.initAll, 'function');
    assert.strictEqual(typeof dcss.theme, 'object');
    assert.strictEqual(typeof dcss.toast, 'function');
    assert.strictEqual(typeof dcss.modal, 'object');
    assert.strictEqual(typeof dcss.dropdown, 'object');
    assert.strictEqual(typeof dcss.tabs, 'object');
    assert.strictEqual(typeof dcss.drawer, 'object');
  });

  await t.test('Standalone dcss.js attaches to window.DCSS in browser environment', () => {
    const mockDocument = {
      readyState: 'complete',
      querySelectorAll: () => [],
      addEventListener: () => {},
      documentElement: { setAttribute: () => {}, getAttribute: () => 'dark' }
    };
    const ctx = {
      window: {},
      document: mockDocument
    };
    ctx.globalThis = ctx.window;

    vm.createContext(ctx);
    vm.runInContext(codeJs, ctx);

    assert.ok(ctx.window.DCSS, 'dcss.js must expose window.DCSS in browser');
    assert.strictEqual(typeof ctx.window.DCSS.initAll, 'function');
    assert.strictEqual(typeof ctx.window.DCSS.theme.get, 'function');
  });

  await t.test('Standalone dcss.min.js attaches to window.DCSS in browser environment', () => {
    const mockDocument = {
      readyState: 'complete',
      querySelectorAll: () => [],
      addEventListener: () => {},
      documentElement: { setAttribute: () => {}, getAttribute: () => 'dark' }
    };
    const ctx = {
      window: {},
      document: mockDocument
    };
    ctx.globalThis = ctx.window;

    vm.createContext(ctx);
    vm.runInContext(codeMinJs, ctx);

    assert.ok(ctx.window.DCSS, 'dcss.min.js must expose window.DCSS in browser');
    assert.strictEqual(typeof ctx.window.DCSS.initAll, 'function');
    assert.strictEqual(typeof ctx.window.DCSS.theme.get, 'function');
  });
});

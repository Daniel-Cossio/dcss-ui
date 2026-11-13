import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const tokensPath = path.join(rootDir, 'src/css/tokens.css');
const resetPath = path.join(rootDir, 'src/css/reset.css');
const indexPath = path.join(rootDir, 'src/css/index.css');

test('Hito 1: Verification of CSS Files and Syntax', async (t) => {
  await t.test('CSS files exist and are not empty', () => {
    assert.ok(fs.existsSync(tokensPath), 'tokens.css must exist');
    assert.ok(fs.existsSync(resetPath), 'reset.css must exist');
    assert.ok(fs.existsSync(indexPath), 'index.css must exist');

    const tokensContent = fs.readFileSync(tokensPath, 'utf8');
    const resetContent = fs.readFileSync(resetPath, 'utf8');
    const indexContent = fs.readFileSync(indexPath, 'utf8');

    assert.ok(tokensContent.trim().length > 0, 'tokens.css should not be empty');
    assert.ok(resetContent.trim().length > 0, 'reset.css should not be empty');
    assert.ok(indexContent.trim().length > 0, 'index.css should not be empty');
  });

  await t.test('CSS files have balanced brackets and braces (basic syntax check)', () => {
    const files = [tokensPath, resetPath, indexPath];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      // Strip comments
      const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '');

      let braceCount = 0;
      let parenCount = 0;

      for (let i = 0; i < stripped.length; i++) {
        const char = stripped[i];
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        else if (char === '(') parenCount++;
        else if (char === ')') parenCount--;

        assert.ok(braceCount >= 0, `Unmatched closing brace in ${path.basename(file)} at position ${i}`);
        assert.ok(parenCount >= 0, `Unmatched closing parenthesis in ${path.basename(file)} at position ${i}`);
      }

      assert.strictEqual(braceCount, 0, `Unclosed brace in ${path.basename(file)}`);
      assert.strictEqual(parenCount, 0, `Unclosed parenthesis in ${path.basename(file)}`);
    }
  });

  await t.test('index.css imports tokens.css and reset.css in correct order', () => {
    const content = fs.readFileSync(indexPath, 'utf8');
    assert.match(content, /@import\s+['"]\.\/tokens\.css['"];/, 'index.css must import tokens.css');
    assert.match(content, /@import\s+['"]\.\/reset\.css['"];/, 'index.css must import reset.css');

    const tokensIndex = content.indexOf('tokens.css');
    const resetIndex = content.indexOf('reset.css');
    assert.ok(tokensIndex < resetIndex, 'tokens.css must be imported before reset.css');
  });
});

test('Hito 1: Verification of Design Tokens', async (t) => {
  const tokensContent = fs.readFileSync(tokensPath, 'utf8');

  await t.test('Theme scopes: :root (dark default) and light theme selector', () => {
    assert.match(tokensContent, /:root\s*\{/, ':root selector must be defined');
    assert.match(tokensContent, /\[data-theme=["']light["']\]/, '[data-theme="light"] selector must be defined');
    assert.match(tokensContent, /\.light-theme/, '.light-theme class selector must be defined');
  });

  await t.test('Surface, canvas and border tokens in dark and light modes', () => {
    const surfaceTokens = [
      '--dcss-bg-canvas',
      '--dcss-bg-surface',
      '--dcss-bg-surface-elevated',
      '--dcss-bg-surface-glass',
      '--dcss-bg-overlay',
      '--dcss-border-subtle',
      '--dcss-border-default',
      '--dcss-border-strong',
      '--dcss-border-focus'
    ];

    for (const token of surfaceTokens) {
      assert.ok(tokensContent.includes(token), `Missing surface/border token: ${token}`);
    }
  });

  await t.test('Text & Brand tokens', () => {
    const brandTokens = [
      '--dcss-text-primary',
      '--dcss-text-secondary',
      '--dcss-text-muted',
      '--dcss-text-inverse',
      '--dcss-primary',
      '--dcss-primary-hover',
      '--dcss-primary-active',
      '--dcss-primary-muted',
      '--dcss-accent',
      '--dcss-accent-hover'
    ];

    for (const token of brandTokens) {
      assert.ok(tokensContent.includes(token), `Missing text/brand token: ${token}`);
    }
  });

  await t.test('Semantic status colors: success, warning, danger, info', () => {
    const statuses = ['success', 'warning', 'danger', 'info'];
    for (const status of statuses) {
      assert.ok(tokensContent.includes(`--dcss-${status}`), `Missing --dcss-${status}`);
      assert.ok(tokensContent.includes(`--dcss-${status}-hover`), `Missing --dcss-${status}-hover`);
      assert.ok(tokensContent.includes(`--dcss-${status}-muted`), `Missing --dcss-${status}-muted`);
      assert.ok(tokensContent.includes(`--dcss-${status}-contrast`), `Missing --dcss-${status}-contrast`);
    }
  });

  await t.test('Typography tokens (sans, mono, scale xs to 3xl, weights, line-heights)', () => {
    assert.ok(tokensContent.includes('--dcss-font-sans'), 'Missing --dcss-font-sans');
    assert.ok(tokensContent.includes('--dcss-font-mono'), 'Missing --dcss-font-mono');

    const scales = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
    for (const s of scales) {
      assert.ok(tokensContent.includes(`--dcss-font-${s}`), `Missing font scale: --dcss-font-${s}`);
    }

    assert.ok(tokensContent.includes('--dcss-font-weight-normal'), 'Missing --dcss-font-weight-normal');
    assert.ok(tokensContent.includes('--dcss-font-weight-bold'), 'Missing --dcss-font-weight-bold');
    assert.ok(tokensContent.includes('--dcss-leading-tight'), 'Missing --dcss-leading-tight');
    assert.ok(tokensContent.includes('--dcss-leading-normal'), 'Missing --dcss-leading-normal');
  });

  await t.test('Modular Spacing Scale (--dcss-space-1 through --dcss-space-12)', () => {
    for (let i = 1; i <= 12; i++) {
      assert.ok(tokensContent.includes(`--dcss-space-${i}`), `Missing space token: --dcss-space-${i}`);
    }
  });

  await t.test('Border Radiuses (--dcss-radius-sm to --dcss-radius-full)', () => {
    const radii = ['sm', 'md', 'lg', 'xl', '2xl', 'full'];
    for (const r of radii) {
      assert.ok(tokensContent.includes(`--dcss-radius-${r}`), `Missing radius token: --dcss-radius-${r}`);
    }
  });

  await t.test('Elevations, Shadows, Glow and Glassmorphism', () => {
    const shadows = [
      '--dcss-shadow-sm',
      '--dcss-shadow-md',
      '--dcss-shadow-lg',
      '--dcss-shadow-xl',
      '--dcss-shadow-glow',
      '--dcss-glass-blur',
      '--dcss-glass-saturate'
    ];

    for (const shadow of shadows) {
      assert.ok(tokensContent.includes(shadow), `Missing elevation/shadow token: ${shadow}`);
    }
  });

  await t.test('Fluid Transitions and Z-index scales', () => {
    assert.ok(tokensContent.includes('--dcss-transition-fast'), 'Missing --dcss-transition-fast');
    assert.ok(tokensContent.includes('--dcss-transition-normal'), 'Missing --dcss-transition-normal');
    assert.ok(tokensContent.includes('--dcss-z-modal'), 'Missing --dcss-z-modal');
    assert.ok(tokensContent.includes('--dcss-z-toast'), 'Missing --dcss-z-toast');
  });
});

test('Hito 1: Verification of Reset CSS', async (t) => {
  const resetContent = fs.readFileSync(resetPath, 'utf8');

  await t.test('Box-sizing universal reset', () => {
    assert.match(resetContent, /\*,\s*\*::before,\s*\*::after\s*\{[\s\S]*box-sizing:\s*border-box;/);
  });

  await t.test('Body uses typography and background tokens', () => {
    assert.match(resetContent, /body\s*\{[\s\S]*var\(--dcss-bg-canvas/);
    assert.match(resetContent, /body\s*\{[\s\S]*var\(--dcss-text-primary/);
    assert.match(resetContent, /body\s*\{[\s\S]*var\(--dcss-font-sans/);
  });

  await t.test('Media elements, interactive elements and form resets', () => {
    assert.match(resetContent, /img[\s\S]*max-width:\s*100%/);
    assert.match(resetContent, /button[\s\S]*cursor:\s*pointer;/);
    assert.match(resetContent, /input,\s*button,\s*textarea,\s*select\s*\{[\s\S]*font:\s*inherit;/);
  });

  await t.test('Scrollbar styles for WebKit and Firefox', () => {
    assert.match(resetContent, /scrollbar-width:\s*thin;/);
    assert.match(resetContent, /::-webkit-scrollbar/);
    assert.match(resetContent, /::-webkit-scrollbar-thumb/);
  });
});

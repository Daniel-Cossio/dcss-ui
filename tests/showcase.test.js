import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const showcaseHtmlPath = path.join(rootDir, 'showcase/index.html');
const showcaseJsPath = path.join(rootDir, 'showcase/app.js');
const readmePath = path.join(rootDir, 'README.md');

test('Hito 5: Verification of Showcase Structure and Asset References', async (t) => {
  await t.test('showcase/index.html exists and is not empty', () => {
    assert.ok(fs.existsSync(showcaseHtmlPath), `showcase/index.html must exist at ${showcaseHtmlPath}`);
    const content = fs.readFileSync(showcaseHtmlPath, 'utf8').trim();
    assert.ok(content.length > 500, 'showcase/index.html should have substantial content');
  });

  await t.test('showcase/app.js exists and is not empty', () => {
    assert.ok(fs.existsSync(showcaseJsPath), `showcase/app.js must exist at ${showcaseJsPath}`);
    const content = fs.readFileSync(showcaseJsPath, 'utf8').trim();
    assert.ok(content.length > 200, 'showcase/app.js should have interactive logic');
  });

  await t.test('showcase/index.html references minified dist artifacts and app.js', () => {
    const html = fs.readFileSync(showcaseHtmlPath, 'utf8');
    assert.match(html, /<link[^>]+href=["'][^"']*dist\/dcss\.min\.css["']/, 'Must link to dist/dcss.min.css');
    assert.match(html, /<script[^>]+src=["'][^"']*dist\/dcss\.min\.js["']/, 'Must load dist/dcss.min.js');
    assert.match(html, /<script[^>]+src=["'][^"']*app\.js["']/, 'Must load app.js');
  });
});

test('Hito 5: Verification of Showcase Header, Theme and Navigation', async (t) => {
  const html = fs.readFileSync(showcaseHtmlPath, 'utf8');

  await t.test('Header has brand dcss-ui and version badge', () => {
    assert.ok(html.includes('dcss-ui'), 'Header must contain brand title dcss-ui');
    assert.match(html, /v\d+\.\d+\.\d+/, 'Header must display version badge');
  });

  await t.test('Header or Drawer provides interactive theme toggle button', () => {
    assert.match(html, /data-dcss-theme-toggle/, 'Must provide button with data-dcss-theme-toggle attribute');
  });

  await t.test('Provides drawer sidebar and menu toggle for mobile viewports', () => {
    assert.ok(html.includes('dcss-drawer'), 'Must contain .dcss-drawer element');
    assert.match(html, /data-dcss-drawer-target=["']#main-drawer["']|data-dcss-drawer/, 'Must have drawer trigger button');
  });

  await t.test('Contains navigation links to all required showcase sections', () => {
    const requiredSections = ['#tokens', '#buttons', '#cards', '#forms', '#badges', '#tables', '#interactive'];
    for (const sectionId of requiredSections) {
      assert.ok(html.includes(`href="${sectionId}"`), `Navigation must include link to ${sectionId}`);
    }
  });
});

test('Hito 5: Verification of Raycast Productivity Components in Showcase', async (t) => {
  const html = fs.readFileSync(showcaseHtmlPath, 'utf8');

  await t.test('Showcase contains dedicated Raycast Productivity section (#raycast)', () => {
    assert.ok(html.includes('id="raycast"'), 'Must have section #raycast');
    assert.ok(html.includes('Raycast'), 'Section must highlight Raycast aesthetic');
  });

  await t.test('Showcase header integrates interactive .dcss-command-bar with input and shortcut', () => {
    assert.ok(html.includes('dcss-command-bar'), 'Header must contain .dcss-command-bar');
    assert.ok(html.includes('dcss-command-bar-input'), 'Must contain .dcss-command-bar-input');
    assert.ok(html.includes('dcss-command-bar-icon'), 'Must contain .dcss-command-bar-icon');
    assert.ok(html.includes('dcss-command-bar-shortcut'), 'Must contain .dcss-command-bar-shortcut');
  });

  await t.test('Showcase demonstrates 3D tactile keycaps (.dcss-kbd) with sizes and groups', () => {
    assert.ok(html.includes('dcss-kbd'), 'Must showcase .dcss-kbd');
    assert.ok(html.includes('dcss-kbd-sm'), 'Must showcase .dcss-kbd-sm modifier');
    assert.ok(html.includes('dcss-kbd-group'), 'Must showcase .dcss-kbd-group container');
  });

  await t.test('Showcase demonstrates high-density list items (.dcss-list-item) with accessories', () => {
    assert.ok(html.includes('dcss-list'), 'Must showcase .dcss-list');
    assert.ok(html.includes('dcss-list-item'), 'Must showcase .dcss-list-item');
    assert.ok(html.includes('dcss-list-item-icon'), 'Must showcase .dcss-list-item-icon');
    assert.ok(html.includes('dcss-list-item-content'), 'Must showcase .dcss-list-item-content');
    assert.ok(html.includes('dcss-list-item-title'), 'Must showcase .dcss-list-item-title');
    assert.ok(html.includes('dcss-list-item-subtitle'), 'Must showcase .dcss-list-item-subtitle');
    assert.ok(html.includes('dcss-list-item-accessories'), 'Must showcase .dcss-list-item-accessories');
    assert.ok(html.includes('is-selected'), 'Must showcase .is-selected state on list items');
  });

  await t.test('Showcase demonstrates Split View dual layout (.dcss-split-view)', () => {
    assert.ok(html.includes('dcss-split-view'), 'Must showcase .dcss-split-view');
    assert.ok(html.includes('dcss-split-view-master'), 'Must showcase .dcss-split-view-master');
    assert.ok(html.includes('dcss-split-view-detail'), 'Must showcase .dcss-split-view-detail');
  });

  await t.test('Showcase demonstrates Action Bar (.dcss-action-bar) and modal integration', () => {
    assert.ok(html.includes('dcss-action-bar'), 'Must showcase .dcss-action-bar');
    assert.ok(html.includes('dcss-action-item'), 'Must showcase .dcss-action-item');
    // Verify modal dialog integrates action bar
    assert.match(html, /class=["'][^"']*dcss-modal-dialog[^"']*["'][\s\S]*?dcss-action-bar/, 'Modal dialog must incorporate .dcss-action-bar');
  });
});

test('Hito 5: Verification of Component Showcase Sections', async (t) => {
  const html = fs.readFileSync(showcaseHtmlPath, 'utf8');

  await t.test('Tokens section (#tokens) renders color swatches, shadows and typography', () => {
    assert.ok(html.includes('id="tokens"'), 'Must have section #tokens');
    assert.ok(html.includes('--dcss-bg-canvas'), 'Tokens section must display canvas token');
    assert.ok(html.includes('--dcss-primary'), 'Tokens section must display primary token');
    assert.ok(html.includes('--dcss-shadow-'), 'Tokens section must display shadow tokens');
    assert.ok(html.includes('--dcss-font-'), 'Tokens section must display typography scale');
  });

  await t.test('Buttons section (#buttons) renders all variants, sizes and interactive loading button', () => {
    assert.ok(html.includes('id="buttons"'), 'Must have section #buttons');
    assert.ok(html.includes('dcss-btn-primary'), 'Must showcase primary button');
    assert.ok(html.includes('dcss-btn-secondary'), 'Must showcase secondary button');
    assert.ok(html.includes('dcss-btn-danger'), 'Must showcase danger button');
    assert.ok(html.includes('dcss-btn-ghost'), 'Must showcase ghost button');
    assert.ok(html.includes('dcss-btn-outline'), 'Must showcase outline button');
    assert.ok(html.includes('dcss-btn-sm'), 'Must showcase small button size');
    assert.ok(html.includes('dcss-btn-lg'), 'Must showcase large button size');
    assert.ok(html.includes('id="btn-demo-loading"'), 'Must have interactive loading button demo');
  });

  await t.test('Cards section (#cards) renders standard, interactive and glassmorphism cards', () => {
    assert.ok(html.includes('id="cards"'), 'Must have section #cards');
    assert.ok(html.includes('dcss-card'), 'Must showcase dcss-card');
    assert.ok(html.includes('dcss-card-header'), 'Must showcase dcss-card-header');
    assert.ok(html.includes('dcss-card-body'), 'Must showcase dcss-card-body');
    assert.ok(html.includes('dcss-card-footer'), 'Must showcase dcss-card-footer');
    assert.ok(html.includes('dcss-card-interactive'), 'Must showcase interactive card variant');
    assert.ok(html.includes('dcss-card-glass'), 'Must showcase glassmorphism card variant');
  });

  await t.test('Forms section (#forms) renders inputs, addons, selects, switch, checkbox and validation states', () => {
    assert.ok(html.includes('id="forms"'), 'Must have section #forms');
    assert.ok(html.includes('dcss-input'), 'Must showcase input');
    assert.ok(html.includes('dcss-input-group'), 'Must showcase input group');
    assert.ok(html.includes('dcss-input-addon'), 'Must showcase input addon');
    assert.ok(html.includes('dcss-select'), 'Must showcase select dropdown');
    assert.ok(html.includes('dcss-textarea'), 'Must showcase textarea');
    assert.ok(html.includes('dcss-switch'), 'Must showcase animated switch');
    assert.ok(html.includes('dcss-switch-slider'), 'Must have switch slider');
    assert.ok(html.includes('dcss-checkbox'), 'Must showcase checkbox');
    assert.ok(html.includes('is-valid'), 'Must showcase is-valid state');
    assert.ok(html.includes('is-invalid'), 'Must showcase is-invalid state');
  });

  await t.test('Badges section (#badges) renders semantic, pill, outline and pulse dot badges', () => {
    assert.ok(html.includes('id="badges"'), 'Must have section #badges');
    assert.ok(html.includes('dcss-badge-primary'), 'Must showcase primary badge');
    assert.ok(html.includes('dcss-badge-success'), 'Must showcase success badge');
    assert.ok(html.includes('dcss-badge-pill'), 'Must showcase pill badge');
    assert.ok(html.includes('dcss-badge-outline'), 'Must showcase outline badge');
    assert.ok(html.includes('dcss-badge-dot'), 'Must showcase dot indicator badge');
    assert.ok(html.includes('dcss-badge-pulse'), 'Must showcase animated pulse badge');
  });

  await t.test('Tables section (#tables) renders responsive table with striped and hover modifiers', () => {
    assert.ok(html.includes('id="tables"'), 'Must have section #tables');
    assert.ok(html.includes('dcss-table-responsive'), 'Must showcase responsive container');
    assert.ok(html.includes('dcss-table'), 'Must showcase base table');
    assert.ok(html.includes('dcss-table-striped'), 'Must showcase striped rows');
    assert.ok(html.includes('dcss-table-hover'), 'Must showcase hover rows');
  });

  await t.test('Interactive section (#interactive) showcases toasts, modals, dropdown, tabs and drawer', () => {
    assert.ok(html.includes('id="interactive"'), 'Must have section #interactive');
    assert.ok(html.includes('id="toast-success-btn"'), 'Must have toast success button');
    assert.ok(html.includes('id="toast-danger-btn"'), 'Must have toast danger button');
    assert.ok(html.includes('data-dcss-modal-target'), 'Must have declarative modal button');
    assert.ok(html.includes('id="btn-modal-programmatic"'), 'Must have programmatic modal button');
    assert.ok(html.includes('dcss-dropdown'), 'Must have dropdown element');
    assert.ok(html.includes('dcss-tabs'), 'Must have tabs container');
    assert.ok(html.includes('dcss-tab-btn'), 'Must have tab buttons');
    assert.ok(html.includes('dcss-tab-pane'), 'Must have tab panes');
    assert.ok(html.includes('dcss-drawer'), 'Must have drawer');
  });
});

test('Hito 5: Verification of Copy Snippet Blocks and Interactive Script', async (t) => {
  const html = fs.readFileSync(showcaseHtmlPath, 'utf8');
  const js = fs.readFileSync(showcaseJsPath, 'utf8');

  await t.test('Showcase contains copy snippet buttons across all component sections', () => {
    const copyButtonsCount = (html.match(/btn-copy-snippet/g) || []).length;
    assert.ok(copyButtonsCount >= 7, `Expected at least 7 copy snippet buttons, found ${copyButtonsCount}`);
    assert.ok(html.includes('data-copy-target'), 'Copy buttons should specify target snippet');
  });

  await t.test('showcase/app.js handles copy snippet action with clipboard and toast feedback', () => {
    assert.ok(js.includes('navigator.clipboard') || js.includes('execCommand'), 'Must implement clipboard copy');
    assert.ok(js.includes('DCSS.toast') || js.includes('window.DCSS'), 'Must trigger toast notification on copy');
    assert.ok(js.includes('Snippet copiado'), 'Must inform user snippet was copied');
  });

  await t.test('showcase/app.js handles 1.5s loading button state alternation', () => {
    assert.ok(js.includes('dcss-btn-loading'), 'Must toggle dcss-btn-loading class');
    assert.ok(js.includes('setTimeout'), 'Must use setTimeout for async simulation');
    assert.ok(js.includes('1500'), 'Must simulate 1.5s duration');
  });

  await t.test('showcase/app.js handles programmatic modal creation', () => {
    assert.ok(js.includes('modal.create'), 'Must invoke DCSS.modal.create');
  });

  await t.test('showcase/app.js handles ⌘K / Ctrl+K shortcut, list filtering and item selection', () => {
    assert.ok(js.includes('k') && (js.includes('metaKey') || js.includes('ctrlKey')), 'app.js must handle ⌘K/Ctrl+K shortcut');
    assert.ok(js.includes('is-selected'), 'app.js must toggle .is-selected class on list items');
    assert.ok(js.includes('split-filter-input') || js.includes('filter'), 'app.js must handle list filtering');
  });
});

test('Hito 5: Verification of Comprehensive README.md Documentation', async (t) => {
  await t.test('README.md exists and is not empty', () => {
    assert.ok(fs.existsSync(readmePath), `README.md must exist at ${readmePath}`);
    const content = fs.readFileSync(readmePath, 'utf8').trim();
    assert.ok(content.length > 1000, 'README.md should be comprehensive and thorough');
  });

  const readme = fs.readFileSync(readmePath, 'utf8');

  await t.test('README.md details core philosophy (Zero-Overhead, Dark-First, Mobile-First)', () => {
    assert.match(readme, /Zero-Overhead/i, 'Must highlight Zero-Overhead philosophy');
    assert.match(readme, /Dark-First/i, 'Must highlight Dark-First philosophy');
    assert.match(readme, /Mobile-First/i, 'Must highlight Mobile-First philosophy');
  });

  await t.test('README.md details Raycast & Cobalt Tech visual identity', () => {
    assert.match(readme, /Raycast/i, 'Must highlight Raycast inspiration');
    assert.match(readme, /Cobalt\s*Tech|#3b82f6/i, 'Must document Cobalt Tech accent');
  });

  await t.test('README.md documents Raycast productivity components and snippets', () => {
    assert.ok(readme.includes('.dcss-kbd'), 'Must document .dcss-kbd');
    assert.ok(readme.includes('.dcss-list-item'), 'Must document .dcss-list-item');
    assert.ok(readme.includes('.dcss-command-bar'), 'Must document .dcss-command-bar');
    assert.ok(readme.includes('.dcss-action-bar'), 'Must document .dcss-action-bar');
    assert.ok(readme.includes('.dcss-split-view'), 'Must document .dcss-split-view');
  });

  await t.test('README.md includes Quickstart Option 1: Standalone / CDN', () => {
    assert.ok(readme.includes('Standalone') || readme.includes('CDN'), 'Must document Standalone / CDN integration');
    assert.ok(readme.includes('dcss.min.css'), 'Must reference dcss.min.css');
    assert.ok(readme.includes('dcss.min.js'), 'Must reference dcss.min.js');
  });

  await t.test('README.md includes Quickstart Option 2: NPM / ESM Module', () => {
    assert.ok(readme.includes('npm install') || readme.includes('ESM'), 'Must document NPM / ESM module usage');
    assert.match(readme, /import\s+.*from\s+['"]dcss-ui['"]/, 'Must provide ESM import example');
  });

  await t.test('README.md contains Component reference table with CSS classes', () => {
    assert.ok(readme.includes('.dcss-btn'), 'Must document .dcss-btn');
    assert.ok(readme.includes('.dcss-card'), 'Must document .dcss-card');
    assert.ok(readme.includes('.dcss-input'), 'Must document .dcss-input');
    assert.ok(readme.includes('.dcss-badge'), 'Must document .dcss-badge');
    assert.ok(readme.includes('.dcss-table'), 'Must document .dcss-table');
  });

  await t.test('README.md contains JavaScript API reference for all modules', () => {
    assert.ok(readme.includes('DCSS.theme') || readme.includes('theme.'), 'Must document theme API');
    assert.ok(readme.includes('DCSS.toast') || readme.includes('toast.'), 'Must document toast API');
    assert.ok(readme.includes('DCSS.modal') || readme.includes('modal.'), 'Must document modal API');
    assert.ok(readme.includes('DCSS.dropdown') || readme.includes('dropdown.'), 'Must document dropdown API');
    assert.ok(readme.includes('DCSS.tabs') || readme.includes('tabs.'), 'Must document tabs API');
    assert.ok(readme.includes('DCSS.drawer') || readme.includes('drawer.'), 'Must document drawer API');
  });

  await t.test('README.md contains CSS Tokens customization guide', () => {
    assert.ok(readme.includes('--dcss-primary'), 'Must document custom tokens like --dcss-primary');
    assert.ok(readme.includes(':root') || readme.includes('tokens.css'), 'Must explain overriding tokens');
  });
});

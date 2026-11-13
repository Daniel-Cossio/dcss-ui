import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cssFiles = {
  buttons: path.join(rootDir, 'src/css/buttons.css'),
  cards: path.join(rootDir, 'src/css/cards.css'),
  forms: path.join(rootDir, 'src/css/forms.css'),
  badges: path.join(rootDir, 'src/css/badges.css'),
  tables: path.join(rootDir, 'src/css/tables.css'),
  layout: path.join(rootDir, 'src/css/layout.css'),
  kbd: path.join(rootDir, 'src/css/kbd.css'),
  listItems: path.join(rootDir, 'src/css/list-items.css'),
  command: path.join(rootDir, 'src/css/command.css'),
  index: path.join(rootDir, 'src/css/index.css')
};

test('Hito 2: Verification of Component Files and Syntax', async (t) => {
  await t.test('All component CSS files exist and are not empty', () => {
    for (const [name, filePath] of Object.entries(cssFiles)) {
      assert.ok(fs.existsSync(filePath), `${name}.css must exist at ${filePath}`);
      const content = fs.readFileSync(filePath, 'utf8').trim();
      assert.ok(content.length > 0, `${name}.css should not be empty`);
    }
  });

  await t.test('All component CSS files have balanced braces and parentheses', () => {
    for (const [name, filePath] of Object.entries(cssFiles)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '');

      let braceCount = 0;
      let parenCount = 0;

      for (let i = 0; i < stripped.length; i++) {
        const char = stripped[i];
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        else if (char === '(') parenCount++;
        else if (char === ')') parenCount--;

        assert.ok(braceCount >= 0, `Unmatched closing brace in ${name}.css at index ${i}`);
        assert.ok(parenCount >= 0, `Unmatched closing paren in ${name}.css at index ${i}`);
      }

      assert.strictEqual(braceCount, 0, `Unclosed brace in ${name}.css`);
      assert.strictEqual(parenCount, 0, `Unclosed parenthesis in ${name}.css`);
    }
  });

  await t.test('index.css imports all component stylesheets in appropriate sequence', () => {
    const indexContent = fs.readFileSync(cssFiles.index, 'utf8');
    const expectedImports = [
      'tokens.css',
      'reset.css',
      'buttons.css',
      'cards.css',
      'forms.css',
      'badges.css',
      'tables.css',
      'layout.css',
      'kbd.css',
      'list-items.css',
      'command.css'
    ];

    let lastIndex = -1;
    for (const file of expectedImports) {
      const regex = new RegExp(`@import\\s+['"]\\./${file}['"];`);
      assert.match(indexContent, regex, `index.css must import ${file}`);
      const currentIndex = indexContent.indexOf(file);
      assert.ok(currentIndex > lastIndex, `${file} imported in correct order`);
      lastIndex = currentIndex;
    }
  });
});

test('Hito 2: Verification of Buttons (src/css/buttons.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.buttons, 'utf8');

  await t.test('Button base class and accessibility states', () => {
    assert.match(content, /\.dcss-btn\b/, '.dcss-btn base selector exists');
    assert.match(content, /\.dcss-btn:focus-visible\b/, ':focus-visible state defined');
    assert.match(content, /--dcss-border-focus/, 'Uses --dcss-border-focus variable');
    assert.match(content, /--dcss-shadow-glow/, 'Uses --dcss-shadow-glow variable');
  });

  await t.test('Button color variants', () => {
    const variants = [
      '.dcss-btn-primary',
      '.dcss-btn-secondary',
      '.dcss-btn-danger',
      '.dcss-btn-ghost',
      '.dcss-btn-outline'
    ];
    for (const v of variants) {
      assert.match(content, new RegExp(`\\${v}\\b`), `${v} variant must exist`);
    }
  });

  await t.test('Button size variants and icon button', () => {
    const sizes = ['.dcss-btn-sm', '.dcss-btn-md', '.dcss-btn-lg', '.dcss-btn-icon'];
    for (const s of sizes) {
      assert.match(content, new RegExp(`\\${s}\\b`), `${s} size variant must exist`);
    }
  });

  await t.test('Loading state and spinner animation', () => {
    assert.match(content, /\.dcss-btn-loading\b/, '.dcss-btn-loading must exist');
    assert.match(content, /\.dcss-spinner\b/, '.dcss-spinner must exist');
    assert.match(content, /@keyframes dcss-spin/, '@keyframes dcss-spin must be defined');
  });
});

test('Hito 2: Verification of Cards (src/css/cards.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.cards, 'utf8');

  await t.test('Card base and internal structure', () => {
    assert.match(content, /\.dcss-card\b/, '.dcss-card base selector exists');
    assert.match(content, /\.dcss-card-header\b/, '.dcss-card-header exists');
    assert.match(content, /\.dcss-card-body\b/, '.dcss-card-body exists');
    assert.match(content, /\.dcss-card-footer\b/, '.dcss-card-footer exists');
  });

  await t.test('Card interactive and glass variants', () => {
    assert.match(content, /\.dcss-card-interactive\b/, '.dcss-card-interactive exists');
    assert.match(content, /translateY\(-3px\)/, 'Interactive hover translateY effect');
    assert.match(content, /\.dcss-card-glass\b/, '.dcss-card-glass exists');
    assert.match(content, /backdrop-filter/, 'Glass card uses backdrop-filter');
    assert.match(content, /--dcss-glass-blur/, 'Glass card references --dcss-glass-blur');
  });
});

test('Hito 2: Verification of Forms (src/css/forms.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.forms, 'utf8');

  await t.test('Form groups, labels and base inputs', () => {
    assert.match(content, /\.dcss-form-group\b/, '.dcss-form-group exists');
    assert.match(content, /\.dcss-label\b/, '.dcss-label exists');
    assert.match(content, /\.dcss-input\b/, '.dcss-input exists');
    assert.match(content, /\.dcss-select\b/, '.dcss-select exists');
    assert.match(content, /\.dcss-textarea\b/, '.dcss-textarea exists');
  });

  await t.test('Validation states (.is-invalid and .is-valid)', () => {
    assert.match(content, /\.is-invalid\b/, '.is-invalid validation state exists');
    assert.match(content, /--dcss-danger/, 'is-invalid references --dcss-danger');
    assert.match(content, /\.is-valid\b/, '.is-valid validation state exists');
    assert.match(content, /--dcss-success/, 'is-valid references --dcss-success');
  });

  await t.test('Checkbox and switch toggle', () => {
    assert.match(content, /\.dcss-checkbox\b/, '.dcss-checkbox exists');
    assert.match(content, /\.dcss-switch\b/, '.dcss-switch exists');
    assert.match(content, /\.dcss-switch-slider\b/, '.dcss-switch-slider exists');
  });

  await t.test('Input group addon', () => {
    assert.match(content, /\.dcss-input-group\b/, '.dcss-input-group exists');
    assert.match(content, /\.dcss-input-addon\b/, '.dcss-input-addon exists');
  });
});

test('Hito 2: Verification of Badges (src/css/badges.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.badges, 'utf8');

  await t.test('Badge base class and semantic variants', () => {
    assert.match(content, /\.dcss-badge\b/, '.dcss-badge base exists');
    const semantics = [
      '.dcss-badge-primary',
      '.dcss-badge-success',
      '.dcss-badge-warning',
      '.dcss-badge-danger',
      '.dcss-badge-info',
      '.dcss-badge-neutral'
    ];
    for (const sem of semantics) {
      assert.match(content, new RegExp(`\\${sem}\\b`), `${sem} exists`);
    }
  });

  await t.test('Style variants: pill, outline, dot and pulse animation', () => {
    assert.match(content, /\.dcss-badge-pill\b/, '.dcss-badge-pill exists');
    assert.match(content, /\.dcss-badge-outline\b/, '.dcss-badge-outline exists');
    assert.match(content, /\.dcss-badge-dot\b/, '.dcss-badge-dot exists');
    assert.match(content, /@keyframes dcss-pulse/, '@keyframes dcss-pulse exists');
  });
});

test('Hito 2: Verification of Tables (src/css/tables.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.tables, 'utf8');

  await t.test('Table base and responsive container', () => {
    assert.match(content, /\.dcss-table\b/, '.dcss-table base exists');
    assert.match(content, /\.dcss-table-container\b/, '.dcss-table-container exists');
    assert.match(content, /overflow-x:\s*auto/, 'overflow-x: auto configured for responsive scrolling');
  });

  await t.test('Modifiers: striped, hover and sticky header', () => {
    assert.match(content, /\.dcss-table-striped\b/, '.dcss-table-striped modifier exists');
    assert.match(content, /\.dcss-table-hover\b/, '.dcss-table-hover modifier exists');
    assert.match(content, /\.dcss-table-sticky\b/, '.dcss-table-sticky modifier exists');
    assert.match(content, /position:\s*sticky/, 'Sticky header applies position sticky');
  });
});

test('Hito 2: Verification of Layout (src/css/layout.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.layout, 'utf8');

  await t.test('Container utility with responsive breakpoints', () => {
    assert.match(content, /\.dcss-container\b/, '.dcss-container exists');
    assert.match(content, /@media\s*\(min-width:\s*640px\)/, 'Breakpoint 640px defined');
    assert.match(content, /@media\s*\(min-width:\s*768px\)/, 'Breakpoint 768px defined');
    assert.match(content, /@media\s*\(min-width:\s*1024px\)/, 'Breakpoint 1024px defined');
  });

  await t.test('Grid system and column modifiers', () => {
    assert.match(content, /\.dcss-grid\b/, '.dcss-grid exists');
    assert.match(content, /\.dcss-grid-cols-2\b/, '.dcss-grid-cols-2 exists');
    assert.match(content, /\.dcss-grid-cols-3\b/, '.dcss-grid-cols-3 exists');
    assert.match(content, /\.dcss-grid-cols-4\b/, '.dcss-grid-cols-4 exists');
    assert.match(content, /\.dcss-grid-auto\b/, '.dcss-grid-auto exists');
  });

  await t.test('Flex and Stack utilities', () => {
    assert.match(content, /\.dcss-flex\b/, '.dcss-flex exists');
    assert.match(content, /\.dcss-stack\b/, '.dcss-stack exists');
    assert.match(content, /\.dcss-stack-sm\b/, '.dcss-stack-sm exists');
    assert.match(content, /\.dcss-stack-lg\b/, '.dcss-stack-lg exists');
  });
});

test('Hito 2: Verification of Keyboard Key (src/css/kbd.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.kbd, 'utf8');

  await t.test('.dcss-kbd base selector, physical 3D gradient, relief and typography', () => {
    assert.match(content, /\.dcss-kbd\b/, '.dcss-kbd base selector exists');
    assert.match(content, /linear-gradient\(to bottom,\s*#1e2025,\s*#141519\)/, 'Physical key vertical gradient defined');
    assert.match(content, /--dcss-border-highlight/, 'Uses --dcss-border-highlight');
    assert.match(content, /box-shadow:.*inset 0 1px 0 rgba\(255,\s*255,\s*255,\s*0\.1\)/, 'Top tactile inset highlight defined');
    assert.match(content, /box-shadow:.*0 2px 0 rgba\(0,\s*0,\s*0,\s*0\.45\)/, 'Bottom physical depth shadow defined');
    assert.match(content, /--dcss-font-mono/, 'Uses --dcss-font-mono');
    assert.match(content, /--dcss-radius-sm/, 'Uses --dcss-radius-sm');
  });

  await t.test('.dcss-kbd modifiers and key groups', () => {
    assert.match(content, /\.dcss-kbd-sm\b/, '.dcss-kbd-sm modifier exists');
    assert.match(content, /\.dcss-kbd-group\b/, '.dcss-kbd-group sequence wrapper exists');
  });
});

test('Hito 2: Verification of List Items (src/css/list-items.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.listItems, 'utf8');

  await t.test('List item base class and interactive states', () => {
    assert.match(content, /\.dcss-list-item\b/, '.dcss-list-item base selector exists');
    assert.match(content, /\.dcss-list-item:hover\b/, ':hover state defined');
    assert.match(content, /\.dcss-list-item\.is-selected\b/, '.is-selected state defined');
    assert.match(content, /--dcss-bg-hover/, 'References --dcss-bg-hover');
    assert.match(content, /--dcss-radius-md/, 'Uses --dcss-radius-md');
  });

  await t.test('List item internal structure and accessory slots', () => {
    assert.match(content, /\.dcss-list-item-icon\b/, '.dcss-list-item-icon exists');
    assert.match(content, /\.dcss-list-item-content\b/, '.dcss-list-item-content exists');
    assert.match(content, /\.dcss-list-item-title\b/, '.dcss-list-item-title exists');
    assert.match(content, /\.dcss-list-item-subtitle\b/, '.dcss-list-item-subtitle exists');
    assert.match(content, /\.dcss-list-item-accessories\b/, '.dcss-list-item-accessories exists');
    assert.match(content, /margin-left:\s*auto/, 'Accessories are right-aligned with margin-left: auto');
  });
});

test('Hito 2: Verification of Command Components (src/css/command.css)', async (t) => {
  const content = fs.readFileSync(cssFiles.command, 'utf8');

  await t.test('Command bar Spotlight-style search', () => {
    assert.match(content, /\.dcss-command-bar\b/, '.dcss-command-bar exists');
    assert.match(content, /\.dcss-command-bar-input\b/, '.dcss-command-bar-input exists');
    assert.match(content, /\.dcss-command-bar-icon\b/, '.dcss-command-bar-icon exists');
    assert.match(content, /\.dcss-command-bar-shortcut\b/, '.dcss-command-bar-shortcut exists');
  });

  await t.test('Action bar bottom quick actions', () => {
    assert.match(content, /\.dcss-action-bar\b/, '.dcss-action-bar exists');
    assert.match(content, /\.dcss-action-bar-group\b/, '.dcss-action-bar-group exists');
    assert.match(content, /\.dcss-action-item\b/, '.dcss-action-item exists');
  });

  await t.test('Split view master/detail dual-pane layout', () => {
    assert.match(content, /\.dcss-split-view\b/, '.dcss-split-view exists');
    assert.match(content, /\.dcss-split-view-master\b/, '.dcss-split-view-master exists');
    assert.match(content, /\.dcss-split-view-detail\b/, '.dcss-split-view-detail exists');
  });
});

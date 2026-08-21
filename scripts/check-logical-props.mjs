#!/usr/bin/env node
/**
 * check-logical-props - the RTL build gate.
 *
 * The site must mirror into Arabic for free. That only holds if every
 * directional value in the codebase is *logical* (`ps-` `pe-` `ms-` `me-`
 * `start-` `end-` `text-start` `text-end` `border-s-` `border-e-` `rounded-s-`
 * `rounded-e-`) rather than *physical* (`pl-` `pr-` `ml-` `mr-` `left-`
 * `right-` `text-left` `text-right` `border-l-` `border-r-` `rounded-l-`
 * `rounded-r-`).
 *
 * A code-review convention will not survive a deadline. A failing build will.
 * Retrofitting RTL costs 3–4× building it in, so this runs from commit 1.
 *
 * Escape hatch: any line containing the token rtl-ok inside a comment is
 * skipped. Reserve it for genuine exceptions - a `background-position` pair
 * under explicit `[dir=ltr]` / `[dir=rtl]` selectors is the usual one, because
 * CSS has no logical syntax for gradients or background positions.
 *
 * Usage: node scripts/check-logical-props.mjs [rootDir]
 * Exit 1 on any hit, printing file:line:col for each.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import process from 'node:process';

const ROOT = process.argv[2] ?? 'src';
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css'];
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'out', 'coverage']);
const ESCAPE_HATCH = 'rtl-ok';

/**
 * Every pattern uses a `(?<![\w-])` lookbehind rather than `\b`, so
 * `compl-`, `-ml-`, `copyright-notice` and `rounded-lg` do not false-positive
 * while `sm:pl-4` and `hover:-ml-2` still do.
 */
const RULES = [
  {
    id: 'padding/margin',
    fix: 'use ps- pe- ms- me-',
    re: /(?<![\w-])-?[pm][lr]-(?=[\w[(-])/g,
  },
  {
    id: 'inset',
    fix: 'use start- end-',
    re: /(?<![\w-])-?(?:left|right)-(?=[\w[(-])/g,
  },
  {
    id: 'text-align class',
    fix: 'use text-start / text-end',
    re: /(?<![\w-])text-(?:left|right)(?![\w-])/g,
  },
  {
    id: 'border side',
    fix: 'use border-s- border-e-',
    re: /(?<![\w-])border-[lr](?![a-z])/g,
  },
  {
    id: 'border radius side',
    fix: 'use rounded-s- rounded-e-',
    re: /(?<![\w-])rounded-[lr](?![a-z])/g,
  },
  // Physical CSS longhands - same defect class, and a .css file is exactly
  // where one gets hand-written.
  {
    id: 'physical CSS longhand',
    fix: 'use the -inline-start / -inline-end longhand',
    re: /(?<![\w-])(?:padding|margin|border|inset|scroll-padding|scroll-margin)-(?:left|right)(?![\w-])/g,
  },
  {
    id: 'physical corner radius',
    fix: 'use border-start-start-radius etc.',
    re: /(?<![\w-])border-(?:top|bottom)-(?:left|right)-radius(?![\w-])/g,
  },
  {
    id: 'text-align declaration',
    fix: 'use text-align: start / end',
    re: /text-align\s*:\s*(?:left|right)(?![\w-])/g,
  },
];

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...walk(full));
    } else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

function main() {
  try {
    if (!statSync(ROOT).isDirectory()) throw new Error('not a directory');
  } catch {
    console.log(`check-logical-props: "${ROOT}" not found - nothing to check.`);
    process.exit(0);
  }

  const files = walk(ROOT);
  /** @type {string[]} */
  const problems = [];

  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    const label = relative(process.cwd(), file).split(sep).join('/');

    lines.forEach((line, index) => {
      if (line.includes(ESCAPE_HATCH)) return;
      for (const rule of RULES) {
        rule.re.lastIndex = 0;
        let match;
        while ((match = rule.re.exec(line)) !== null) {
          problems.push(
            `${label}:${index + 1}:${match.index + 1}  ${match[0].trim()}` +
              `   [${rule.id}] → ${rule.fix}`,
          );
        }
      }
    });
  }

  if (problems.length > 0) {
    console.error('\nBANNED PHYSICAL-DIRECTION VALUES - the site will not mirror into Arabic.\n');
    for (const problem of problems) console.error(`  ${problem}`);
    console.error(
      `\n${problems.length} problem(s) in ${files.length} file(s).` +
        `\nUse logical properties, or add /* ${ESCAPE_HATCH} */ on the line if it is a genuine exception.\n`,
    );
    process.exit(1);
  }

  console.log(`check-logical-props: ${files.length} file(s) clean.`);
  process.exit(0);
}

main();

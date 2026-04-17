import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.ts',
  '.tsx',
]);

const ignoredDirectories = new Set([
  '.git',
  'dist',
  'node_modules',
  'output',
  'playwright-report',
  'test-results',
]);

const ignoredFiles = new Set([
  path.join(rootDir, 'tests', 'Dvj0MwMw.js'),
]);

const mojibakePatterns = [
  { label: 'replacement character', pattern: /\uFFFD/u },
  { label: 'UTF-8 accent read as Latin-1', pattern: /\u00C3[\u0080-\u00BF]/u },
  { label: 'emoji read as Latin-1', pattern: /\u00F0\u0178/u },
  { label: 'Windows punctuation read as UTF-8/Latin-1', pattern: /\u00E2[\u20AC\u2020\u201C\u201D\u2013\u2014\u2018\u2019]/u },
];

function collectTextFiles(entry) {
  const absolutePath = path.join(rootDir, entry);

  if (!existsSync(absolutePath)) {
    return [];
  }

  const stats = statSync(absolutePath);

  if (stats.isFile()) {
    if (ignoredFiles.has(absolutePath)) {
      return [];
    }

    return textExtensions.has(path.extname(absolutePath)) ? [absolutePath] : [];
  }

  return readdirSync(absolutePath).flatMap((child) => {
    if (ignoredDirectories.has(child)) {
      return [];
    }

    return collectTextFiles(path.join(entry, child));
  });
}

describe('source encoding', () => {
  it('does not contain common mojibake sequences', () => {
    const files = [
      ...collectTextFiles('src'),
      ...collectTextFiles('server'),
      ...collectTextFiles('tests'),
      ...collectTextFiles('README.md'),
    ];

    const findings = files.flatMap((file) => {
      const content = readFileSync(file, 'utf8');

      return mojibakePatterns
        .filter(({ pattern }) => pattern.test(content))
        .map(({ label }) => `${path.relative(rootDir, file)}: ${label}`);
    });

    expect(findings).toEqual([]);
  });
});

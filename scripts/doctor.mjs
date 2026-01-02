import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.vite',
  'coverage',
]);

const SCAN_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.cjs',
  '.mjs',
  '.json',
  '.md',
  '.yml',
  '.yaml',
]);

const CORRUPTION_PATTERNS = [
  { label: 'Injected HTML doctype', regex: /<!doctype\s+html/i },
  { label: 'Tool length limit error', regex: /QUERY LENGTH LIMIT EXCEEDED/i },
  { label: 'Terminal ANSI escape sequences', regex: /\u001b\[[0-9;]*m/ },
  { label: 'Vite build log injected', regex: /\bmodules transformed\b|\brendering chunks\b|\bgzip size computing\b|\btransforming \(\d+\)/i },
  { label: 'Accidental Copilot refusal string', regex: /Sorry, I can't assist with that\./i },
  { label: 'Bogus @slint/js import', regex: /from\s+['"]@slint\/js['"]/i },
];

/**
 * Recursively enumerate files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...walk(fullPath));
      continue;
    }
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!SCAN_EXTENSIONS.has(ext)) continue;
      out.push(fullPath);
    }
  }
  return out;
}

const targets = [
  path.join(projectRoot, 'src'),
  path.join(projectRoot, '.github'),
  path.join(projectRoot, 'scripts'),
  path.join(projectRoot, 'README.md'),
  path.join(projectRoot, 'CHANGELOG.md'),
  path.join(projectRoot, 'eslint.config.js'),
  path.join(projectRoot, 'vite.config.js'),
];

/** @type {string[]} */
const filesToScan = [];

for (const t of targets) {
  if (!fs.existsSync(t)) continue;
  const stat = fs.statSync(t);
  if (stat.isDirectory()) {
    filesToScan.push(...walk(t));
  } else if (stat.isFile()) {
    filesToScan.push(t);
  }
}

const normalizedSelf = path.normalize(path.join(projectRoot, 'scripts', 'doctor.mjs'));
const filteredFilesToScan = filesToScan.filter((p) => path.normalize(p) !== normalizedSelf);

/** @type {{file:string, label:string}[]} */
const findings = [];

for (const filePath of filteredFilesToScan) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    continue;
  }

  for (const p of CORRUPTION_PATTERNS) {
    if (p.regex.test(content)) {
      findings.push({ file: path.relative(projectRoot, filePath), label: p.label });
    }
  }
}

if (findings.length) {
  console.error('doctor: Se detectaron posibles signos de corrupción:');
  for (const f of findings) {
    console.error(`- ${f.file} (${f.label})`);
  }
  process.exit(1);
}

console.log('doctor: OK (sin patrones típicos de corrupción)');

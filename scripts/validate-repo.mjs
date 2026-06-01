import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const errors = [];
const warnings = [];

const requiredFiles = [
  ".github/workflows/validate.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/secret-scan.yml",
  ".specify/memory/constitution.md",
  ".specify/templates/spec-template.md",
  "AGENTS.md",
  "ARCHITECTURE.md",
  "README.md",
  "SECURITY.md",
  "docs/desktop/windows-setup.md",
  "docs/adr/001-language-and-runtime-strategy.md",
  "eslint.config.mjs",
  "index.html",
  "package.json",
  "scripts/check-desktop-prereqs.mjs",
  "scripts/validate-repo.mjs",
  "src/app/runtime/useDesktopRuntimeInfo.ts",
  "src/app/styles/app.css",
  "src/domain/ring/model/persistence.ts",
  "src/domain/ring/model/ring-state.ts",
  "src/domain/ring/model/scoring.test.ts",
  "src/domain/ring/model/scoring.ts",
  "src/pages/ring-control/model/useRingControl.ts",
  "src/pages/ring-control/ui/RingControlPage.tsx",
  "src/App.tsx",
  "src/main.tsx",
  "src-tauri/Cargo.toml",
  "src-tauri/build.rs",
  "src-tauri/tauri.conf.json",
  "src-tauri/capabilities/default.json",
  "src-tauri/src/lib.rs",
  "src-tauri/src/main.rs",
  "tsconfig.json",
  "vite.config.ts",
  "vitest.config.ts",
  "specs/001-ring-scoring-foundation/spec.md",
  "specs/001-ring-scoring-foundation/plan.md",
  "specs/001-ring-scoring-foundation/tasks.md",
  "specs/001-ring-scoring-foundation/checklists/requirements.md",
  "specs/002-desktop-shell-foundation/spec.md",
  "specs/002-desktop-shell-foundation/plan.md",
  "specs/002-desktop-shell-foundation/research.md",
  "specs/002-desktop-shell-foundation/data-model.md",
  "specs/002-desktop-shell-foundation/quickstart.md",
  "specs/002-desktop-shell-foundation/contracts/desktop-shell-contract.md",
  "specs/002-desktop-shell-foundation/tasks.md",
  "specs/002-desktop-shell-foundation/checklists/requirements.md"
];

const textExtensions = new Set([
  ".css",
  ".json",
  ".js",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".yml",
  ".yaml"
]);

const secretPatterns = [
  {
    label: "Possible private key",
    regex: /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/
  },
  {
    label: "Possible GitHub token",
    regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/
  },
  {
    label: "Possible GitHub fine-grained token",
    regex: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/
  },
  {
    label: "Possible OpenAI-style key",
    regex: /\bsk-[A-Za-z0-9]{20,}\b/
  },
  {
    label: "Possible Google API key",
    regex: /\bAIza[0-9A-Za-z\-_]{35}\b/
  },
  {
    label: "Possible hardcoded credential assignment",
    regex: /\b(?:password|passwd|pwd|secret|api[_-]?key|token)\b\s*[:=]\s*["'`][^"'`\n]{8,}["'`]/
  }
];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function ensureFile(filePath) {
  if (!existsSync(path.join(rootDir, filePath))) {
    addError(`Missing required file: ${filePath}`);
  }
}

function walk(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.name === ".git" ||
      entry.name === "dist" ||
      entry.name === "node_modules"
    ) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    inspectTextFile(fullPath);
  }
}

function inspectTextFile(fullPath) {
  const fileName = path.basename(fullPath);
  const ext = path.extname(fullPath).toLowerCase();
  const relPath = path.relative(rootDir, fullPath).replace(/\\/g, "/");

  if (fileName === ".env" || fileName.startsWith(".env.")) {
    addError(`Environment file should not be committed: ${relPath}`);
    return;
  }

  if (!textExtensions.has(ext) && fileName !== ".gitignore") {
    return;
  }

  const content = readFileSync(fullPath, "utf8");

  for (const pattern of secretPatterns) {
    if (pattern.regex.test(content)) {
      addError(`${pattern.label} found in ${relPath}`);
    }
  }

  if (content.includes("\t")) {
    addWarning(`Tab characters found in ${relPath}. Prefer spaces for consistency.`);
  }
}

function validatePackageScripts() {
  const packageJson = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8"));
  const requiredScripts = [
    "build",
    "desktop:build",
    "desktop:dev",
    "desktop:doctor",
    "lint",
    "test",
    "typecheck",
    "validate"
  ];

  for (const scriptName of requiredScripts) {
    if (!packageJson.scripts?.[scriptName]) {
      addError(`package.json is missing required script: ${scriptName}`);
    }
  }
}

function validateBuildOutput() {
  const distFiles = ["dist/index.html", "dist/assets"];

  for (const target of distFiles) {
    if (!existsSync(path.join(rootDir, target))) {
      addError(`Missing build output: ${target}`);
    }
  }
}

function validateTrackedFiles() {
  try {
    const tracked = execFileSync("git", ["ls-files"], {
      cwd: rootDir,
      encoding: "utf8"
    })
      .split(/\r?\n/)
      .filter(Boolean);

    for (const file of tracked) {
      const basename = path.basename(file);
      if (basename === ".env" || basename.startsWith(".env.")) {
        addError(`Tracked environment file detected: ${file}`);
      }
    }
  } catch (error) {
    addWarning(`Unable to inspect tracked files with git: ${error.message}`);
  }
}

function validateFileSizes() {
  for (const filePath of [
    "README.md",
    "src/App.tsx",
    "src/domain/ring/model/scoring.ts",
    "src/pages/ring-control/ui/RingControlPage.tsx"
  ]) {
    const absolutePath = path.join(rootDir, filePath);
    const stats = statSync(absolutePath);

    if (stats.size === 0) {
      addError(`File is empty: ${filePath}`);
    }
  }
}

for (const file of requiredFiles) {
  ensureFile(file);
}

walk(rootDir);
validatePackageScripts();
validateBuildOutput();
validateTrackedFiles();
validateFileSizes();

if (warnings.length > 0) {
  console.warn("Warnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Repository validation passed.");

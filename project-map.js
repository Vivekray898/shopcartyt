import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "project-map.md");

const IGNORE = new Set([
  // Dependencies
  "node_modules",

  // Git
  ".git",

  // IDE
  ".vscode",
  ".idea",

  // Framework caches & build
  ".astro",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".vite",
  ".vercel",
  ".netlify",

  // Build output
  "dist",
  "build",
  "out",
  ".next", // Next.js build output

  // Coverage & cache
  "coverage",
  ".cache",
  "tmp", // Temporary files
  ".clerk", // Clerk temporary files

  // Logs
  "logs",
  "*.log",

  // Package manager locks (optional - remove if you want to track these)
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",

  // Environment files (optional - remove if you want to track these)
  ".env.local",
  ".env.development",
  ".env.production",

  // Generated files
  "project-map.md",
  "project-map.js",
  "project-map.cjs",
  "PROJECT_MAP.md", // Your current output

  // Misc
  ".DS_Store",
  "*.tar.gz",
  "*.zip",

  // Sanity generated
  "sanity.types.ts", // Generated types
  "schema.json", // Generated schema

  // Images (optional - uncomment if you want to ignore all images)
  // "images",
  // "*.png",
  // "*.jpg",
  // "*.jpeg",
  // "*.webp",
  // "*.gif",
  // "*.svg",
]);

// Additional patterns to match (these will be checked against full paths)
const IGNORE_PATHS = [
  /\/\.next\//,
  /\/tmp\//,
  /\/\.clerk\//,
  /\/logs\//,
  /\/cache\//,
  /\/coverage\//,
  /\/\.vercel\//,
  /\/\.netlify\//,
];

let totalFiles = 0;
let totalFolders = 0;

function shouldIgnore(itemPath) {
  const name = path.basename(itemPath);
  
  // Check exact name matches
  if (IGNORE.has(name)) return true;
  
  // Check path patterns
  for (const pattern of IGNORE_PATHS) {
    if (pattern.test(itemPath)) return true;
  }
  
  return false;
}

function generateTree(dir, prefix = "") {
  try {
    const items = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(item => {
        const fullPath = path.join(dir, item.name);
        return !shouldIgnore(fullPath);
      })
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });

    let tree = "";

    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const connector = isLast ? "└── " : "├── ";

      tree += `${prefix}${connector}${item.name}\n`;

      if (item.isDirectory()) {
        totalFolders++;
        tree += generateTree(
          path.join(dir, item.name),
          prefix + (isLast ? "    " : "│   ")
        );
      } else {
        totalFiles++;
      }
    });

    return tree;
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
    return `[Error: Could not read directory]\n`;
  }
}

function getFolderSize(dir) {
  let size = 0;

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (shouldIgnore(fullPath)) continue;

      if (item.isDirectory()) {
        size += getFolderSize(fullPath);
      } else {
        size += fs.statSync(fullPath).size;
      }
    }
  } catch (error) {
    console.error(`Error calculating size for ${dir}:`, error.message);
  }

  return size;
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${units[i]}`;
}

console.log("Generating project map...");
console.log("Root directory:", ROOT);

const size = getFolderSize(ROOT);

const markdown = `# Astro Project Map

Generated: ${new Date().toLocaleString()}

## Statistics

- **Folders:** ${totalFolders}
- **Files:** ${totalFiles}
- **Size:** ${formatBytes(size)}

---

## Folder Structure

\`\`\`
${path.basename(ROOT)}
${generateTree(ROOT)}
\`\`\`
`;

fs.writeFileSync(OUTPUT, markdown);

console.log(`✅ Created ${OUTPUT}`);
console.log(`📁 ${totalFolders} folders`);
console.log(`📄 ${totalFiles} files`);
console.log(`💾 ${formatBytes(size)}`);
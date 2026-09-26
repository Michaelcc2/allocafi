import { copyFile, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const outDir = resolve(root, "www");
const files = [
  "index.html",
  "styles.css",
  "app.js",
  "mobile-runtime.js",
  "enterprise-dashboard-core.js",
  "family-treasury-core.js",
  "allocafi-pay-core.js",
  "ledgercore-core.js",
  "ledgercore-ui.js",
  "ledgercore-types.d.ts",
];
await mkdir(outDir, { recursive: true });
await mkdir(resolve(outDir, "assets"), { recursive: true });

async function copyAssetDir(dir) {
  const sourceDir = resolve(root, "assets", dir);
  const targetDir = resolve(outDir, "assets", dir);
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const child = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return copyAssetDir(child);
    if (!entry.isFile()) return null;
    return copyFile(resolve(sourceDir, entry.name), resolve(targetDir, entry.name));
  }));
}

await Promise.all([
  ...files.map((file) => copyFile(resolve(root, file), resolve(outDir, file))),
  copyAssetDir(""),
]);

console.log("Copied AllocaFi web app to www");

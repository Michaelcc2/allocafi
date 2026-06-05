import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const outDir = resolve(root, "www");
const files = ["index.html", "styles.css", "app.js"];

await mkdir(outDir, { recursive: true });

await Promise.all(files.map((file) => copyFile(resolve(root, file), resolve(outDir, file))));

console.log("Copied AllocaFi web app to www");

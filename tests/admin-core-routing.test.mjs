import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, index, styles] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
]);

assert.doesNotMatch(index, /id="openAllocafiAi"/, "user-facing AllocaFi AI should not remain in the top toolbar");
assert.match(app, /ai:\s*\["AllocaFi AI",\s*"Future premium AI project parked in Settings"\]/, "AllocaFi AI should be parked as a Settings future project");
assert.match(app, /if \(tabName === "ai"\)[\s\S]*?future premium project/, "user AI launcher should stay in Settings instead of opening a product route");
assert.match(app, /Admin Core \+ Admin AI/, "Settings/admin launcher should expose Admin Core plus Admin AI");
assert.match(app, /<h2>AllocaFi Admin<\/h2>/, "admin route should be restored as AllocaFi Admin");
assert.match(app, /id="toggleAdminPower"/, "Admin Core must include a working Admin Power toggle");
assert.match(app, /updateAdminControl\("adminPowerEnabled"/, "Admin Power toggle should call updateAdminControl");
assert.match(app, /id="togglePayModule"/, "Admin Core should retain Pay module visibility control");
assert.match(app, /<span>Admin AI<\/span>/, "Admin AI section should remain visible");
assert.match(styles, /future-system-card/, "future AI launcher should have parked/future styling");
assert.match(styles, /admin-core-grid/, "Admin Core layout styles should exist");

console.log("Admin Core routing checks passed");

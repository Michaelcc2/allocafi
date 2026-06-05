import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles, schema, seed, server] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("../database/schema.sql", import.meta.url), "utf8"),
  readFile(new URL("../database/seeds/budget_templates.sql", import.meta.url), "utf8"),
  readFile(new URL("../server.js", import.meta.url), "utf8"),
]);

const requiredTemplates = [
  "Essential Budget",
  "Financial Growth",
  "Wealth Builder Pro",
  "Debt Elimination",
  "Family Essentials",
  "Single Parent Plan",
  "Family Legacy",
  "Owner Operator",
  "Small Business",
  "Freelancer",
  "Stablecoin Income",
  "Crypto Investor",
  "Bitcoin Standard",
  "Lifestyle Budget",
  "Travel Life",
  "Luxury Lifestyle",
  "Vacation Planner",
  "Planning / Irregular Budget",
  "Gamer Mode",
  "Creator Mode",
  "Side Hustle",
  "AI Smart Budget",
  "FIRE Plan",
  "Millionaire Blueprint",
  "Custom Build",
];

for (const template of requiredTemplates) {
  assert.ok(app.includes(template), `app should include ${template}`);
  assert.ok(seed.includes(template), `seed should include ${template}`);
}

for (const field of [
  "id text primary key",
  "name text not null",
  "category text not null",
  "description text not null",
  "is_premium boolean not null",
  "is_ai_template boolean not null",
  "account_count int not null",
  "accounts_json jsonb not null",
  "created_at timestamptz not null",
  "updated_at timestamptz not null",
]) {
  assert.ok(schema.includes(field), `budget_templates schema should include ${field}`);
}

assert.match(app, /Budget Template Library/, "auto allocation modal should use the new Budget Template Library title");
assert.match(app, /budgetTemplateSearch/, "template browser should include search");
assert.match(app, /BUDGET_TEMPLATE_CATEGORIES/, "template browser should include category tabs");
assert.match(app, /BUDGET_TEMPLATE_VISUALS/, "template browser should use approved visual metadata");
assert.match(app, /budget-template-art/, "template browser should reference approved template artwork assets");
assert.match(app, /budget-template-marketplace-grid/, "template browser should render the approved marketplace layout");
assert.match(app, /renderBudgetTemplateDonut/, "template browser should include allocation donut previews");
assert.match(app, /renderBudgetTemplateBreakdown/, "template browser should include percentage breakdown rows");
assert.match(app, /premium-template-locked/, "premium template lock badge should exist");
assert.match(app, /ai-template-badge/, "AI template badge should exist");
assert.match(app, /templateKey === "customBuild"[\s\S]*?openAllocationDialog\(walletId\)/, "Custom Build should route into the custom account builder");
assert.match(app, /validateBudgetTemplatePercentages/, "template percent validation should exist");
assert.match(app, /window\.confirm/, "applying a new template over existing VBAs should require confirmation");
assert.match(styles, /budget-template-library-modal[\s\S]*?overflow-x:\s*hidden/, "template modal should prevent horizontal scrolling");
assert.match(styles, /budget-template-category-tabs[\s\S]*?flex-wrap:\s*wrap/, "category tabs should wrap instead of scrolling horizontally");
assert.match(styles, /budget-template-list[\s\S]*?grid-template-columns:\s*1fr/, "template rows should stack vertically");
assert.match(styles, /template-allocation-donut[\s\S]*?conic-gradient/, "template cards should include fintech allocation donuts");
assert.match(styles, /budget-template-picture img[\s\S]*?object-fit:\s*cover/, "template artwork should be image-based");
assert.match(server, /"\.png":\s*"image\/png"/, "local server should serve template artwork as PNG images");

const seededAccountJson = [...seed.matchAll(/'(\[[\s\S]*?\])'::jsonb/g)].map((match) => JSON.parse(match[1]));
assert.equal(seededAccountJson.length, requiredTemplates.length, "seed should include every template account list");

for (const accounts of seededAccountJson) {
  const total = accounts.reduce((sum, account) => sum + Number(account.suggested_percentage || 0), 0);
  assert.equal(total, 100, `template percentages should total 100, got ${total}`);
  for (const account of accounts) {
    assert.ok(account.name, "each seeded account should have a name");
    assert.ok(account.icon, `${account.name} should have an icon`);
    assert.ok(account.color, `${account.name} should have a color`);
    assert.ok(account.description, `${account.name} should have a description`);
  }
}

console.log("Budget Template Library checks passed");

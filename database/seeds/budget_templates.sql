insert into public.budget_templates (
  id,
  name,
  category,
  description,
  is_premium,
  is_ai_template,
  account_count,
  accounts_json,
  created_at,
  updated_at
) values
('essentials','Essential Budget','Professional','Core everyday budgeting for bills, food, savings, and emergency reserves.',false,false,6,'[
  {"name":"Bills","suggested_percentage":35,"icon":"home","color":"#6b5cff","description":"Monthly obligations and household services."},
  {"name":"Food","suggested_percentage":15,"icon":"utensils","color":"#ff7a32","description":"Groceries and everyday meals."},
  {"name":"Gas","suggested_percentage":10,"icon":"car","color":"#22c7ff","description":"Fuel, transit, and basic transportation."},
  {"name":"Savings","suggested_percentage":15,"icon":"piggy-bank","color":"#37d67a","description":"Short-term savings and planned reserves."},
  {"name":"Emergency Reserve","suggested_percentage":15,"icon":"shield","color":"#44e68a","description":"Cash buffer for urgent surprises."},
  {"name":"Investments","suggested_percentage":10,"icon":"chart","color":"#b05cff","description":"Long-term growth contribution."}
]'::jsonb, now(), now()),
('growth','Financial Growth','Professional','A stronger savings and investing split for building momentum.',false,false,6,'[
  {"name":"Bills","suggested_percentage":30,"icon":"home","color":"#6b5cff","description":"Recurring household obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Transportation","suggested_percentage":8,"icon":"car","color":"#22c7ff","description":"Fuel, transit, maintenance, and mobility."},
  {"name":"Emergency Reserve","suggested_percentage":15,"icon":"shield","color":"#44e68a","description":"Protected cash buffer."},
  {"name":"Investments","suggested_percentage":25,"icon":"chart","color":"#b05cff","description":"Long-term investing priority."},
  {"name":"Long-Term Savings","suggested_percentage":10,"icon":"vault","color":"#20f0d0","description":"Savings for larger goals."}
]'::jsonb, now(), now()),
('wealthBuilder','Wealth Builder Pro','Professional','Premium plan for aggressive wealth and reserve building.',true,false,8,'[
  {"name":"Bills","suggested_percentage":25,"icon":"home","color":"#6b5cff","description":"Core required expenses."},
  {"name":"Food","suggested_percentage":10,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Transportation","suggested_percentage":7,"icon":"car","color":"#22c7ff","description":"Mobility and vehicle needs."},
  {"name":"Emergency Reserve","suggested_percentage":12,"icon":"shield","color":"#44e68a","description":"Emergency protection."},
  {"name":"Investments","suggested_percentage":28,"icon":"chart","color":"#b05cff","description":"Primary wealth-building account."},
  {"name":"Tax Reserve","suggested_percentage":8,"icon":"receipt","color":"#37d4ff","description":"Tax planning reserve."},
  {"name":"Opportunity Fund","suggested_percentage":5,"icon":"spark","color":"#ff3faf","description":"Future deals and opportunities."},
  {"name":"Giving","suggested_percentage":5,"icon":"heart","color":"#ff6b99","description":"Giving and community support."}
]'::jsonb, now(), now()),
('debtElimination','Debt Elimination','Professional','Focused payoff structure with protected basics.',false,false,6,'[
  {"name":"Bills","suggested_percentage":40,"icon":"home","color":"#6b5cff","description":"Required monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Transportation","suggested_percentage":8,"icon":"car","color":"#22c7ff","description":"Fuel and transportation."},
  {"name":"Debt Payoff","suggested_percentage":25,"icon":"receipt","color":"#ff3faf","description":"Extra principal and payoff focus."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Minimum protection while paying debt."},
  {"name":"Personal","suggested_percentage":5,"icon":"user","color":"#20f0d0","description":"Controlled personal spending."}
]'::jsonb, now(), now()),
('familyEssentials','Family Essentials','Family','Household-first budget for dependents and shared needs.',false,false,7,'[
  {"name":"Housing","suggested_percentage":30,"icon":"home","color":"#6b5cff","description":"Rent, mortgage, and home costs."},
  {"name":"Groceries","suggested_percentage":18,"icon":"cart","color":"#ff7a32","description":"Family food and household goods."},
  {"name":"Transportation","suggested_percentage":10,"icon":"car","color":"#22c7ff","description":"Family vehicle and transit costs."},
  {"name":"Child Expenses","suggested_percentage":12,"icon":"family","color":"#ff6b99","description":"Childcare, school, clothing, and supplies."},
  {"name":"Insurance","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Coverage and protection."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"vault","color":"#20f0d0","description":"Family emergency buffer."},
  {"name":"Family Fun","suggested_percentage":10,"icon":"spark","color":"#b05cff","description":"Activities and memories."}
]'::jsonb, now(), now()),
('singleParent','Single Parent Plan','Family','Practical family plan with extra protection and child expense focus.',false,false,7,'[
  {"name":"Housing","suggested_percentage":34,"icon":"home","color":"#6b5cff","description":"Housing and home services."},
  {"name":"Groceries","suggested_percentage":17,"icon":"cart","color":"#ff7a32","description":"Food and essentials."},
  {"name":"Transportation","suggested_percentage":10,"icon":"car","color":"#22c7ff","description":"Vehicle, transit, and mobility."},
  {"name":"Child Expenses","suggested_percentage":15,"icon":"family","color":"#ff6b99","description":"Childcare, school, and supplies."},
  {"name":"Emergency Reserve","suggested_percentage":12,"icon":"shield","color":"#44e68a","description":"Protection for family surprises."},
  {"name":"Personal","suggested_percentage":6,"icon":"user","color":"#20f0d0","description":"Personal care and flexibility."},
  {"name":"Family Fun","suggested_percentage":6,"icon":"spark","color":"#b05cff","description":"Family experiences."}
]'::jsonb, now(), now()),
('familyLegacy','Family Legacy','Family','Premium family plan for education, investing, and experiences.',true,false,7,'[
  {"name":"Housing","suggested_percentage":25,"icon":"home","color":"#6b5cff","description":"Home and household obligations."},
  {"name":"Groceries","suggested_percentage":12,"icon":"cart","color":"#ff7a32","description":"Food and essentials."},
  {"name":"Education","suggested_percentage":18,"icon":"book","color":"#37d4ff","description":"Tuition, learning, and skill building."},
  {"name":"Investments","suggested_percentage":18,"icon":"chart","color":"#b05cff","description":"Long-term family wealth."},
  {"name":"Emergency Reserve","suggested_percentage":12,"icon":"shield","color":"#44e68a","description":"Family protection reserve."},
  {"name":"Giving","suggested_percentage":5,"icon":"heart","color":"#ff6b99","description":"Giving and legacy values."},
  {"name":"Family Experiences","suggested_percentage":10,"icon":"spark","color":"#20f0d0","description":"Trips and shared memories."}
]'::jsonb, now(), now()),
('ownerOperator','Owner Operator','Business','Designed for trucking and vehicle-based operators.',false,false,6,'[
  {"name":"Fuel","suggested_percentage":30,"icon":"gas","color":"#ff7a32","description":"Fuel and route costs."},
  {"name":"Maintenance","suggested_percentage":15,"icon":"tools","color":"#37d4ff","description":"Repairs and service reserve."},
  {"name":"Insurance","suggested_percentage":12,"icon":"shield","color":"#44e68a","description":"Commercial protection."},
  {"name":"Taxes","suggested_percentage":15,"icon":"receipt","color":"#b05cff","description":"Estimated tax reserve."},
  {"name":"Driver Pay","suggested_percentage":18,"icon":"user","color":"#20f0d0","description":"Owner pay and operator income."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"vault","color":"#ff3faf","description":"Breakdown and downtime buffer."}
]'::jsonb, now(), now()),
('smallBusiness','Small Business','Business','Simple operating budget for small business owners.',false,false,7,'[
  {"name":"Operating Expenses","suggested_percentage":25,"icon":"briefcase","color":"#6b5cff","description":"Core business overhead."},
  {"name":"Payroll","suggested_percentage":25,"icon":"users","color":"#20f0d0","description":"Staff and contractor pay."},
  {"name":"Taxes","suggested_percentage":15,"icon":"receipt","color":"#b05cff","description":"Tax reserve."},
  {"name":"Marketing","suggested_percentage":10,"icon":"megaphone","color":"#ff3faf","description":"Growth and promotion."},
  {"name":"Software","suggested_percentage":8,"icon":"monitor","color":"#37d4ff","description":"Tools and subscriptions."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Business protection."},
  {"name":"Profit","suggested_percentage":7,"icon":"chart","color":"#ff7a32","description":"Owner profit and retained earnings."}
]'::jsonb, now(), now()),
('freelancer','Freelancer','Business','Income smoothing and tax reserve plan for solo workers.',false,false,7,'[
  {"name":"Taxes","suggested_percentage":25,"icon":"receipt","color":"#b05cff","description":"Self-employment tax reserve."},
  {"name":"Bills","suggested_percentage":25,"icon":"home","color":"#6b5cff","description":"Personal required expenses."},
  {"name":"Equipment","suggested_percentage":10,"icon":"monitor","color":"#37d4ff","description":"Hardware and creative tools."},
  {"name":"Marketing","suggested_percentage":10,"icon":"megaphone","color":"#ff3faf","description":"Client acquisition."},
  {"name":"Savings","suggested_percentage":15,"icon":"vault","color":"#44e68a","description":"Income smoothing reserve."},
  {"name":"Personal","suggested_percentage":10,"icon":"user","color":"#20f0d0","description":"Personal spending."},
  {"name":"Education","suggested_percentage":5,"icon":"book","color":"#ff7a32","description":"Courses and skills."}
]'::jsonb, now(), now()),
('stablecoinIncome','Stablecoin Income','Crypto','Stablecoin-first budget for crypto income routing.',false,false,6,'[
  {"name":"Bills","suggested_percentage":35,"icon":"home","color":"#6b5cff","description":"Required monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Gas","suggested_percentage":8,"icon":"car","color":"#22c7ff","description":"Fuel and transportation."},
  {"name":"Stablecoin Reserve","suggested_percentage":20,"icon":"stablecoin","color":"#20f0d0","description":"USDC and stable reserve."},
  {"name":"Emergency Reserve","suggested_percentage":15,"icon":"shield","color":"#44e68a","description":"Emergency liquidity."},
  {"name":"Investments","suggested_percentage":10,"icon":"chart","color":"#b05cff","description":"Growth contribution."}
]'::jsonb, now(), now()),
('cryptoInvestor','Crypto Investor','Crypto','Reserve asset allocation with everyday spending protected.',true,false,7,'[
  {"name":"Bills","suggested_percentage":25,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Emergency Reserve","suggested_percentage":15,"icon":"shield","color":"#44e68a","description":"Risk control buffer."},
  {"name":"Bitcoin Reserve","suggested_percentage":20,"icon":"bitcoin","color":"#f7931a","description":"BTC accumulation."},
  {"name":"Solana Reserve","suggested_percentage":12,"icon":"solana","color":"#14f195","description":"SOL reserve."},
  {"name":"Ethereum Reserve","suggested_percentage":12,"icon":"ethereum","color":"#627eea","description":"ETH reserve."},
  {"name":"Stablecoin Reserve","suggested_percentage":10,"icon":"stablecoin","color":"#20f0d0","description":"Stable liquidity."},
  {"name":"Opportunity Fund","suggested_percentage":6,"icon":"spark","color":"#ff3faf","description":"Future buys and dips."}
]'::jsonb, now(), now()),
('bitcoinStandard','Bitcoin Standard','Crypto','Simple Bitcoin reserve plan with practical living categories.',false,false,6,'[
  {"name":"Bills","suggested_percentage":30,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Gas","suggested_percentage":8,"icon":"car","color":"#22c7ff","description":"Fuel and transit."},
  {"name":"Bitcoin Reserve","suggested_percentage":30,"icon":"bitcoin","color":"#f7931a","description":"BTC reserve account."},
  {"name":"Emergency Reserve","suggested_percentage":15,"icon":"shield","color":"#44e68a","description":"Emergency liquidity."},
  {"name":"Personal","suggested_percentage":5,"icon":"user","color":"#20f0d0","description":"Personal spending."}
]'::jsonb, now(), now()),
('lifestyle','Lifestyle Budget','Lifestyle','Balanced lifestyle budget for goals, fun, and everyday expenses.',false,false,8,'[
  {"name":"Eating Out","suggested_percentage":18,"icon":"utensils","color":"#ff7a32","description":"Restaurants and social meals."},
  {"name":"Entertainment","suggested_percentage":14,"icon":"spark","color":"#ff3faf","description":"Events, subscriptions, and fun."},
  {"name":"Clothes","suggested_percentage":12,"icon":"shirt","color":"#b05cff","description":"Apparel and personal style."},
  {"name":"Grooming","suggested_percentage":8,"icon":"user","color":"#20f0d0","description":"Hair, beauty, and care."},
  {"name":"Fitness","suggested_percentage":13,"icon":"pulse","color":"#44e68a","description":"Gym, health, and wellness."},
  {"name":"Gifts","suggested_percentage":10,"icon":"gift","color":"#37d4ff","description":"Birthdays and giving."},
  {"name":"Hobbies","suggested_percentage":15,"icon":"game","color":"#6b5cff","description":"Creative and personal interests."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Lifestyle safety buffer."}
]'::jsonb, now(), now()),
('travelLife','Travel Life','Lifestyle','Travel-focused plan with everyday obligations still protected.',false,false,6,'[
  {"name":"Bills","suggested_percentage":28,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Transportation","suggested_percentage":10,"icon":"car","color":"#22c7ff","description":"Mobility and local travel."},
  {"name":"Travel Fund","suggested_percentage":28,"icon":"plane","color":"#37d4ff","description":"Trips, flights, and lodging."},
  {"name":"Emergency Reserve","suggested_percentage":12,"icon":"shield","color":"#44e68a","description":"Travel and life buffer."},
  {"name":"Experiences","suggested_percentage":10,"icon":"spark","color":"#ff3faf","description":"Activities and memories."}
]'::jsonb, now(), now()),
('luxuryLifestyle','Luxury Lifestyle','Lifestyle','Premium lifestyle plan with spending caps and investing.',true,false,7,'[
  {"name":"Bills","suggested_percentage":30,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":10,"icon":"utensils","color":"#ff7a32","description":"Groceries and dining."},
  {"name":"Lifestyle","suggested_percentage":20,"icon":"spark","color":"#ff3faf","description":"Premium experiences."},
  {"name":"Travel Fund","suggested_percentage":15,"icon":"plane","color":"#37d4ff","description":"Travel and lodging."},
  {"name":"Grooming","suggested_percentage":8,"icon":"user","color":"#20f0d0","description":"Personal presentation."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Safety buffer."},
  {"name":"Investments","suggested_percentage":7,"icon":"chart","color":"#b05cff","description":"Growth contribution."}
]'::jsonb, now(), now()),
('vacationPlanner','Vacation Planner','Lifestyle','Short-term travel goal template.',false,false,6,'[
  {"name":"Bills","suggested_percentage":35,"icon":"home","color":"#6b5cff","description":"Required monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Gas","suggested_percentage":8,"icon":"car","color":"#22c7ff","description":"Fuel and transportation."},
  {"name":"Vacation","suggested_percentage":25,"icon":"plane","color":"#37d4ff","description":"Trip savings."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Safety buffer."},
  {"name":"Spending Money","suggested_percentage":10,"icon":"wallet","color":"#ff3faf","description":"Trip spending cash."}
]'::jsonb, now(), now()),
('planning','Planning / Irregular Budget','Professional','For irregular bills, annual costs, taxes, and planned surprises.',false,false,6,'[
  {"name":"Maintenance","suggested_percentage":18,"icon":"tools","color":"#37d4ff","description":"Repairs and upkeep."},
  {"name":"Subscriptions","suggested_percentage":12,"icon":"monitor","color":"#b05cff","description":"Monthly and annual subscriptions."},
  {"name":"Taxes","suggested_percentage":30,"icon":"receipt","color":"#ff3faf","description":"Tax reserves and filings."},
  {"name":"Repairs","suggested_percentage":15,"icon":"wrench","color":"#ff7a32","description":"Unexpected repairs."},
  {"name":"Technology","suggested_percentage":10,"icon":"monitor","color":"#20f0d0","description":"Devices and upgrades."},
  {"name":"Holidays","suggested_percentage":15,"icon":"gift","color":"#44e68a","description":"Seasonal spending."}
]'::jsonb, now(), now()),
('gamerMode','Gamer Mode','Fun','Gaming and subscriptions without losing budget discipline.',false,false,7,'[
  {"name":"Bills","suggested_percentage":35,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Internet","suggested_percentage":10,"icon":"wifi","color":"#37d4ff","description":"Internet and connectivity."},
  {"name":"Gaming Gear","suggested_percentage":18,"icon":"game","color":"#ff3faf","description":"Hardware and accessories."},
  {"name":"Subscriptions","suggested_percentage":10,"icon":"monitor","color":"#b05cff","description":"Game passes and services."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Safety buffer."},
  {"name":"Savings","suggested_percentage":5,"icon":"vault","color":"#20f0d0","description":"Future purchases."}
]'::jsonb, now(), now()),
('creatorMode','Creator Mode','Fun','Creator budget for equipment, software, and audience growth.',false,false,7,'[
  {"name":"Bills","suggested_percentage":30,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Equipment","suggested_percentage":18,"icon":"camera","color":"#37d4ff","description":"Hardware and studio gear."},
  {"name":"Software","suggested_percentage":12,"icon":"monitor","color":"#b05cff","description":"Creator tools and subscriptions."},
  {"name":"Marketing","suggested_percentage":10,"icon":"megaphone","color":"#ff3faf","description":"Promotion and growth."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Safety buffer."},
  {"name":"Savings","suggested_percentage":8,"icon":"vault","color":"#20f0d0","description":"Future creator upgrades."}
]'::jsonb, now(), now()),
('sideHustle','Side Hustle','Fun','Simple side-business template for growth and taxes.',false,false,7,'[
  {"name":"Bills","suggested_percentage":30,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":10,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Transportation","suggested_percentage":8,"icon":"car","color":"#22c7ff","description":"Mobility and errands."},
  {"name":"Business Supplies","suggested_percentage":18,"icon":"briefcase","color":"#37d4ff","description":"Tools and supplies."},
  {"name":"Taxes","suggested_percentage":14,"icon":"receipt","color":"#b05cff","description":"Tax reserve."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Safety buffer."},
  {"name":"Profit","suggested_percentage":10,"icon":"chart","color":"#ff3faf","description":"Owner profit."}
]'::jsonb, now(), now()),
('aiSmartBudget','AI Smart Budget','AI Premium','AI-assisted starting split with safety caps and flexible reserve.',true,true,7,'[
  {"name":"Bills","suggested_percentage":32,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":12,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Gas","suggested_percentage":8,"icon":"car","color":"#22c7ff","description":"Fuel and transportation."},
  {"name":"Emergency Reserve","suggested_percentage":16,"icon":"shield","color":"#44e68a","description":"Safety buffer."},
  {"name":"Savings","suggested_percentage":14,"icon":"vault","color":"#20f0d0","description":"Savings reserve."},
  {"name":"Investments","suggested_percentage":12,"icon":"chart","color":"#b05cff","description":"Growth contribution."},
  {"name":"Flex","suggested_percentage":6,"icon":"spark","color":"#ff3faf","description":"Small flexible category."}
]'::jsonb, now(), now()),
('firePlan','FIRE Plan','AI Premium','High-savings premium plan for financial independence goals.',true,true,7,'[
  {"name":"Bills","suggested_percentage":25,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":10,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Transportation","suggested_percentage":7,"icon":"car","color":"#22c7ff","description":"Fuel and transportation."},
  {"name":"Emergency Reserve","suggested_percentage":10,"icon":"shield","color":"#44e68a","description":"Safety buffer."},
  {"name":"Investments","suggested_percentage":35,"icon":"chart","color":"#b05cff","description":"Primary FIRE engine."},
  {"name":"Tax Reserve","suggested_percentage":8,"icon":"receipt","color":"#37d4ff","description":"Tax planning."},
  {"name":"Lifestyle","suggested_percentage":5,"icon":"spark","color":"#ff3faf","description":"Lean lifestyle spending."}
]'::jsonb, now(), now()),
('millionaireBlueprint','Millionaire Blueprint','AI Premium','Premium wealth-building allocation for business, investing, and taxes.',true,true,8,'[
  {"name":"Bills","suggested_percentage":22,"icon":"home","color":"#6b5cff","description":"Core monthly obligations."},
  {"name":"Food","suggested_percentage":8,"icon":"utensils","color":"#ff7a32","description":"Groceries and meals."},
  {"name":"Transportation","suggested_percentage":6,"icon":"car","color":"#22c7ff","description":"Fuel and transportation."},
  {"name":"Investments","suggested_percentage":38,"icon":"chart","color":"#b05cff","description":"Primary wealth account."},
  {"name":"Business Capital","suggested_percentage":12,"icon":"briefcase","color":"#37d4ff","description":"Business growth reserve."},
  {"name":"Tax Reserve","suggested_percentage":8,"icon":"receipt","color":"#20f0d0","description":"Tax planning."},
  {"name":"Giving","suggested_percentage":3,"icon":"heart","color":"#ff6b99","description":"Giving account."},
  {"name":"Lifestyle","suggested_percentage":3,"icon":"spark","color":"#ff3faf","description":"Controlled lifestyle spending."}
]'::jsonb, now(), now()),
('customBuild','Custom Build','Custom','Create exact custom account names and percentages.',false,false,1,'[
  {"name":"Custom Budget Accounts","suggested_percentage":100,"icon":"sliders","color":"#20f0d0","description":"Open the custom builder to define your own plan."}
]'::jsonb, now(), now())
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  is_premium = excluded.is_premium,
  is_ai_template = excluded.is_ai_template,
  account_count = excluded.account_count,
  accounts_json = excluded.accounts_json,
  updated_at = now();

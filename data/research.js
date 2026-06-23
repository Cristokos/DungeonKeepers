// data/research.js

const RESEARCH = {};

// ── Tier Reference ─────────────────────────────────────────────────────────────
// Internal schema only — not shown to players.
// Notation: era.tier  (e.g. "2.3" = Era 2, Tier 3)
// Era 1 has no research. All research begins at 2.1.
//
// | Tier | Stage        | Typical cost profile                                  |
// |------|--------------|-------------------------------------------------------|
// | 2.1  | Very early   | 30–60 of 1–2 basic resources (wood, stone, food)     |
// | 2.2  | Early        | 50–100 of 2–3 resources; iron / bones / herbs begin  |
// | 2.3  | Mid          | 60–100 of 2–4 resources; coal / crystals / bricks    |
// | 2.4  | Mid-late     | 40–80 resources + 5–20 lore; arcane materials begin  |
// | 2.5  | Late arcane  | 15–60 arcane resources; 20–60 lore; mana-gold / silk |
// | 2.6  | Final gates  | 30–90 arcane + 60–120 lore; mithril; multiple rares  |
//         Reserved exclusively for prestige and era-transition unlock research.

// ── 2.1 — Very Early ──────────────────────────────────────────────────────────

RESEARCH.taxes = {
    tier: "2.1",
    name: "Taxation",
    desc: "Levy a tax on your population. Each creature contributes 1 cp per in-game day.",
    cost: { stone: 50, wood: 30 },
    effects: { taxBonus: 1, flag: "taxesEnabled" },
};

RESEARCH.toolcraft = {
    tier: "2.1",
    name: "Iron Tool Crafting",
    desc: "Forge crude iron implements for the whole settlement. All manual gathering yields +1 per action.",
    cost: { wood: 30, stone: 20, iron: 10 },
    effects: { allGatherBonus: 1 },
};

RESEARCH.timberfelling = {
    tier: "2.1",
    name: "Timber Felling",
    desc: "Proper axe technique and felling patterns. Lumber Camps produce 25% more wood.",
    cost: { wood: 40 },
    effects: { productionBonus: { lumber: 1.25 } },
};

RESEARCH.stonemason = {
    tier: "2.1",
    name: "Rough Stonemasonry",
    desc: "Chisels, wedges, and knowhow. Quarries produce 25% more stone.",
    cost: { stone: 40, wood: 20 },
    effects: { productionBonus: { quarry: 1.25 } },
};

RESEARCH.cropRotation = {
    tier: "2.1",
    name: "Crop Rotation",
    desc: "Rotate crops each season to replenish the soil. Farms produce 25% more food.",
    cost: { food: 50, wood: 20 },
    effects: { productionBonus: { farm: 1.25 } },
};

RESEARCH.foragerLore = {
    tier: "2.1",
    name: "Forager's Lore",
    desc: "Map the surrounding terrain for productive herb patches and cultivation sites. Herbalist's Dens produce 20% more herbs.",
    cost: { food: 30, wood: 20 },
    requiresResearch: ["toolcraft"],
    effects: { productionBonus: { herbalistDen: 1.20 } },
};

// ── 2.2 — Early ───────────────────────────────────────────────────────────────

RESEARCH.herbGarden = {
    tier: "2.2",
    name: "Herb Garden Plots",
    desc: "Lay out organized herb beds behind the Herbalist's Den. Herb production +25%.",
    cost: { wood: 30, food: 20 },
    requiresResearch: ["foragerLore"],
    effects: { productionBonus: { herbalistDen: 1.25 } },
};

RESEARCH.animalHusbandry = {
    tier: "2.2",
    name: "Animal Husbandry",
    desc: "Domesticate local animals for a steady supply. Hunting Lodge output +15% and food cap +50.",
    cost: { food: 60, wood: 25 },
    requiresResearch: ["cropRotation"],
    effects: { productionBonus: { huntingLodge: 1.15 }, capBonus: { food: 50 } },
};

RESEARCH.carpentry = {
    tier: "2.2",
    name: "Crude Carpentry",
    desc: "Better tools mean more splinters and more wood. Manual wood gathering yields +1 per action.",
    cost: { wood: 60, stone: 20 },
    requiresResearch: ["timberfelling"],
    effects: { gatherBonus: { wood: 1 } },
};

RESEARCH.quarrying = {
    tier: "2.2",
    name: "Better Quarrying",
    desc: "Systematic stone extraction techniques. Manual stone gathering yields +2 per action.",
    cost: { stone: 60, iron: 10 },
    requiresResearch: ["stonemason"],
    effects: { gatherBonus: { stone: 2 } },
};

RESEARCH.oreProspecting = {
    tier: "2.2",
    name: "Ore Prospecting",
    desc: "Learn to read rock formations for ore deposits. Mines produce 25% more ore.",
    cost: { stone: 50, wood: 20 },
    requiresResearch: ["stonemason"],
    effects: { productionBonus: { mine: 1.25 } },
};

RESEARCH.coalBunker = {
    tier: "2.2",
    name: "Coal Stockpiling",
    desc: "Covered bunkers keep coal dry and ready. Coal Seams produce 20% more and coal cap +100.",
    cost: { wood: 40, stone: 30 },
    requiresResearch: ["stonemason"],
    effects: { productionBonus: { coalSeam: 1.20 }, capBonus: { coal: 100 } },
};

RESEARCH.silverCurrency = {
    tier: "2.2",
    name: "Silver Currency",
    desc: "Smelt copper into standardized silver pieces. Every 100 cp is automatically rolled into 1 sp, simplifying your treasury display.",
    cost: { ore: 30, iron: 20 },
    requiresResearch: ["taxes"],
    effects: { flag: "silverCurrency" },
};

RESEARCH.composting = {
    tier: "2.2",
    name: "Composting",
    desc: "Pile waste and scraps into the fields. Farms produce an additional 25% more food.",
    cost: { food: 80, wood: 30, herbs: 20 },
    requiresResearch: ["cropRotation"],
    effects: { productionBonus: { farm: 1.25 } },
};

RESEARCH.communalLiving = {
    tier: "2.2",
    name: "Communal Living",
    desc: "Pack the burrows tighter and share the straw. Each Lair holds +2 extra creatures.",
    cost: { wood: 60, stone: 40 },
    requiresResearch: ["taxes"],
    effects: { housingBonus: { lair: 2 } },
};

RESEARCH.taxCollector = {
    tier: "2.2",
    name: "Tax Collector",
    desc: "A dedicated ledger-keeper to squeeze out every copper. Taxation yields +1 cp per creature per day.",
    cost: { stone: 80, wood: 50 },
    requiresResearch: ["taxes"],
    effects: { taxBonus: 1 },
};

// ── 2.3 — Mid ─────────────────────────────────────────────────────────────────

RESEARCH.deepMining = {
    tier: "2.3",
    name: "Deep Mining Techniques",
    desc: "Shafts, bracing, and lung-burning bravery. Mines produce 25% more ore and Crystal Seams become available.",
    cost: { stone: 80, ore: 40 },
    requiresResearch: ["oreProspecting"],
    effects: { productionBonus: { mine: 1.25 }, unlockBuildings: ["crystalSeam"] },
};

RESEARCH.crystalLore = {
    tier: "2.3",
    name: "Crystal Lore",
    desc: "Study the resonance of raw crystals. Crystal Seams produce 25% more crystals.",
    cost: { stone: 40, ore: 20 },
    requiresResearch: ["deepMining"],
    effects: { productionBonus: { crystalSeam: 1.25 } },
};

RESEARCH.sulphurStudy = {
    tier: "2.3",
    name: "Alchemical Sulphur",
    desc: "Figure out what the yellow powder actually does. Sulphur Vents produce 30% more sulphur.",
    cost: { stone: 60, coal: 30 },
    requiresResearch: ["coalBunker"],
    effects: { productionBonus: { sulphurVent: 1.30 } },
};

RESEARCH.bellowsDesign = {
    tier: "2.3",
    name: "Crude Bellows",
    desc: "A leather lung to stoke the forge fire. Smelter iron output +25%.",
    cost: { stone: 60, iron: 20 },
    requiresResearch: ["oreProspecting"],
    effects: { converterBonus: { smelter: 1.25 } },
};

RESEARCH.concentratedExtracts = {
    tier: "2.3",
    name: "Concentrated Tinctures",
    desc: "Reduce and concentrate herb extracts. Alchemy Lab potion output +25%.",
    cost: { herbs: 50, potions: 10 },
    requiresResearch: ["herbGarden"],
    effects: { converterBonus: { alchemyLab: 1.25 } },
};

RESEARCH.highFireKiln = {
    tier: "2.3",
    name: "High-Fire Kiln",
    desc: "Pack the kiln tighter and fire hotter. Kiln brick output +25%.",
    cost: { stone: 50, coal: 20 },
    requiresResearch: ["coalBunker"],
    effects: { converterBonus: { kiln: 1.25 } },
};

RESEARCH.loomMastery = {
    tier: "2.3",
    name: "Loom Mastery",
    desc: "Refined threading patterns and treadle timing. Loom cloth output +25%.",
    cost: { cloth: 20, wood: 30 },
    requiresResearch: ["herbGarden"],
    effects: { converterBonus: { loom: 1.25 } },
};

RESEARCH.packHunting = {
    tier: "2.3",
    name: "Pack Hunting",
    desc: "Coordinated drives and ambushes bring down more prey. Hunting Lodge output +25%.",
    cost: { food: 50, wood: 30 },
    requiresResearch: ["animalHusbandry"],
    effects: { productionBonus: { huntingLodge: 1.25 } },
};

RESEARCH.trapLines = {
    tier: "2.3",
    name: "Trap Lines",
    desc: "String snares through the forest overnight. Hunting Lodges produce 25% more overall.",
    cost: { wood: 50, bones: 30 },
    requiresResearch: ["packHunting"],
    effects: { productionBonus: { huntingLodge: 1.25 } },
};

RESEARCH.bonecraft = {
    tier: "2.3",
    name: "Bonework",
    desc: "Render, cure, and stack bones properly. Bone storage cap +150.",
    cost: { bones: 60, stone: 20 },
    requiresResearch: ["packHunting"],
    effects: { capBonus: { bones: 150 } },
};

RESEARCH.reinforcedShelving = {
    tier: "2.3",
    name: "Reinforced Shelving",
    desc: "Iron-braced racks and raised floors. Each Storage building now grants +75 cap instead of +50.",
    cost: { wood: 80, stone: 40, iron: 30 },
    requiresResearch: ["carpentry"],
    effects: { flag: "reinforcedShelving" },
};

RESEARCH.dryCellar = {
    tier: "2.3",
    name: "Dry Cellar",
    desc: "Stone-lined underground stores keep food and herbs fresh longer. Food cap +100, herbs cap +100.",
    cost: { stone: 60, wood: 40, bricks: 30 },
    requiresResearch: ["reinforcedShelving"],
    effects: { capBonus: { food: 100, herbs: 100 } },
};

RESEARCH.militiaDrill = {
    tier: "2.3",
    name: "Militia Drill",
    desc: "Weekly drills and bunk assignments. Each Armory houses +3 additional creatures.",
    cost: { iron: 40, wood: 30 },
    requiresResearch: ["communalLiving"],
    effects: { housingBonus: { armory: 3 } },
};

RESEARCH.bookkeeping = {
    tier: "2.3",
    name: "Village Ledger",
    desc: "Track debts, dues, and trade agreements. Taxation yields +1 additional cp per creature per day.",
    cost: { wood: 60, stone: 40 },
    requiresResearch: ["taxCollector"],
    effects: { taxBonus: 1 },
};

RESEARCH.rationing = {
    tier: "2.3",
    name: "Strict Rationing",
    desc: "Half-portions and no complaints. Your population consumes 20% less food per tick.",
    cost: { food: 100, wood: 30 },
    requiresResearch: ["composting"],
    effects: { foodConsumption: 0.80 },
};

RESEARCH.goldStandard = {
    tier: "2.3",
    name: "Gold Standard",
    desc: "Establish gold as the realm's reserve currency. Every 10 sp rolls into 1 gp, revealing the full gp / sp / cp denomination.",
    cost: { ore: 60, iron: 30 },
    requiresResearch: ["silverCurrency"],
    effects: { flag: "goldStandard" },
};

// ── 2.4 — Mid-Late ────────────────────────────────────────────────────────────

RESEARCH.crystalFocus = {
    tier: "2.4",
    name: "Crystal Focus Arrays",
    desc: "Arrange crystals to funnel resonance into the grinder. Arcane Grinder dust output +25%.",
    cost: { crystals: 50, arcaneDust: 20, lore: 8 },
    requiresResearch: ["crystalLore"],
    effects: { converterBonus: { arcaneGrinder: 1.25 } },
};

RESEARCH.forgeMastery = {
    tier: "2.4",
    name: "Forge Mastery",
    desc: "Quench, draw, and temper — the three secrets of the smith. Forge steel output +25%.",
    cost: { steel: 30, coal: 40, lore: 5 },
    requiresResearch: ["bellowsDesign"],
    effects: { converterBonus: { forge: 1.25 } },
};

RESEARCH.mortaredMasonry = {
    tier: "2.4",
    name: "Mortared Masonry",
    desc: "Lime mortar between courses of brick. Kiln output +25% and brick cap +50.",
    cost: { bricks: 40, stone: 60, lore: 5 },
    requiresResearch: ["highFireKiln", "quarrying"],
    effects: { converterBonus: { kiln: 1.25 }, capBonus: { bricks: 50 } },
};

RESEARCH.roadNetwork = {
    tier: "2.4",
    name: "Rutted Road Network",
    desc: "Packed earth and stone fill the worst ruts. All building passive production +5%.",
    cost: { stone: 100, wood: 60 },
    requiresResearch: ["carpentry", "quarrying"],
    effects: { allProductionBonus: 0.05 },
};

RESEARCH.tradeGoods = {
    tier: "2.4",
    name: "Trade Caravans",
    desc: "Send wagons of cloth and potions to nearby settlements. Cloth and potions in stock each generate 2 cp per unit per day.",
    cost: { cloth: 30, potions: 15 },
    requiresResearch: ["taxes", "loomMastery"],
    effects: { flag: "tradeGoods" },
};

RESEARCH.guildCharter = {
    tier: "2.4",
    name: "Artisan's Guild Charter",
    desc: "Formalize the craft guilds with rights and duties. Smelter, Forge, Loom, and Kiln material costs -20%.",
    cost: { iron: 60, wood: 60, lore: 12 },
    requiresResearch: ["bellowsDesign", "loomMastery", "highFireKiln"],
    effects: { flag: "guildDiscount" },
};

RESEARCH.mintStandard = {
    tier: "2.4",
    name: "Mint Standard",
    desc: "Phase out copper entirely. All costs below 1 sp round up. Treasury displays in gold and silver only.",
    cost: { iron: 40, stone: 30, coins: 500 },
    requiresResearch: ["goldStandard"],
    effects: { flag: "mintStandard" },
};

RESEARCH.arcaneTapping = {
    tier: "2.4",
    name: "Arcane Tapping",
    desc: "Draw raw ley energy through the tower's crystal spire. Mage Tower crystal output +50%.",
    cost: { arcaneDust: 40, crystals: 30, lore: 15 },
    requiresResearch: ["crystalFocus"],
    effects: { productionBonus: { mageTower: 1.50 } },
};

RESEARCH.arcaneInscription = {
    tier: "2.4",
    name: "Arcane Inscription",
    desc: "Carve runes with intent, not guesswork. Arcane Bench rune output +25%.",
    cost: { runes: 20, crystals: 30, lore: 10 },
    requiresResearch: ["crystalFocus"],
    effects: { converterBonus: { arcaneBench: 1.25 } },
};

RESEARCH.loreKeeping = {
    tier: "2.4",
    name: "Lore Keeping",
    desc: "Establish a formal record of recovered knowledge. Scribes can now be set to work — unlocks the Scriptorium.",
    cost: { stone: 80, wood: 60 },
    requiresResearch: ["arcaneTapping"],
    effects: { unlockBuildings: ["scriptorium"] },
};

RESEARCH.ironLockbox = {
    tier: "2.4",
    name: "Iron Lockbox",
    desc: "A bolted iron chest for the village treasury. Coin cap increased by 50,000 cp on top of the current currency tier's base.",
    cost: { iron: 60, stone: 40 },
    requiresResearch: ["taxCollector"],
    effects: { flag: "ironLockbox" },
};

// ── 2.5 — Late Arcane ─────────────────────────────────────────────────────────

RESEARCH.runicScript = {
    tier: "2.5",
    name: "Runic Script",
    desc: "A standardized glyph system makes inscribing faster. Arcane Bench rune output +25% more.",
    cost: { runes: 40, arcaneDust: 30, lore: 20 },
    requiresResearch: ["arcaneInscription"],
    effects: { converterBonus: { arcaneBench: 1.25 } },
};

RESEARCH.essenceHarvest = {
    tier: "2.5",
    name: "Essence Harvesting",
    desc: "Capture ambient magical resonance in the circle's stone. Ritual Circle Arcane Essence output +50%.",
    cost: { arcaneEssence: 15, arcaneDust: 50, lore: 30 },
    requiresResearch: ["arcaneTapping"],
    effects: { converterBonus: { ritualCircle: 1.50 } },
};

RESEARCH.ichorRefinement = {
    tier: "2.5",
    name: "Ichor Refinement",
    desc: "Render and purify dark altar drippings. Dark Altar ichor output +30%.",
    cost: { ichor: 10, bones: 60, lore: 25 },
    requiresResearch: ["bonecraft"],
    effects: { converterBonus: { darkAltar: 1.30 } },
};

RESEARCH.silkCulture = {
    tier: "2.5",
    name: "Spider Keeper's Art",
    desc: "Keep the spiders well-fed and they weave faster. Spider Nest silk output +25%.",
    cost: { silk: 20, bones: 40, lore: 20 },
    requiresResearch: ["packHunting"],
    effects: { converterBonus: { spiderNest: 1.25 } },
};

RESEARCH.manaConductorCoils = {
    tier: "2.5",
    name: "Mana Conductor Coils",
    desc: "Wind copper coils into the crucible walls to focus mana flow. Arcane Crucible output +30%.",
    cost: { manaGold: 15, iron: 60, lore: 35 },
    requiresResearch: ["forgeMastery"],
    effects: { converterBonus: { arcaneCrucible: 1.30 } },
};

RESEARCH.mithrilTemper = {
    tier: "2.5",
    name: "Mithril Tempering",
    desc: "The precise heat range that turns grey metal silver-bright. Mithril Forge output +30%.",
    cost: { mithril: 5, steel: 60, lore: 40 },
    requiresResearch: ["forgeMastery"],
    effects: { converterBonus: { mithrilForge: 1.30 } },
};

RESEARCH.ritualPrep = {
    tier: "2.5",
    name: "Rites of the Ancients",
    desc: "Recover the old ways from crumbling texts and stubborn elders. Unlocks the Ritual Circle. Arcane Essence cap +25.",
    cost: { arcaneDust: 60, lore: 30 },
    requiresResearch: ["arcaneTapping"],
    effects: { unlockBuildings: ["ritualCircle"], capBonus: { arcaneEssence: 25 } },
};

RESEARCH.darkTexts = {
    tier: "2.5",
    name: "Forbidden Texts",
    desc: "What you read cannot be unread. Unlocks the Dark Altar.",
    cost: { arcaneEssence: 20, lore: 40 },
    requiresResearch: ["ritualPrep"],
    effects: { unlockBuildings: ["darkAltar"] },
};

RESEARCH.silkenWarren = {
    tier: "2.5",
    name: "Silken Warren",
    desc: "Prepare a sealed chamber and convince the spiders to cooperate. Unlocks the Spider Nest.",
    cost: { bones: 60, lore: 25 },
    requiresResearch: ["bonecraft", "militiaDrill"],
    effects: { unlockBuildings: ["spiderNest"] },
};

RESEARCH.manaConduit = {
    tier: "2.5",
    name: "Mana Conduit Forging",
    desc: "Forge a network of iron conduits to carry raw mana safely. Unlocks the Arcane Crucible.",
    cost: { steel: 80, lore: 50 },
    requiresResearch: ["arcaneTapping", "forgeMastery"],
    effects: { unlockBuildings: ["arcaneCrucible"] },
};

RESEARCH.goldOnly = {
    tier: "2.5",
    name: "Gold Coin Realm",
    desc: "Silver is for peasants. All costs below 1 gp round up to 1 gp. Treasury and all prices display in gold pieces only.",
    cost: { iron: 60, coins: 2000 },
    requiresResearch: ["mintStandard"],
    effects: { flag: "goldOnly" },
};

RESEARCH.infernalLore = {
    tier: "2.5",
    name: "Infernal Codex",
    desc: "Compile what your scholars know of the Nine Hells — their hierarchy, their rulers, and the one principle governing every transaction there: everything has a price. Bind the first pages.",
    cost: { arcaneEssence: 25, lore: 50 },
    requiresResearch: ["darkTexts", "essenceHarvest"],
    effects: { flag: "infernalLore" },
};

// ── 2.6 — Final Gates ─────────────────────────────────────────────────────────
// Reserved for prestige unlocks and era-transition gates only.

RESEARCH.planarRites = {
    tier: "2.6",
    name: "Rites of Planar Contact",
    desc: "Inscribe infernal geometries into the Ritual Circle floor — angles that should not fit in three dimensions. The circle can now reach further than it was designed to. Something on the other side has noticed.",
    cost: { arcaneEssence: 45, ichor: 30, runes: 40, lore: 70 },
    requiresResearch: ["infernalLore", "ichorRefinement"],
    effects: { flag: "planarContact" },
};

RESEARCH.amnizuSummons = {
    tier: "2.6",
    name: "The Amnizu Summons",
    desc: "The geometries are drawn. You speak the invitation — not a summoning, not a command. Just an offer to negotiate. An Amnizu steps through. It already knows what you have built. It is only waiting to see how much of it you are willing to give.",
    cost: { arcaneEssence: 60, ichor: 45, mithril: 8, lore: 90 },
    requiresResearch: ["planarRites", "mithrilTemper"],
    effects: { flag: "amnizuAvailable" },
};

RESEARCH.dungeonBlueprint = {
    tier: "2.6",
    name: "Dungeon Blueprint",
    desc: "Maps, schematics, and the first load-bearing column of something far grander than a village. Era 3 awaits.",
    cost: { arcaneEssence: 30, ichor: 15, lore: 75 },
    requiresResearch: ["ritualPrep", "darkTexts", "manaConduit", "mithrilTemper", "forgeMastery", "roadNetwork"],
    effects: { flag: "eraThreeUnlocked" },
};

// data/projects.js
//
// Dungeon Projects — extremely expensive, repeatable multi-part upgrades.
// Bought in 100 discrete 1% increments (see buildProject() in game.js); on
// reaching 100% the cycle's effect stacks permanently and the project resets
// to 0%, ready to be bought into again at costPerPercent/coinCostPerPercent
// scaled by cycleCostScale^cycles. Unlike ROOMS entries, Projects carry no
// gameState.buildings count — progress and completed cycles live in
// gameState.projects[id] = { pct, cycles }.

const PROJECTS = {
    vaultOfAges: {
        name: "Vault of Ages",
        desc: "A subterranean reliquary that stretches your storerooms into folded space.",
        flavor: "Every grain, every ingot, every drop finds a shelf that shouldn't exist.",
        costPerPercent: { stone: 4000, iron: 1200, steel: 600, mithril: 40 },
        coinCostPerPercent: 5000,
        cycleCostScale: 2,
        effectPerCycle: { storageFlatAllExceptCoinsLore: 1000 },
    },
    sunkenGranary: {
        name: "Sunken Granary",
        desc: "A drowned granary reclaimed and reconsecrated to swell every harvest.",
        flavor: "The silo remembers a harvest that never rotted.",
        costPerPercent: { wood: 3500, clay: 1000, bricks: 500, arcaneEssence: 30 },
        coinCostPerPercent: 4000,
        cycleCostScale: 2,
        effectPerCycle: { foodPct: 0.05, foodFlat: 1 },
    },
    currencyMint: {
        name: "Currency Mint",
        desc: "A private mint striking coin from ore no ledger will ever trace.",
        flavor: "The stamp falls, and the treasury grows a little less honest.",
        costPerPercent: { ore: 3500, iron: 1000, cloth: 500, manaGold: 30 },
        coinCostPerPercent: 6000,
        cycleCostScale: 2,
        effectPerCycle: { coinPct: 0.05, coinFlat: 10 },
    },
    grandLibrary: {
        name: "Grand Library",
        desc: "Shelves that recurse past the horizon, cataloguing knowledge that hasn't been learned yet.",
        flavor: "Some of these books are still being written.",
        costPerPercent: { herbs: 3500, runes: 1000, potions: 500, silk: 30 },
        coinCostPerPercent: 5000,
        cycleCostScale: 2,
        effectPerCycle: { loreCapFlat: 200, loreCapPct: 0.02 },
    },
};

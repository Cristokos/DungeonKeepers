// data/religion.js

const DEITIES = {
    pelor: {
        name: "Pelor",
        alignment: "Light",
        alignClass: "deity-light",
        desc: "The Sun Father blesses community and harvest. His priests tend the sick and feed the poor, keeping spirits bright even in dark times.",
        tithe: { food: 5 },  // base; scaled in game.js to max(50, 10% of production)
        bonuses: {
            moraleBonus: 5,
            growthMult: 0.90,  // multiplier on growth threshold (< 1 = faster growth)
            arcaneDustPassive: 0.3,  // arcane dust per day from Sanctuaries (flat, no workers)
        },
        templeBonus: {
            moraleBonus: 3,
            growthMult: 0.02,  // subtracted per temple (stacks)
        },
        uniqueBuilding: "pelorSanctuary",
        flavorQuote: "\"Light is life. Tend it well.\"",
    },

    gruumsh: {
        name: "Gruumsh",
        alignment: "Dark",
        alignClass: "deity-dark",
        desc: "The One-Eye demands blood and conquest. He rewards only those who drive their people hardest, sparing no mercy for the weak.",
        tithe: { ore: 3, food: 3 },  // base; scaled in game.js to max(50, 10% of production)
        periodicSacrifice: {
            every: 30,              // days between sacrifices
            minFaith: 10,           // faith score required to trigger
            popCost: 1,             // population lost
            surgeDays: 10,          // days of production surge after sacrifice
            surgeBonus: 0.20,       // +20% all production during surge
        },
        bonuses: {
            allProductionBonus: 0.15,
            moralePenalty: -5,
            lairHousingBonus: 1,    // +1 housing per Lair when Gruumsh is active patron
            bonesPassive: 0.5,      // bones per day per War Pit (no workers needed)
        },
        templeBonus: {
            allProductionBonus: 0.03,  // per temple
        },
        uniqueBuilding: "gruumshWarPit",
        flavorQuote: "\"Pain is the first teacher. Conquest is the final exam.\"",
    },

    silvanus: {
        name: "Silvanus",
        alignment: "Neutral",
        alignClass: "deity-neutral",
        desc: "The Oak Father watches over the balance of nature. He rewards those who give back what they take, and punishes those who upset the cycle.",
        tithe: { wood: 4, herbs: 3 },  // base; scaled in game.js to max(50, 10% of production)
        bonuses: {
            productionBonus: { farm: 1.15, herbalistDen: 1.15 },
            loreCapBonus: 50,
            winterPenaltyMult: 0.5,     // winter morale penalty multiplied by this
            growthMult: 0.833,          // ~+20% faster growth (0.833 threshold = 1/1.2)
            flatProduction: { food: 0.5, herbs: 0.3, wood: 0.3, potions: 0.05 },  // per day, no workers
            resourceBonus: { food: 0.10, herbs: 0.10, wood: 0.10, potions: 0.10 }, // +10% total
            farmFoodCapBonus: 100,      // +100 food cap per farm
            farmFoodProductionBonus: 0.10, // +10% total food production (flat unlock)
        },
        templeBonus: {
            productionBonus: { farm: 1.05, herbalistDen: 1.05 },
            loreCapBonus: 25,
        },
        uniqueBuilding: "sylvanGrove",
        flavorQuote: "\"The forest remembers what cities forget.\"",
    },
};

// Favor tier thresholds and names (favor scale: 0-100)
const FAVOR_TIERS = [
    { min: 0,  max: 24,  name: "Acknowledged" },
    { min: 25, max: 49,  name: "Favored"      },
    { min: 50, max: 74,  name: "Devoted"      },
    { min: 75, max: 99,  name: "Exalted"      },
    { min: 100, max: 100, name: "Blessed"     },
];

function getFavorTier(favor) {
    for (const tier of FAVOR_TIERS) {
        if (favor <= tier.max) return tier;
    }
    return FAVOR_TIERS[FAVOR_TIERS.length - 1];
}

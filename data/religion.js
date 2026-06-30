// data/religion.js

const DEITIES = {
    pelor: {
        name: "Pelor",
        alignment: "Light",
        alignClass: "deity-light",
        desc: "The Sun Father blesses community and harvest. His priests tend the sick and feed the poor, keeping spirits bright even in dark times.",
        tithe: { food: 5 },
        bonuses: {
            moraleBonus: 5,
            growthMult: 0.90,  // multiplier on growth threshold (< 1 = faster growth)
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
        tithe: { ore: 3, food: 3 },
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
        tithe: { wood: 4, herbs: 3 },
        bonuses: {
            productionBonus: { farm: 1.15, herbalistDen: 1.15 },
            loreCapBonus: 50,
            winterPenaltyMult: 0.5,  // winter morale penalty multiplied by this
        },
        templeBonus: {
            productionBonus: { farm: 1.05, herbalistDen: 1.05 },
            loreCapBonus: 25,
        },
        uniqueBuilding: "sylvanGrove",
        flavorQuote: "\"The forest remembers what cities forget.\"",
    },
};

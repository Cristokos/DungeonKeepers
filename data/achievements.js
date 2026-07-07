// data/achievements.js
//
// Achievement definitions. Two tiers:
//   • minor — progress markers, no gameplay effect
//   • major — grant a small bonus, or reveal a hidden "Mastery" research
//
// Earned achievements live in gameState.meta.achievements (account-wide,
// survives prestige). Lifetime counters live in gameState.meta.lifetime.
//
// Definition shape:
//   name     display name
//   icon     HTML entity / emoji for the card
//   tier     'minor' | 'major'
//   how      earn condition, always visible
//   reward   bonus description — majors only, hidden until earned
//   research RESEARCH key this achievement reveals (majors that gate research)
//   check()  polled once per game day; return true to earn. Omitted for
//            event-driven achievements earned via earnAchievement() directly.
//   progress() → { cur, goal } for a progress readout on the card (optional)

// Lifetime-counter accessor, safe before game.js has initialised the state.
function _achLife() {
    return (typeof gameState !== 'undefined' && gameState.meta && gameState.meta.lifetime) || {};
}
function _achStats() {
    return (typeof gameState !== 'undefined' && gameState.stats) || {};
}

const ACHIEVEMENTS = {

    // ── Minor — progress markers ─────────────────────────────────────────────

    firstFootprints: {
        name: "First Footprints", icon: "&#127793;", tier: "minor",
        how: "Survive a full in-game year — all four seasons.",
        check: () => gameState.time.year >= 2,
    },
    standingRoomOnly: {
        name: "Standing Room Only", icon: "&#127968;", tier: "minor",
        how: "Fill every point of housing with at least 25 creatures.",
        check: (ctx) => gameState.population.count >= 25 && ctx.housing > 0 && gameState.population.count >= ctx.housing,
    },
    theLongWinter: {
        name: "The Long Winter", icon: "&#10052;", tier: "minor",
        how: "Survive a Winter without a single starvation death.",
        // event-driven: earned at the Winter→Spring transition
    },
    fullLarder: {
        name: "Full Larder", icon: "&#127860;", tier: "minor",
        how: "Have every Tier 1 resource at its storage cap simultaneously.",
        check: (ctx) => {
            if ((gameState.run.era || 1) < 2) return false;
            const t1 = ['food','wood','stone','ore','herbs','crystals','coal','clay','bones','sulphur'];
            return t1.every(r => (gameState.resources[r] || 0) >= (ctx.caps[r] || Infinity));
        },
    },
    cottageIndustry: {
        name: "Cottage Industry", icon: "&#9881;", tier: "minor",
        how: "Have at least one of every standard production building constructed.",
        check: () => {
            const deityOnly = new Set(['pelorSanctuary', 'gruumshWarPit', 'sylvanGrove']);
            for (const [id, def] of Object.entries(ROOMS)) {
                if (deityOnly.has(id)) continue;
                if ((typeof BUILDING_ERA !== 'undefined' ? (BUILDING_ERA[id] || 1) : 1) > 2) continue;
                if (id.startsWith('essence') || id === 'influenceShrine' || id === 'manaFont') continue;
                if (!def.production && !def.converts) continue;
                if ((gameState.buildings[id] || 0) < 1) return false;
            }
            return true;
        },
    },
    copperToSilver: {
        name: "Copper to Silver", icon: "&#129689;", tier: "minor",
        how: "Amass 1,000 copper pieces for the first time.",
        check: () => (gameState.resources.coins || 0) >= 1000,
        progress: () => ({ cur: Math.floor(gameState.resources.coins || 0), goal: 1000 }),
    },
    merchantPrince: {
        name: "Merchant Prince", icon: "&#9878;", tier: "minor",
        how: "Have every available trade route slot active at once.",
        check: () => typeof getTradeCapacity === 'function' && getTradeCapacity() > 0
            && getUsedTradeCapacity() >= getTradeCapacity(),
    },
    devout: {
        name: "Devout", icon: "&#128591;", tier: "minor",
        how: "Reach the highest favor tier with any deity.",
        check: () => (_achLife().deitiesMaxFavor || []).length >= 1,
    },
    apostate: {
        name: "Apostate", icon: "&#128128;", tier: "minor",
        how: "Abandon a deity after reaching their highest favor tier.",
        // event-driven: earned in abandonDeity()
    },
    oldGodsNewGods: {
        name: "Old Gods, New Gods", icon: "&#9775;", tier: "minor",
        how: "Pledge yourself to three different deities across your keeper's lifetime.",
        check: () => (_achLife().deitiesPledged || []).length >= 3,
        progress: () => ({ cur: (_achLife().deitiesPledged || []).length, goal: 3 }),
    },
    homebody: {
        name: "Homebody", icon: "&#128726;", tier: "minor",
        how: "Play five full years in the same run without prestiging.",
        check: () => gameState.time.year >= 6,
        progress: () => ({ cur: Math.min(5, gameState.time.year - 1), goal: 5 }),
    },
    wanderer: {
        name: "Wanderer", icon: "&#129517;", tier: "minor",
        how: "Start runs in a Natural, a D&D, and a Magical biome — one of each type.",
        check: () => {
            const types = new Set((gameState.meta.seenBiomes || [])
                .map(b => BIOME_DATA[b] && BIOME_DATA[b].type).filter(Boolean));
            return types.size >= 3;
        },
    },
    againstAllOdds: {
        name: "Against All Odds", icon: "&#9876;", tier: "minor",
        how: "Reach 50 population in the Blighted Wastes or the Arctic Glacier.",
        check: () => gameState.population.count >= 50
            && (gameState.run.biome === 'Blighted Wastes' || gameState.run.biome === 'Arctic Glacier'),
    },
    menagerie: {
        name: "The Menagerie", icon: "&#128009;", tier: "minor",
        how: "Play as five different races across your prestige runs.",
        check: () => Object.keys(gameState.meta.racesPlayed || {}).length >= 5,
        progress: () => ({ cur: Object.keys(gameState.meta.racesPlayed || {}).length, goal: 5 }),
    },
    timeThief: {
        name: "Time Thief", icon: "&#8987;", tier: "minor",
        how: "Bank a full 8 hours of Accelerated Time.",
        check: () => (gameState.pauseBank || 0) >= 8 * 60 * 60 * 0.99,
    },
    deepRoots: {
        name: "Deep Roots", icon: "&#127795;", tier: "minor",
        how: "Walk an Awakening path all the way to its end and choose a race.",
        check: () => !!(gameState.era1 && gameState.era1.chosen),
    },
    eyewitness: {
        name: "Eyewitness to History", icon: "&#128220;", tier: "minor",
        how: "Accumulate 100 entries in the event log in a single run.",
        check: () => (_achStats().logEntries || 0) >= 100,
        progress: () => ({ cur: _achStats().logEntries || 0, goal: 100 }),
    },
    clickingIntensifies: {
        name: "Clicking Intensifies", icon: "&#128433;", tier: "minor",
        how: "Manually gather 1,000 times in a single run.",
        check: () => (_achStats().manualGathers || 0) >= 1000,
        progress: () => ({ cur: _achStats().manualGathers || 0, goal: 1000 }),
    },
    quintessential: {
        name: "Quintessential", icon: "&#128311;", tier: "minor",
        how: "Earn a lifetime total of 100 Quintessence.",
        check: () => (gameState.meta.quintessence || 0) >= 100,
        progress: () => ({ cur: gameState.meta.quintessence || 0, goal: 100 }),
    },
    inkStillWet: {
        name: "Ink Still Wet", icon: "&#128395;", tier: "minor",
        how: "Sign the Devil's Contract. Amnizu sends his regards.",
        check: () => (_achLife().contractsSigned || 0) >= 1,
    },

    // ── Major — small bonuses ────────────────────────────────────────────────

    greenThumb: {
        name: "Green Thumb", icon: "&#127807;", tier: "major",
        how: "Produce 500 food across all your runs.",
        reward: "Manual food gathers have a 2% chance to also yield 1 herb (once herbs are unlocked).",
        check: () => (_achLife().foodProduced || 0) >= 500,
        progress: () => ({ cur: Math.floor(_achLife().foodProduced || 0), goal: 500 }),
    },
    stonecuttersEye: {
        name: "Stonecutter's Eye", icon: "&#9935;", tier: "major",
        how: "Build 1,000 Quarries across your account.",
        reward: "+2 to every manual stone gather.",
        check: () => ((_achLife().builtBy || {}).quarry || 0) >= 1000,
        progress: () => ({ cur: (_achLife().builtBy || {}).quarry || 0, goal: 1000 }),
    },
    packrat: {
        name: "Packrat", icon: "&#128230;", tier: "major",
        how: "Hit the storage cap on 10 different resources across your account.",
        reward: "All Tier 1 storage caps +5%.",
        check: () => (_achLife().cappedResources || []).length >= 10,
        progress: () => ({ cur: (_achLife().cappedResources || []).length, goal: 10 }),
    },
    firstFrost: {
        name: "First Frost", icon: "&#127784;", tier: "major",
        how: "Survive your first Winter.",
        reward: "Morale no longer drops below 50 during Winter.",
        check: () => (_achLife().wintersSurvived || 0) >= 1,
    },
    festivalOfPlenty: {
        name: "Festival of Plenty", icon: "&#127882;", tier: "major",
        how: "End three consecutive seasons with food at its storage cap.",
        reward: "Every Spring opens with a festival day: +10% to all production.",
        check: () => (_achStats().seasonsFoodCapStreak || 0) >= 3,
        progress: () => ({ cur: _achStats().seasonsFoodCapStreak || 0, goal: 3 }),
    },
    haggler: {
        name: "Haggler", icon: "&#129309;", tier: "major",
        how: "Accumulate 10,000 trade-route days across your account.",
        reward: "Trade route buy prices drop from 2× to 1.9× the sell price.",
        check: () => (_achLife().tradeRouteDays || 0) >= 10000,
        progress: () => ({ cur: Math.floor(_achLife().tradeRouteDays || 0), goal: 10000 }),
    },
    fatPurse: {
        name: "Fat Purse", icon: "&#128176;", tier: "major",
        how: "Establish the silver standard (research Silver Currency).",
        reward: "Coin cap +5 cp for every major achievement you have earned.",
        check: () => !!(gameState.research && gameState.research.silverCurrency),
    },
    titheAndTaxes: {
        name: "Tithe and Taxes", icon: "&#9962;", tier: "major",
        how: "Pay 10 straight years of tithes (1,200 consecutive days) without missing one.",
        reward: "Each day's tithe has a 1-in-20 chance of being refunded by your deity.",
        check: () => (_achStats().titheStreak || 0) >= 1200,
        progress: () => ({ cur: _achStats().titheStreak || 0, goal: 1200 }),
    },
    chosenVessel: {
        name: "Chosen Vessel", icon: "&#128367;", tier: "major",
        how: "Trigger 10,000 deity blessing events across your account.",
        reward: "Blessings recharge 10% faster after each one fires.",
        check: () => (_achLife().blessings || 0) >= 10000,
        progress: () => ({ cur: _achLife().blessings || 0, goal: 10000 }),
    },
    landlord: {
        name: "Landlord", icon: "&#128273;", tier: "major",
        how: "House 5,000 creatures cumulatively across your account.",
        reward: "The first two Hovels of every run are free, and cost scaling only begins after them.",
        check: () => (_achLife().creaturesHoused || 0) >= 5000,
        progress: () => ({ cur: _achLife().creaturesHoused || 0, goal: 5000 }),
    },
    moraleOfficer: {
        name: "Morale Officer", icon: "&#127926;", tier: "major",
        how: "Hold morale at its cap for a full year (120 consecutive days).",
        reward: "+5 permanent morale cap.",
        check: () => (_achStats().daysAtMoraleCap || 0) >= 120,
        progress: () => ({ cur: _achStats().daysAtMoraleCap || 0, goal: 120 }),
    },
    nightShift: {
        name: "Night Shift", icon: "&#127769;", tier: "major",
        how: "With 50+ population, keep every job filled and no idle creatures for a full season.",
        reward: "Idle creatures earn 0.1 cp per day doing odd jobs.",
        check: () => (_achStats().daysFullEmployment || 0) >= 30,
        progress: () => ({ cur: _achStats().daysFullEmployment || 0, goal: 30 }),
    },
    cartographer: {
        name: "Cartographer", icon: "&#128506;", tier: "major",
        how: "Complete at least one full year in 10 different biomes.",
        reward: "Your biome's starting resource bonus is actually delivered on reaching Era 2 — plus 10%.",
        check: () => (_achLife().biomeYears || []).length >= 10,
        progress: () => ({ cur: (_achLife().biomeYears || []).length, goal: 10 }),
    },
    perfectHarvest: {
        name: "Perfect Harvest", icon: "&#127806;", tier: "major",
        how: "Complete a full year with food never dropping below 50% of its cap.",
        reward: "Creatures eat 2% less food.",
        check: () => (_achStats().daysFoodAbove50 || 0) >= 120,
        progress: () => ({ cur: _achStats().daysFoodAbove50 || 0, goal: 120 }),
    },
    essenceSommelier: {
        name: "Essence Sommelier", icon: "&#127863;", tier: "major",
        how: "Fill your Awakening essence reservoir (500+ capacity) 1,000 times.",
        reward: "Essence overflow spills 1% into your lowest Awakening resource.",
        check: () => (_achLife().reservoirFills || 0) >= 1000,
        progress: () => ({ cur: _achLife().reservoirFills || 0, goal: 1000 }),
    },
    lorekeeper: {
        name: "Lorekeeper", icon: "&#128218;", tier: "major",
        how: "Hold lore at its cap for 10 years (1,200 days) without spending any on research. Dipping below cap or researching resets the count.",
        reward: "Scriptoriums produce 5% more lore.",
        check: () => (_achStats().daysAtLoreCap || 0) >= 1200,
        progress: () => ({ cur: _achStats().daysAtLoreCap || 0, goal: 1200 }),
    },
    chronicler: {
        name: "Chronicler", icon: "&#128214;", tier: "major",
        how: "Witness 500 random events across your account.",
        reward: "Random events occur 5% more often.",
        check: () => (_achLife().eventsWitnessed || 0) >= 500,
        progress: () => ({ cur: _achLife().eventsWitnessed || 0, goal: 500 }),
    },
    boneCollector: {
        name: "Bone Collector", icon: "&#129460;", tier: "major",
        how: "Produce 10,000 bones across your account.",
        reward: "Bones storage cap +100 and Hunting Lodges produce 5% more.",
        check: () => (_achLife().bonesProduced || 0) >= 10000,
        progress: () => ({ cur: Math.floor(_achLife().bonesProduced || 0), goal: 10000 }),
    },
    mithrilTouch: {
        name: "Mithril Touch", icon: "&#9889;", tier: "major",
        how: "Craft 10 mithril across your account.",
        research: "gleamingTools",
        check: () => (_achLife().mithrilProduced || 0) >= 10,
        progress: () => ({ cur: Math.floor(_achLife().mithrilProduced || 0), goal: 10 }),
    },
    repeatCustomer: {
        name: "Repeat Customer", icon: "&#128213;", tier: "major",
        how: "Sign the Devil's Contract 10 times.",
        reward: "Amnizu extends a line of credit: +10% Quintessence (minimum +1) on every prestige.",
        check: () => (_achLife().contractsSigned || 0) >= 10,
        progress: () => ({ cur: _achLife().contractsSigned || 0, goal: 10 }),
    },

    // ── Major — hidden Mastery research unlocks ──────────────────────────────

    deepMiner: {
        name: "Deep Miner", icon: "&#9936;", tier: "major",
        how: "Produce 100,000 stone across your account.",
        research: "veinSense",
        check: () => (_achLife().stoneProduced || 0) >= 100000,
        progress: () => ({ cur: Math.floor(_achLife().stoneProduced || 0), goal: 100000 }),
    },
    beastOfBurden: {
        name: "Beast of Burden", icon: "&#128014;", tier: "major",
        how: "Manually gather 10,000 times across your account.",
        research: "ergonomicTools",
        check: () => (_achLife().manualGathers || 0) >= 10000,
        progress: () => ({ cur: _achLife().manualGathers || 0, goal: 10000 }),
    },
    masterMason: {
        name: "Master Mason", icon: "&#127959;", tier: "major",
        how: "Construct 1,000 buildings across your account.",
        research: "modularFoundations",
        check: () => (_achLife().buildingsConstructed || 0) >= 1000,
        progress: () => ({ cur: _achLife().buildingsConstructed || 0, goal: 1000 }),
    },
    silkRoad: {
        name: "Silk Road", icon: "&#129525;", tier: "major",
        how: "Sell 10,000 silk through trade routes across your account.",
        research: "gossamerLedgers",
        check: () => (_achLife().silkSold || 0) >= 10000,
        progress: () => ({ cur: Math.floor(_achLife().silkSold || 0), goal: 10000 }),
    },
    goldenHoard: {
        name: "Golden Hoard", icon: "&#128142;", tier: "major",
        how: "Establish the gold standard (research Gold Standard).",
        research: "compoundInterest",
        check: () => !!(gameState.research && gameState.research.goldStandard),
    },
    weathered: {
        name: "Weathered", icon: "&#127788;", tier: "major",
        how: "Survive 25 Winters across your account.",
        research: "almanacOfFrost",
        check: () => (_achLife().wintersSurvived || 0) >= 25,
        progress: () => ({ cur: _achLife().wintersSurvived || 0, goal: 25 }),
    },
    ichorAlchemist: {
        name: "Ichor Alchemist", icon: "&#129514;", tier: "major",
        how: "Produce 500 ichor across your account.",
        research: "vileDistillation",
        check: () => (_achLife().ichorProduced || 0) >= 500,
        progress: () => ({ cur: Math.floor(_achLife().ichorProduced || 0), goal: 500 }),
    },
    runesmith: {
        name: "Runesmith", icon: "&#5794;", tier: "major",
        how: "Produce 1,000 runes across your account.",
        research: "wardingScript",
        check: () => (_achLife().runesProduced || 0) >= 1000,
        progress: () => ({ cur: Math.floor(_achLife().runesProduced || 0), goal: 1000 }),
    },
    comparativeTheology: {
        name: "Comparative Theology", icon: "&#128330;", tier: "major",
        how: "Reach the highest favor tier with three different deities.",
        research: "ecumenicalRites",
        check: () => (_achLife().deitiesMaxFavor || []).length >= 3,
        progress: () => ({ cur: (_achLife().deitiesMaxFavor || []).length, goal: 3 }),
    },
    belovedKeeper: {
        name: "Beloved Keeper", icon: "&#128150;", tier: "major",
        how: "Hold morale at 90 or above for a full year (120 consecutive days).",
        research: "songsOfTheDeep",
        check: () => (_achStats().daysMorale90 || 0) >= 120,
        progress: () => ({ cur: _achStats().daysMorale90 || 0, goal: 120 }),
    },
};

// Display order — minors first within their section, majors in design order.
const ACH_ORDER = {
    minor: [
        'firstFootprints', 'standingRoomOnly', 'theLongWinter', 'fullLarder', 'cottageIndustry',
        'copperToSilver', 'merchantPrince', 'devout', 'apostate', 'oldGodsNewGods',
        'homebody', 'wanderer', 'againstAllOdds', 'menagerie', 'timeThief',
        'deepRoots', 'eyewitness', 'clickingIntensifies', 'quintessential', 'inkStillWet',
    ],
    major: [
        'greenThumb', 'stonecuttersEye', 'packrat', 'firstFrost', 'festivalOfPlenty',
        'haggler', 'fatPurse', 'titheAndTaxes', 'chosenVessel', 'landlord',
        'moraleOfficer', 'nightShift', 'cartographer', 'perfectHarvest', 'essenceSommelier',
        'lorekeeper', 'chronicler', 'boneCollector', 'mithrilTouch', 'repeatCustomer',
        'deepMiner', 'beastOfBurden', 'masterMason', 'silkRoad', 'goldenHoard',
        'weathered', 'ichorAlchemist', 'runesmith', 'comparativeTheology', 'belovedKeeper',
    ],
};

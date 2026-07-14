// data/dungeonRooms.js
//
// Dungeon Core combat rooms — the "Monsters" sub-tab (alongside Projects) in
// the Dungeon tab. Purchased/leveled exactly like Settlement buildings (see
// data/rooms.js) — count-based ownership, cost * costScale^owned — rather
// than Projects' 0-100% cycle model, since each room needs many independent
// instances stacking flat contributions, not one repeatable cycle.
//
// Every room has a fixed mechanical `statType`: "power" (physical),
// "arcane" (magical), "intelligence", or null (Treasure — no combat type).
// statType never changes; only the display name/flavor does, per founding
// race, via DUNGEON_ROOM_SKINS (see data/dungeonRoomSkins.js).
//
// Treasure rooms contribute to Glory (gloryValue). Combat rooms (traps and
// dens) contribute to their stat's dungeon pool (statValue, summed across all
// owned rooms of that type — same additive-pool convention as
// allProductionBonus, not multiplicative cost-style stacking).
//
// Only the "power" tree includes dens (monsterCapacity/regenDays) in v1 —
// "arcane" and "intelligence" are pure trap/puzzle trees with no live
// monsters to spawn or regenerate; a breach still damages them into the same
// repair cooldown (see resolveDailyRaid in game.js), they just have nothing
// to regenerate afterward.
//
// Every combat room (all 12, across all three trees) has an `ammo` cost —
// existing resources consumed per raid the room participates in, same shape
// as a converter's `inputs` (data/rooms.js). Power rooms draw Bones (the
// mechanism/monster-sustenance angle — echoes still need feeding) and Food
// (upkeep for the den's living echoes); Arcane rooms draw Arcane Dust/Lore/
// Arcane Essence; Intelligence rooms draw Runes only (resetting the puzzle/
// maintaining the inscribed mechanism — deliberately not Lore, which is the
// player's research currency and shouldn't compete with an ongoing combat
// upkeep cost). If a room's ammo can't be paid in full, it still participates
// in the raid at reduced effect proportional to how much of its ammo was
// actually available (mirrors the converter input-shortfall ratio in the
// tick() conversion loop, game.js:3091-3124).
//
// Gating: checkUnlock() (game.js:4336) reads a building's OWN `unlock` (count
// prereqs) and `requiresResearch` fields directly — a research node's
// `effects.unlockBuildings` is display-only tooltip text (see
// _researchEffectLines, game.js:2392), it does not itself gate anything. Every
// room below carries exactly one requiresResearch tier gate — temptTheGreedy
// (base tier), deepenTheEcho (mid tier), or perfectTheEcho (capstone tier) —
// matching what data/research.js's chain claims to unlock. awakenTheEcho
// itself gates nothing directly; it's a prerequisite of temptTheGreedy, so
// every room is transitively gated behind it too.

const DUNGEON_ROOMS = {

    // ── Treasure — untyped, generates Glory ─────────────────────────────────────

    glitteringHoard: {
        name: "Glittering Hoard",
        desc: "A heap of coin and gemstone left deliberately visible. Word travels.",
        cost: { coins: 400, stone: 100 },
        costScale: 1.2,
        statType: null,
        glory: 3,
        requiresResearch: ["temptTheGreedy"],
    },
    baitVault: {
        name: "Bait Vault",
        desc: "A vault built to look breakable. It draws bigger, greedier parties — and pays out more when they don't leave alive.",
        cost: { coins: 1200, iron: 150, mithril: 5 },
        costScale: 1.22,
        statType: null,
        glory: 8,
        pureSoulsBonusOnKill: 0.5, // multiplies the base Pure Souls drop chance on a kill this room helped bait
        unlock: { glitteringHoard: 3 },
        requiresResearch: ["temptTheGreedy"],
    },

    // ── Physical Power (4) — the one tree with live monster dens in v1 ──────────

    spikeCorridor: {
        name: "Spike Corridor",
        desc: "A narrow hall lined with pressure plates and old iron. Cheap, brutal, reliable.",
        cost: { stone: 150, iron: 40 },
        costScale: 1.18,
        statType: "power",
        statValue: 4,
        ammo: { bones: 0.5 },
        repairDays: 2,
        requiresResearch: ["temptTheGreedy"],
    },
    crusherGate: {
        name: "Crusher Gate",
        desc: "A slab of stone on a hair trigger, built to fall on whatever is standing beneath it.",
        cost: { stone: 400, iron: 120, steel: 40 },
        costScale: 1.2,
        statType: "power",
        statValue: 10,
        ammo: { bones: 1 },
        repairDays: 4,
        unlock: { spikeCorridor: 3 },
        requiresResearch: ["deepenTheEcho"],
    },
    echoDen: {
        name: "Echo Den",
        desc: "A hollow shaped by the Core's memory of the founding race. Something answers, wearing their form.",
        cost: { stone: 300, ichor: 15 },
        costScale: 1.2,
        statType: "power",
        statValue: 8,
        monsterCapacity: 3,
        regenDays: 3,
        ammo: { food: 1.5, bones: 0.5 },
        repairDays: 3,
        requiresResearch: ["deepenTheEcho"],
    },
    bruteSanctum: {
        name: "Brute Sanctum",
        desc: "A deeper hollow, carved for echoes with more of the founders' strength — and more of their memory of violence.",
        cost: { stone: 900, mithril: 20, ichor: 40 },
        costScale: 1.25,
        statType: "power",
        statValue: 18,
        monsterCapacity: 5,
        regenDays: 5,
        ammo: { food: 2.5, bones: 1 },
        repairDays: 5,
        unlock: { echoDen: 2 },
        requiresResearch: ["perfectTheEcho"],
    },

    // ── Arcane / Magical Power (4) — escalating traps, no spawners in v1 ────────

    runeWard: {
        name: "Rune Ward",
        desc: "A warded threshold that burns Arcane Dust to loose a single, ugly bolt of force.",
        cost: { stone: 100, arcaneDust: 30 },
        costScale: 1.18,
        statType: "arcane",
        statValue: 4,
        ammo: { arcaneDust: 0.5 }, // consumed per raid this room participates in
        repairDays: 2,
        requiresResearch: ["temptTheGreedy"],
    },
    hexLattice: {
        name: "Hex Lattice",
        desc: "Interlocking sigils that draw down more Lore than a single ward should need.",
        cost: { stone: 250, arcaneDust: 60, lore: 40 },
        costScale: 1.2,
        statType: "arcane",
        statValue: 10,
        ammo: { arcaneDust: 1, lore: 0.5 },
        repairDays: 4,
        unlock: { runeWard: 3 },
        requiresResearch: ["deepenTheEcho"],
    },
    wardstoneNexus: {
        name: "Wardstone Nexus",
        desc: "A knot of wardstones tuned to feed on each other, each one hungrier than the last.",
        cost: { stone: 500, arcaneEssence: 30, lore: 90 },
        costScale: 1.22,
        statType: "arcane",
        statValue: 16,
        ammo: { arcaneDust: 1.5, lore: 1 },
        repairDays: 5,
        unlock: { hexLattice: 2 },
        requiresResearch: ["perfectTheEcho"],
    },
    sigilOfBinding: {
        name: "Sigil of Binding",
        desc: "A single, patient sigil built to unmake whatever crosses it. The strongest ward the Core knows how to draw.",
        cost: { stone: 900, arcaneEssence: 80, mithril: 15, lore: 150 },
        costScale: 1.25,
        statType: "arcane",
        statValue: 26,
        ammo: { arcaneDust: 2, arcaneEssence: 0.5, lore: 1.5 },
        repairDays: 6,
        unlock: { wardstoneNexus: 2 },
        requiresResearch: ["perfectTheEcho"],
    },

    // ── Intelligence (4) — classic puzzle rooms, no spawners in v1 ──────────────

    puzzleLock: {
        name: "Puzzle Lock",
        desc: "A door that only opens for the correctly-turned sequence. Most parties get it wrong at least once.",
        cost: { stone: 100, bricks: 40 },
        costScale: 1.18,
        statType: "intelligence",
        statValue: 4,
        ammo: { runes: 0.5 },
        repairDays: 2,
        requiresResearch: ["temptTheGreedy"],
    },
    mirrorMaze: {
        name: "Mirror Maze",
        desc: "A hall of reflections tuned just enough that no two turns look the same twice.",
        cost: { stone: 250, crystals: 60 },
        costScale: 1.2,
        statType: "intelligence",
        statValue: 10,
        ammo: { runes: 1 },
        repairDays: 4,
        unlock: { puzzleLock: 3 },
        requiresResearch: ["deepenTheEcho"],
    },
    weighingScales: {
        name: "The Weighing Scales",
        desc: "A logic-room disguised as a vault: the right answer opens the door, the wrong one seals it.",
        cost: { stone: 500, runes: 60, lore: 90 },
        costScale: 1.22,
        statType: "intelligence",
        statValue: 16,
        ammo: { runes: 1.5 },
        repairDays: 5,
        unlock: { mirrorMaze: 2 },
        requiresResearch: ["perfectTheEcho"],
    },
    sphinxsRiddle: {
        name: "The Sphinx's Riddle",
        desc: "A riddle-room built around a single unanswerable question. Most who solve it wish they hadn't.",
        cost: { stone: 900, runes: 120, mithril: 15, lore: 150 },
        costScale: 1.25,
        statType: "intelligence",
        statValue: 26,
        ammo: { runes: 2 },
        repairDays: 6,
        unlock: { weighingScales: 2 },
        requiresResearch: ["perfectTheEcho"],
    },
};

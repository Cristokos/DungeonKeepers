// data/dungeonRoomSkins.js
//
// Per-race display skins for DUNGEON_ROOMS (data/dungeonRooms.js). Room
// mechanical IDs, stats, and costs never change — only the name/flavor text
// shown to the player does, resolved from the founding race's creature TYPE
// (e.g. "Undead", "Goblinoid" — see CREATURE_ROSTER in game.js), not the
// individual creature name, since there are 100+ individual creatures but
// only ~24 types. getDungeonRoomDisplay(roomId, raceName) in game.js looks up
// RACE_DATA[raceName].tagLabel to find the type key here, falling back to the
// room's own base name/desc in DUNGEON_ROOMS if the type has no entry below.
//
// Only rooms whose flavor meaningfully changes by type are listed per type;
// omitted room ids simply fall back to their DUNGEON_ROOMS base text.

const DUNGEON_ROOM_SKINS = {
    Undead: {
        echoDen:       { name: "Barrow Hollow",   desc: "A cold recess where the Core's memory of the dead lingers longest. Something rises, wearing old bones." },
        bruteSanctum:  { name: "Charnel Sanctum",  desc: "A deeper barrow, thick with the memory of things that would not stay buried." },
        runeWard:      { name: "Grave Ward",       desc: "A threshold marked in bone-ash, tuned to a cold that has nothing to do with the air." },
        puzzleLock:    { name: "Wailing Lock",     desc: "A sealed crypt door that answers only to the correctly-spoken names of the dead." },
    },
    Goblinoid: {
        echoDen:       { name: "Warren Den",       desc: "A cramped burrow full of the Core's memory of goblinoid cunning and numbers." },
        bruteSanctum:  { name: "Warlord's Sanctum", desc: "A deeper warren shaped around the memory of a chieftain's brutality." },
        spikeCorridor: { name: "Snare Pit",         desc: "A crude, cheerful hallway of pits, snares, and things that swing." },
        puzzleLock:    { name: "Trickster's Lock",  desc: "A door rigged with a goblinoid sense of humor — the 'obvious' answer is always wrong." },
    },
    Draconic: {
        echoDen:       { name: "Wyrmling Roost",   desc: "A rocky hollow where the Core's memory of scale and fire takes shape." },
        bruteSanctum:  { name: "Drake's Hoard-Hall",desc: "A deeper roost, thick with the memory of a hoarding, territorial rage." },
        runeWard:      { name: "Cinder Vent",       desc: "A scorched threshold that breathes a memory of dragonfire on a trigger." },
        sigilOfBinding:{ name: "Wyrmward Sigil",    desc: "A sigil scaled like old dragonhide, built to unmake whatever crosses it." },
    },
    Ooze: {
        echoDen:       { name: "Seep Chamber",     desc: "A damp recess where the Core's memory of ooze and appetite pools and waits." },
        bruteSanctum:  { name: "Corrosive Sanctum", desc: "A deeper chamber, its walls slowly dissolving under the memory of acid." },
        spikeCorridor: { name: "Dissolving Floor",  desc: "A hallway that remembers being solid ground, and isn't anymore." },
    },
    Fiend: {
        echoDen:       { name: "Brimstone Den",    desc: "A scorched hollow where the Core's memory of fiendish cruelty takes form." },
        bruteSanctum:  { name: "Infernal Sanctum",  desc: "A deeper den, thick with the memory of contracts signed in bad faith." },
        sigilOfBinding:{ name: "Pact-Sigil",        desc: "A binding sigil drawn the way devils draw contracts — technically fair, brutally unkind." },
    },
    Fey: {
        echoDen:       { name: "Glamour Glade",    desc: "A hollow that isn't quite where it looks like it is — the Core's memory of fey mischief." },
        bruteSanctum:  { name: "Wild Hunt Sanctum", desc: "A deeper glade, thick with the memory of a hunt that never really ends." },
        mirrorMaze:    { name: "Glamoured Maze",    desc: "A hall of reflections that lie pleasantly and often." },
        sphinxsRiddle: { name: "The Fey Bargain",   desc: "A riddle-room built the way fey make deals: technically answerable, never safely." },
    },
    Aberration: {
        echoDen:       { name: "Warped Hollow",    desc: "A hollow that doesn't sit right in three dimensions — the Core's memory of aberrant minds." },
        bruteSanctum:  { name: "Deep Sanctum",      desc: "A deeper warp, thick with the memory of something that thinks in angles you don't have." },
        mirrorMaze:    { name: "Non-Euclidean Maze",desc: "A hall of turns that shouldn't connect the way they do." },
    },
    Elemental: {
        echoDen:       { name: "Elemental Font",   desc: "A hollow where the Core's memory of raw elemental force churns and settles." },
        bruteSanctum:  { name: "Primal Sanctum",    desc: "A deeper font, thick with the memory of a force that was never meant to hold still." },
        runeWard:      { name: "Elemental Vent",    desc: "A threshold that vents whichever element the founders remembered best." },
    },
    Humanoid: {
        echoDen:       { name: "Militia Hall",     desc: "A drilled, orderly hollow — the Core's memory of humanoid discipline given shape." },
        bruteSanctum:  { name: "Garrison Sanctum",  desc: "A deeper hall, thick with the memory of trained, coordinated violence." },
        puzzleLock:    { name: "Guild Lock",        desc: "A door secured the way humanoid guilds secure things: bureaucratically, and well." },
    },
};

// Rooms whose base DUNGEON_ROOMS entry is used as the fallback when a race's
// creature type has no explicit override above (every type, every room id).
function getDungeonRoomDisplay(roomId, raceName) {
    const base = DUNGEON_ROOMS[roomId];
    if (!base) return null;
    const type = (typeof RACE_DATA !== 'undefined' && RACE_DATA[raceName] && RACE_DATA[raceName].tagLabel) || null;
    const skin = type && DUNGEON_ROOM_SKINS[type] && DUNGEON_ROOM_SKINS[type][roomId];
    return {
        name: (skin && skin.name) || base.name,
        desc: (skin && skin.desc) || base.desc,
    };
}

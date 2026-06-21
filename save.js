// save.js

const SAVE_KEY = "dungeonKeeperSave";

// Maximum offline time that can be banked (8 hours in seconds)
const OFFLINE_BANK_CAP = 8 * 60 * 60;

function saveGame() {
    gameState.lastSeen = Date.now();
    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(gameState)
    );
}

function loadGame() {
    const saveData = localStorage.getItem(SAVE_KEY);
    if (!saveData) return;

    Object.assign(gameState, JSON.parse(saveData));

    // Bank offline seconds (up to 8 hrs) into the accel bank
    if (gameState.lastSeen) {
        const offlineSec = Math.floor((Date.now() - gameState.lastSeen) / 1000);
        const toBank     = Math.min(offlineSec, OFFLINE_BANK_CAP);
        if (toBank > 0) {
            gameState.pauseBank = (gameState.pauseBank || 0) + toBank;
        }
    }
    gameState.lastSeen = Date.now();
}
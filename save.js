// save.js

const SAVE_KEY = "dungeonKeeperSave";

function saveGame() {
    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(gameState)
    );
}

function loadGame() {

    const saveData =
        localStorage.getItem(SAVE_KEY);

    if (!saveData) return;

    Object.assign(
        gameState,
        JSON.parse(saveData)
    );
}
// game.js

const gameState = {

    resources: {
        food: 0,
        wood: 0,
        stone: 0
    },

    rooms: {
        nest: 0
    }
};

// -----------------------------
// RESOURCE GATHERING
// -----------------------------

function gatherFood() {
    gameState.resources.food += 1;
    updateUI();
}

function gatherWood() {
    gameState.resources.wood += 1;
    updateUI();
}

function gatherStone() {
    gameState.resources.stone += 1;
    updateUI();
}

// -----------------------------
// ROOM SYSTEM
// -----------------------------

function buildNest() {

    const woodCost = 10;
    const stoneCost = 5;

    if (
        gameState.resources.wood >= woodCost &&
        gameState.resources.stone >= stoneCost
    ) {
        gameState.resources.wood -= woodCost;
        gameState.resources.stone -= stoneCost;

        gameState.rooms.nest += 1;

        updateUI();
    }
}

// -----------------------------
// GAME LOOP
// -----------------------------

function gameLoop() {

    const nests = gameState.rooms.nest;

    gameState.resources.food += 1 + (nests * 2);

    updateUI();
}

// -----------------------------
// UI UPDATE
// -----------------------------

function updateUI() {

    document.getElementById("food").textContent =
        Math.floor(gameState.resources.food);

    document.getElementById("wood").textContent =
        Math.floor(gameState.resources.wood);

    document.getElementById("stone").textContent =
        Math.floor(gameState.resources.stone);

    document.getElementById("nestCount").textContent =
        gameState.rooms.nest;
}

// -----------------------------
// SCREEN SYSTEM
// -----------------------------

function showScreen(screenName) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(s => {
        s.classList.remove("active");
    });

    document
        .getElementById("screen-" + screenName)
        .classList.add("active");

    updateTabs(screenName);
}

function updateTabs(active) {

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    tabs.forEach(tab => {
        if (tab.textContent.toLowerCase() === active) {
            tab.classList.add("active");
        }
    });
}

// -----------------------------
// INIT
// -----------------------------

window.onload = () => {

    loadGame();
    updateUI();

    setInterval(gameLoop, 1000);
    setInterval(saveGame, 5000);

    showScreen("overview");
};
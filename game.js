const seasons = ["Spring", "Summer", "Autumn", "Winter"];

const gameState = {

    resources: {
        food: 0,
        wood: 0,
        stone: 0
    },

    caps: {
        food: 100,
        wood: 100,
        stone: 100
    },

    rooms: {
        nest: 0,
        storage: 0
    },

    time: {
        day: 1,
        year: 1,
        seasonIndex: 0
    }
};

// --------------------
// GATHER
// --------------------

function gather(resource) {

    if (gameState.resources[resource] < gameState.caps[resource]) {
        gameState.resources[resource]++;
    }

    updateUI();
}

function gatherFood() { gather("food"); }
function gatherWood() { gather("wood"); }
function gatherStone() { gather("stone"); }

// --------------------
// BUILDINGS
// --------------------

function buildNest() {

    if (gameState.resources.wood >= 10 &&
        gameState.resources.stone >= 5) {

        gameState.resources.wood -= 10;
        gameState.resources.stone -= 5;

        gameState.rooms.nest++;

        updateUI();
    }
}

function buildStorage() {

    if (gameState.resources.wood >= 20) {
        gameState.resources.wood -= 20;

        gameState.rooms.storage++;

        gameState.caps.food += 50;
        gameState.caps.wood += 50;
        gameState.caps.stone += 50;

        updateUI();
    }
}

// --------------------
// GAME LOOP
// --------------------

function gameLoop() {

    const nestBonus = gameState.rooms.nest * 2;

    gameState.resources.food =
        Math.min(gameState.caps.food,
            gameState.resources.food + 1 + nestBonus);

    gameState.time.day++;

    if (gameState.time.day % 10 === 0) {
        gameState.time.seasonIndex++;
    }

    if (gameState.time.seasonIndex >= 4) {
        gameState.time.seasonIndex = 0;
        gameState.time.year++;
    }

    updateUI();
}

// --------------------
// UI
// --------------------

function updateUI() {

    updateResource("food");
    updateResource("wood");
    updateResource("stone");

    document.getElementById("nestCount").textContent =
        gameState.rooms.nest;

    document.getElementById("storageCount").textContent =
        gameState.rooms.storage;

    document.getElementById("day").textContent =
        gameState.time.day;

    document.getElementById("year").textContent =
        gameState.time.year;

    document.getElementById("season").textContent =
        seasons[gameState.time.seasonIndex];
}

function updateResource(name) {

    const value = gameState.resources[name];
    const cap = gameState.caps[name];

    document.getElementById(name).textContent = value;
    document.getElementById(name + "Cap").textContent = cap;

    const line = document.getElementById(name + "Line");

    if (value >= cap) {
        line.classList.add("full");
    } else {
        line.classList.remove("full");
    }
}

// --------------------
// SCREEN SYSTEM
// --------------------

function showScreen(name) {

    document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));

    document.getElementById(name).classList.add("active");

    document.querySelectorAll(".tab")
        .forEach(t => t.classList.remove("active"));

    event.target.classList.add("active");
}

// --------------------
// INIT
// --------------------

window.onload = () => {

    loadGame();

    updateUI();

    setInterval(gameLoop, 1000);
    setInterval(saveGame, 5000);

    showScreen("overview");
};
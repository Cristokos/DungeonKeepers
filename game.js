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

    buildings: {
        farm: 0,
        lumber: 0,
        quarry: 0,
        storage: 0
    },

    time: {
        day: 1,
        year: 1,
        seasonIndex: 0
    }
};

/* -----------------------
   BUILDING DEFINITIONS
------------------------*/

const buildings = {

    farm: {
        cost: { wood: 10 },
        produces: { food: 2 }
    },

    lumber: {
        cost: { wood: 10 },
        produces: { wood: 2 }
    },

    quarry: {
        cost: { wood: 10 },
        produces: { stone: 2 }
    },

    storage: {
        cost: { wood: 20 },
        effect: () => {
            gameState.caps.food += 50;
            gameState.caps.wood += 50;
            gameState.caps.stone += 50;
        }
    }
};

/* -----------------------
   AFFORD CHECK
------------------------*/

function canAfford(building) {
    const cost = buildings[building].cost;
    for (let res in cost) {
        if (gameState.resources[res] < cost[res]) return false;
    }
    return true;
}

/* -----------------------
   BUILD SYSTEM
------------------------*/

function build(type) {

    if (!canAfford(type)) return;

    const cost = buildings[type].cost;

    for (let res in cost) {
        gameState.resources[res] -= cost[res];
    }

    gameState.buildings[type]++;

    if (buildings[type].effect) {
        buildings[type].effect();
    }

    updateUI();
}

/* -----------------------
   LOOP
------------------------*/

function gameLoop() {

    for (let b in gameState.buildings) {
        const def = buildings[b];
        if (!def || !def.produces) continue;

        for (let res in def.produces) {
            gameState.resources[res] = Math.min(
                gameState.caps[res],
                gameState.resources[res] + def.produces[res] * gameState.buildings[b]
            );
        }
    }

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

/* -----------------------
   UI UPDATE
------------------------*/

function updateUI() {

    document.getElementById("food").textContent = gameState.resources.food;
    document.getElementById("wood").textContent = gameState.resources.wood;
    document.getElementById("stone").textContent = gameState.resources.stone;

    document.getElementById("foodCap").textContent = gameState.caps.food;
    document.getElementById("woodCap").textContent = gameState.caps.wood;
    document.getElementById("stoneCap").textContent = gameState.caps.stone;

    document.getElementById("farmCount").textContent = gameState.buildings.farm;
    document.getElementById("lumberCount").textContent = gameState.buildings.lumber;
    document.getElementById("quarryCount").textContent = gameState.buildings.quarry;
    document.getElementById("storageCount").textContent = gameState.buildings.storage;

    document.getElementById("day").textContent = gameState.time.day;
    document.getElementById("year").textContent = gameState.time.year;
    document.getElementById("season").textContent = seasons[gameState.time.seasonIndex];

    updateButtons();
}

/* -----------------------
   BUTTON STATE SYSTEM
------------------------*/

function updateButtons() {

    for (let id in buildings) {

        const btn = document.querySelector(`[onclick="build('${id}')"]`);
        if (!btn) continue;

        if (canAfford(id)) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }
    }
}

/* -----------------------
   INIT
------------------------*/

window.onload = () => {
    loadGame();
    updateUI();
    setInterval(gameLoop, 1000);
};
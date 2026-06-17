// game.js

const gameState = {

    resources: {
        food: 0,
        wood: 0,
        stone: 0
    }

};

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

function updateUI() {

    document.getElementById("food")
        .textContent =
        gameState.resources.food;

    document.getElementById("wood")
        .textContent =
        gameState.resources.wood;

    document.getElementById("stone")
        .textContent =
        gameState.resources.stone;
}

function gameLoop() {

    gameState.resources.food += 1;

    updateUI();
}

window.onload = () => {

    loadGame();

    updateUI();

    setInterval(gameLoop, 1000);

    setInterval(saveGame, 5000);
};
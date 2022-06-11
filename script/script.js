"use strict";



/** @param {Event} event @returns {void}*/
const clickHandler = (event) => {
    event.stopPropagation();
    const clickedItem = /** @type {HTMLElement} */ (event.target);

    if (!clickedItem.classList.contains("cell") || clickedItem.classList.contains("opened")) return;
    if (clickedItem.classList.contains("mine")) {
        clickedItem.classList.add("explosion");
        gameOver();
        return;
    }
    clickedItem.classList.add("opened");
    clickedItem.classList.remove("flag", "hidden");

    if (clickedItem.classList.contains("neighbor")) {
        clickedItem.innerHTML = clickedItem.dataset.minesAround;
    } else {
        clickedItem.classList.add("expand");
        openEmptyArea();
    }

    checkIfWin();
};

/** @param {Event} event @returns {void}*/
const dblClickHandler = (event) => {
    event.stopPropagation();

    const clickedItem = /** @type {HTMLElement} */ (event.target);
    if (clickedItem.classList.contains("opened") && clickedItem.classList.contains("neighbor")) {
        if (calculateNearbyItems(clickedItem, "mine") !== calculateNearbyItems(clickedItem, "flag")) {
            return;
        } else {
            openNearbyWithFlags(clickedItem);
        }
    }
    checkIfWin();
};

/** @param {Event} event @returns {void}*/
const rightClickHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const clickedItem = /** @type {HTMLElement} */ (event.target);

    if (!clickedItem.classList.contains("cell") || clickedItem.classList.contains("opened")) return;
    if (
        flagsSet.length < NUMBER_OF_BOMBS ||
        (flagsSet.length === NUMBER_OF_BOMBS && clickedItem.classList.contains("flag"))
    ) {
        clickedItem.classList.toggle("flag");
    }
    refreshFlagsNumber();
    checkIfWin();
};

/** @param {Event} event @returns {void}*/
const preventContextDefault = (event) => {
    event.preventDefault();
};

/** @param {Event} event @returns {void}*/
const restartHandler = (event) => {
    startGame();
};

const enableField = () => {
    field.addEventListener("click", clickHandler);

    field.addEventListener("dblclick", dblClickHandler);

    field.addEventListener("contextmenu", rightClickHandler);

    field.addEventListener("contextmenu", preventContextDefault);

    restartBtn.addEventListener("click", restartHandler);
};

const startGame = () => {
    clearField();
    drawField();
    placeBombs();
    refreshFlagsNumber();
    assignClassToNeighbors();
    assignNumbersToAllNeighbors();
    enableField();
};

startGame();
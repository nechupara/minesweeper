"use strict";

const H_CELLS = 20;
const V_CELLS = 30;
const NUMBER_OF_BOMBS = Math.floor((H_CELLS * V_CELLS) / 6);

const field = /** @type {HTMLDivElement} */ (document.querySelector(".field"));
const drawField = () => {
    field.style.cssText = `display: grid;
                           grid-template-columns: repeat(${H_CELLS}, 1fr);
                           grid-template-rows: repeat(${V_CELLS}, 1fr);
    `;

    let cellIndex = 0;
    for (let rowNumber = 1; rowNumber <= V_CELLS; rowNumber++) {
        for (let colNumber = 1; colNumber <= H_CELLS; colNumber++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add("hidden");
            cell.dataset.index = cellIndex.toString();
            cellIndex++;
            field.append(cell);
        }
    }
};

const flagsSet = field.getElementsByClassName('flag')
const refreshFlagsNumber = ()=>{
    const flagsNumberField = document.querySelector('#flags')
}

const placeBombs = () => {
    const cells = /** @type {NodeListOf.<HTMLDivElement>} */ (field.querySelectorAll(".cell"));
    let bombsToPlace = NUMBER_OF_BOMBS;
    while (bombsToPlace) {
        const index = Math.floor(Math.random() * H_CELLS * V_CELLS);
        if (cells[index].classList.contains("mine")) continue;
        cells[index].classList.add("mine");
        bombsToPlace--;
    }
};

/** @param {number} index @returns {number}*/
const getRow = (index) => {
    return Math.floor(index / H_CELLS) + 1;
};

/** @param {number} index @returns {number}*/
const getCol = (index) => {
    return (index % H_CELLS) + 1;
};

/** @param {HTMLElement} elem @returns {Array.<HTMLElement>}*/

const getNeighborsElements = (elem) => {
    const index = +elem.dataset.index;
    // const row = getRow(index);
    const col = getCol(index);

    const indexList = [
        index - 1,
        index + 1,
        index - H_CELLS - 1,
        index - H_CELLS,
        index - H_CELLS + 1,
        index + H_CELLS + 1,
        index + H_CELLS,
        index + H_CELLS - 1,
    ];
    /** @type {Array.<HTMLElement>} */
    const elementsList = [];

    for (const i of indexList) {
        if (!(i < 0 || i >= V_CELLS * H_CELLS || Math.abs(col - getCol(i)) > 1)) {
            const nearbyCell = /** @type {HTMLElement} */ (field.querySelector(`[data-index='${i}']`));
            elementsList.push(nearbyCell);
        }
    }

    return elementsList;
};

const assignClassToNeighbors = () => {
    const mines = /** @type {NodeListOf.<HTMLElement>} */ (field.querySelectorAll(".mine"));
    mines.forEach((el) => {
        const neighborsList = getNeighborsElements(el);
        neighborsList.forEach((cell) => {
            if (!cell.classList.contains("neighbor") && !cell.classList.contains("mine")) {
                cell.classList.add("neighbor");
            }
        });
    });
};

/** @param {HTMLElement} elem @param {string} classItem  @returns {number}*/
const calculateNearbyItems = (elem, classItem) => {
    const listOfNeighbors = getNeighborsElements(elem);
    let amount = 0;
    for (const cell of listOfNeighbors) {
        if (cell.classList.contains(`${classItem}`)) {
            amount++;
        }
    }
    return amount;
};

const assignNumbersToAllNeighbors = () => {
    const neighborsOfMines = /** @type {NodeListOf.<HTMLElement>} */ (field.querySelectorAll(".neighbor"));
    for (const cell of neighborsOfMines) {
        const bobmsNearby = calculateNearbyItems(cell, "mine");
        cell.dataset.minesAround = bobmsNearby.toString();
    }
};

const openEmptyArea = () => {
    while (true) {
        const openedEmptyCells = /** @type {NodeListOf.<HTMLElement>} */ (field.querySelectorAll(".expand"));
        if (!openedEmptyCells.length) break;
        openedEmptyCells.forEach((cell) => {
            cell.classList.remove("expand");
            const neighborsIndexes = getNeighborsElements(cell);
            for (const neighborCell of neighborsIndexes) {
                if (neighborCell.classList.contains("opened") || neighborCell.classList.contains("mine")) {
                    continue;
                }
                if (!neighborCell.classList.contains("opened") && !neighborCell.classList.contains("neighbor")) {
                    neighborCell.classList.add("opened", "expand");
                    neighborCell.classList.remove("flag", "hidden");
                    continue;
                }
                if (neighborCell.classList.contains("neighbor")) {
                    neighborCell.innerHTML = neighborCell.dataset.minesAround;
                    neighborCell.classList.add("opened");
                    neighborCell.classList.remove("flag", "hidden");
                    continue;
                }
            }
        });
    }
};

const gameOver = () => {
    const mines = /** @type {HTMLElement} */ field.querySelectorAll(".mine:not(.explosion)");
    mines.forEach((el) => {
        el.classList.add("show-mine");
    });
};

/** @param {HTMLElement} elem @returns {void}*/
const openNearbyWithFlags = (elem) => {
    let isGameOver = false;
    const listOfNeighbors = getNeighborsElements(elem);
    for (const cell of listOfNeighbors) {
        if (cell.classList.contains("mine") && !cell.classList.contains("flag")) {
            if (!isGameOver) {
                cell.classList.add("explosion");
            }
            isGameOver = true;
        } else if (cell.classList.contains("flag") && !cell.classList.contains("mine")) {
            cell.classList.add("wrong-flag");
        }
    }

    if (isGameOver) {
        gameOver();
        return;
    }
    listOfNeighbors.forEach((cell) => {
        if (!cell.classList.contains("mine") && !cell.classList.contains("wrong-flag")) {
            cell.classList.add("opened");
            if (cell.classList.contains("neighbor")) {
                cell.innerText = cell.dataset.minesAround;
            }
        }
    });
};

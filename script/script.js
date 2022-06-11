"use strict";

drawField();
placeBombs();

assignClassToNeighbors();
assignNumbersToAllNeighbors();
// calculateNearbyMines();

field.addEventListener("click", (event) => {
    event.stopPropagation();
    const clickedItem = /** @type {HTMLElement} */ (event.target);

    if (!clickedItem.classList.contains("cell") || clickedItem.classList.contains("opened")) return;
    if (clickedItem.classList.contains("mine")) {
        clickedItem.classList.add('explosion')
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
});

field.addEventListener("dblclick", (event) => {
    event.stopPropagation();

    const clickedItem = /** @type {HTMLElement} */ (event.target);
    if (clickedItem.classList.contains("opened") && clickedItem.classList.contains("neighbor")) {
        if (calculateNearbyItems(clickedItem, "mine") !== calculateNearbyItems(clickedItem, "flag")) {
            return;
        } else {
            openNearbyWithFlags(clickedItem);
        }
    }
});

field.addEventListener("contextmenu", (event) => {
    event.stopPropagation();
    event.preventDefault();
    const clickedItem = /** @type {HTMLElement} */ (event.target);

    if (!clickedItem.classList.contains("cell")) return;
    if (!clickedItem.classList.contains("opened")) {
        clickedItem.classList.toggle("flag");
    }
});

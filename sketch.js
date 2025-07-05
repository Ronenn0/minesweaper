const container = document.querySelector('#container');
let mainSize = 15;
let containerSize;
let cells, maxBombs, bombsLeft;
let flag, timesClicked = 0, gameOver;
/* --------------------------------- */
function sketch() {
    setup();
}
sketch();
/* --------------------------------- */

function setup() {
    createEventListeners();
    updateContainerSize();
    maxBombs = Math.floor(Math.pow(mainSize, 2) * 2.5 / 9);
    bombsLeft = maxBombs;
    updateBombsLeft();
    container.innerHTML = '';
    const helperArray = [];
    cells = [];
    let currentBombsCounter = 0, i;
    for(i = 0; i < mainSize; i++) {
        const arr = [];
        for(let j = 0; j < mainSize; j++) {
            let cell = new Cell(i, j);
            if(currentBombsCounter < maxBombs && Math.random() < 0.2) {
                cell.bomb = true;
                currentBombsCounter++;
                cell.plantBomb();
            } else {
                helperArray.push(cell);
            }
            arr.push(cell);
            // cells.push(cell);
        }
        cells.push(arr);
    }
    for(i = 0; i < maxBombs - currentBombsCounter; i++) {
        helperArray.splice(randomIndex(helperArray), 1).pop().plantBomb();
    }
    doSomethingOnAllCells(cell => {
        if(!cell.bomb) {
            cell.calcBombsAround();
        }
    });
}


function updateContainerSize() {
    const minSize = 300;
    const width = innerWidth, height = innerHeight;
    const size = Math.max(Math.min(width, height) * 0.7, minSize);
    containerSize = size;
    const template = 'repeat(' + mainSize + ', ' + (containerSize / mainSize) + 'px)';
    container.style.gridTemplateColumns = template;
    container.style.gridTemplateRows = template;
    container.style.width = containerSize + 'px';
    container.style.height = containerSize + 'px';
}
function createEventListeners() {
    addEventListener('resize', updateContainerSize);
    const flagToggler = document.querySelector('#flagToggler');
    const bombToggler = document.querySelector('#bombToggler');
    const bombsAndFlagToggler = document.querySelector('#bombsAndFlagToggler');
    const targetBackground = 'var(--toggledBackground)';
    const lostFocusBackground = 'var(--lostFocusBackground)';
    addEventListener('keyup', e => {
        let key = e.key.toLowerCase();
        if(key == 'f') {
            if(!FlaggingFirst()) {
                clickingState(flagToggler);
            }
        } else if( key == 'b' || key == 'n') {
            clickingState(bombToggler);
        }
        // console.log(key);
    });
    bombsAndFlagToggler.addEventListener('click', e => {
        // console.log(e.target);
        clickingState(e.target);
    });
    function setBackground(element, backgroundColor) {
        element.style.backgroundColor = backgroundColor;
    }
    function clickingState(target) {
        target.style.backgroundColor = targetBackground;
        if(target == flagToggler) {
            if(!FlaggingFirst()) {
                setBackground(bombToggler, lostFocusBackground);
                flag = true;
            } else {
                setBackground(target, lostFocusBackground);
            }
        } else {
            setBackground(flagToggler, lostFocusBackground);
            flag = false;
        }
    }
}
function FlaggingFirst() {
    if(timesClicked == 0) {
        alert('first try will never be a bomb.');
        return true;
    }
}

function randomIndex(object) {
    return Math.floor(random(object.length));
}

function random(max) {
    return Math.random() * max;
}

function validIndeces(array, i, j) {
    return i >= 0 && i < array.length && j >= 0 && j < array[i].length;
}
function getColor(numberOfBombsAround) {
    switch(numberOfBombsAround) {
        case 1:
            return 'blue';
        case 2:
            return 'green'; 
        case 3:
            return 'red';
        case 4: 
        return 'darkblue';
        case 5:
            return 'rgb(100, 30, 30)';
        case 6:
            return 'rgb(53, 169, 189)';
        case 7:
            return 'black';
        case 8:
            return 'rgba(107, 107, 107, 0.7)';
    }
}

function includes(arrayOfIndeces, object) {
    for(let indeces of arrayOfIndeces) {
        if(indeces.i == object.i && indeces.j == object.j) {
            return true;
        }
    }
    return false;
}
function doSomethingOnAllCells(func) {
    cells.forEach(arr => {
        arr.forEach(cell => {
            func(cell);
        });
    });
}
function endGame() {
    gameOver = true;
    doSomethingOnAllCells(cell => {
        if(cell.bomb) {
            cell.showSelf([], false, true);
        }
    });
}
function updateBombsLeft() {
    const bombsLeftSpan = document.querySelector('#bombs #bombsLeft');
    bombsLeftSpan.textContent = bombsLeft;
}

function firstShot(cell) {
    if(timesClicked != 0) {
        return;
    }
    let amount = mainSize + Math.floor(random(11)), picked = cell;
    // if(cell.bomb) {
    //     cell.flagMe();
    //     cell.isFlagged = true;
    // }
    let bombsUnPlantedNumber = 0;
    for(let i = 0; i < amount; i++) {
        const pickFrom = [];
        picked.doSomethingOnNeighbors(neighbor => {
            let counter = 0;
            picked.doSomethingOnNeighbors(neighbor2 => {
                if(!neighbor2.isRevealed) {
                    counter++;
                }
            });
            if(neighbor && counter > 0) {
                pickFrom.push(neighbor);
            }
            if(neighbor.bomb) {
                neighbor.bomb = false;
                neighbor.calcBombsAround();
                bombsUnPlantedNumber++;
                neighbor.doSomethingOnNeighbors(otherNeighbor => {
                    if(!otherNeighbor.bomb && otherNeighbor.numberOfBombsAround > 0) {
                        otherNeighbor.numberOfBombsAround--;
                    }
                    otherNeighbor.reReveal();
                });
            } else {
                neighbor.showSelf(undefined);
            }
        });
        if(pickFrom.length > 0) {
            let index = randomIndex(pickFrom);
            picked = pickFrom[index];
            // console.log(picked, index, pickFrom.length);    
        }
        // else {
        //     picked = cells[randomIndex(cells)][randomIndex(cells[0])];
        //     console.log(picked);
        //     // break;
        // }
    }
    const notBombCells = [];
    doSomethingOnAllCells(cell => {
        if(!cell.bomb) {
            notBombCells.push(cell);
        }
    });
    for(let i = 0; i < bombsUnPlantedNumber; i++) {
        let current = notBombCells.splice(randomIndex(notBombCells), 1).pop();
        current.bomb = true;
        current.doSomethingOnNeighbors(neighbor => {
            if(current.i * 1500 + current.j != neighbor.i * 1500 + neighbor.j) {
                neighbor.numberOfBombsAround++;
                neighbor.reReveal();
            }
        });
        // console.log(current);
    }

    timesClicked++;


//     if(timesClicked != 0) {
//         return false;
//     }
//     let bombsUnPlantedNumber = 0;
//     for(let i = 0; i < 5; i++) {
//         const neighbors = [];
//         if(cell.bomb) {
//             bombsUnPlantedNumber++;
//             cell.bomb = false;
//         }
//         cell.doSomethingOnNeighbors((i, j) => {
//             if(validIndeces(cells, i, j)) {
//                 if(cells[i][j].bomb) {
//                     firstShot(cells[i][j]);
//                     //cell.numberOfBombsAround--;
//                 }
//                 else {
//                     if(cells[i][j].numberOfBombsAround > 0) {
//                         //cells[i][j].numberOfBombsAround--;
//                         if(cells[i][j].isRevealed) {
//                             cells[i][j].isRevealed = false;
//                             cells[i][j].self.innerHTML = '';
//                         }
//                     }
//                     cells[i][j].showSelf();
//                 }
//                 neighbors.push(cells[i][j]);
//             }
//         });
//         if(neighbors.length > 0) {
//             let index = randomIndex(neighbors);
//             cell = neighbors[index];
//         }
//         console.log(55);
//     }
//     const notBombCells = [];
//     doSomethingOnAllCells(cell => {
//         if(!cell.bomb) {
//             notBombCells.push(cell);
//         }
//     });
//     for(let i = 0; i < bombsUnPlantedNumber; i++) {
//         let current = notBombCells[randomIndex(notBombCells)];
//         current.bomb = true;
//         current.doSomethingOnNeighbors((i, j) => {
//             if(current.i * 1500 + current.j != i * 1500 + j) {
//                 cells[i][j].numberOfBombsAround++;
//             }
//         });
//         console.log(current);
//     }

//     timesClicked++;
//     return true;
}
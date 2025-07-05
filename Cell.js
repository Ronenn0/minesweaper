class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.numberOfBombsAround = 0;
        this.isFlagged = false;
        this.createSelf();
    }
    createSelf() {
        this.self = document.createElement('div');
        this.self.className = 'cell';
        this.self.addEventListener('click', () => {

            if(!firstShot(this)) {
                this.showSelf([{i: this.i, j: this.j}]);
            }
        });
        container.appendChild(this.self);
    }
    plantBomb() {
        this.bomb = true;
    }
    calcBombsAround() {
        this.numberOfBombsAround = 0;
        this.doSomethingOnNeighbors(neighbor => {
            if(neighbor.bomb) {
                this.numberOfBombsAround++;
            }
        });
    }
    showSelf(checked = [{i: this.i, j: this.j}], leaveBombs, revealingAll) {
        if(this.isRevealed || (leaveBombs && this.bomb)) {
            return;
        }
        // if(leaveBombs && this.bomb) {
        //     this.doSomethingOnNeighbors((i, j) => {
        //         if(this.i != i && this.j != j && validIndeces(cells, i, j)) {
        //             const currentIndeces = {i: i, j: j};
        //             if(cells[i][j].bomb && !includes(checked, currentIndeces)) {
        //                 checked.push(currentIndeces);
        //                 cells[i][j].showSelf(checked, leaveBombs);
        //             }
        //         }
        //     });
        //     return;
        // }

        if(flag) {
            if(this.isFlagged) {
                if(!gameOver) {
                    this.self.innerHTML = '';
                    bombsLeft++;
                    updateBombsLeft();    
                }
            } else {
                this.flagMe();
            }
            this.isFlagged = !this.isFlagged;
        } else if(!this.isFlagged) {
            this.self.classList.add('revealed');
            // this.self.style.border = '0';
            if(timesClicked == 0) {
                timesClicked++;
                this.numberOfBombsAround = 0;
                this.handleZeros(checked);
            }
            else if(this.bomb) {
                // if(leaveBombs) {
                //     this.flagMe();
                //     return;
                // }
                if(!revealingAll) {
                    this.self.style.backgroundColor = 'red';
                }
                this.self.innerHTML = 
                '<i class="fa fa-bomb"></i>';
                if(!gameOver) {
                    endGame();
                }
            } else if(!this.handleZeros(checked, true)) {
                const span = document.createElement('span');
                span.className = 'numberOfBombs';
                span.style.color = getColor(this.numberOfBombsAround);
                span.textContent = this.numberOfBombsAround;
                this.self.appendChild(span);
            }
            this.isRevealed = true;
            this.self.style.cursor = 'default';
        }
    }
    doSomethingOnNeighbors(func) {
        for(let col = -1; col < 2; col++) {
            for(let row = -1; row < 2; row++) {
                let i = this.i + col;
                let j = this.j + row;
                if(validIndeces(cells, i, j)) {
                    func(cells[i][j]);
                }
                // console.log('abc');
            }

        }
    }
    flagMe() {
        if(this.isFlagged || bombsLeft == 0) {
            return;
        }
        const flag = document.createElement('div');
        flag.className = 'bombFlag';
        this.self.appendChild(flag);
        bombsLeft--;
        updateBombsLeft();
    }
    handleZeros(checked) {
        if(this.numberOfBombsAround != 0) {
            return false;
        }
        // this.self.style.backgroundrowor = 'green';
        this.doSomethingOnNeighbors(cell => {
            const currentIndeces = {i: cell.i, j: cell.j};
            if (!includes(checked, currentIndeces)) {
                checked.push(currentIndeces);
                cell.showSelf(checked, true);
            }
        });
        return true;
    }
    reReveal() {
        if(this.isRevealed && !this.bomb) {
            this.isRevealed = false;
            this.self.innerHTML = '';
            this.showSelf();
        }
    }
    // validNeighbor(i, j) {
    //     const index = this.i * mainSize + this.j,
    //         otherIndex = i * mainSize + j;
    //     console.log(i, j);
    //     // const isValid = i >= 0 && i < mainSize && j >= 0 && j < mainSize
    //                     // && Math.abs(this.i - i) <= 1 && Math.abs(this.j - j) <= 1;
    //     const isValid = 
    //                     console.log(isValid, i, j);
    //     return isValid;
    // }
}
let currentPlayer = 'X';  // Start game with player X
let player1Type = 'human';
let player2Type = 'computerRandom';

document.getElementById('player1').addEventListener('change', function () {
    player1Type = this.value;
});

document.getElementById('player2').addEventListener('change', function () {
    player2Type = this.value;
});

function startGame() {
    resetGame();
    if (player1Type !== 'human') {
        setTimeout(() => makeMoveAI('X', player1Type), 500);
    } 
}

function makeMove(cell) {
    if (cell.textContent === '' && ((currentPlayer === 'X' && player1Type === 'human') || (currentPlayer === 'O' && player2Type === 'human'))) {
        cell.textContent = currentPlayer;
        checkGameState();  // This checks for a win or a draw and toggles the player
    }
}

function makeMoveAI(player, type) {
    if (player === currentPlayer) { // Check if it's indeed this player's turn
        if (type === 'computerRandom') {
            makeRandomMove();
        } else if (type === 'computerMinimax') {
            makeMinimaxMove();
        }
    }
}

function checkGameState() {
    if (checkForWinner()) {
        alert(currentPlayer + ' wins!');
        return;
    }
    if (isBoardFull()) {
        alert('Draw!');
        return;
    }
    togglePlayer();
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const nextPlayerType = currentPlayer === 'X' ? player1Type : player2Type;

    if (nextPlayerType !== 'human') {
        setTimeout(() => makeMoveAI(currentPlayer, nextPlayerType), 500);
    }
}

function checkForWinner() {
    const cells = document.querySelectorAll('.cell');
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';  // Ensures X starts after reset
}

function isBoardFull() {
    const cells = document.querySelectorAll('.cell');
    return Array.from(cells).every(cell => cell.textContent !== '');
}

function makeRandomMove() {
    let emptyCells = Array.from(document.querySelectorAll('.cell')).filter(c => c.textContent === '');
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = currentPlayer;
        if (checkForWinner()) {
            alert(currentPlayer + ' wins!');
            return;
        }
        togglePlayer();
    }
}

function makeMinimaxMove() {
    let bestScore = -Infinity;
    let move;
    const cells = document.querySelectorAll('.cell');

    cells.forEach((cell, index) => {
        if (cell.textContent === '') {
            cell.textContent = currentPlayer; // Try move
            let score = minimax(cells, 0, false);
            cell.textContent = ''; // Undo move

            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    if (move !== undefined) {
        cells[move].textContent = currentPlayer;
        if (checkForWinner()) {
            alert(currentPlayer + ' wins!');
            return;
        }
        togglePlayer();
    }
}

function minimax(cells, depth, isMaximizing) {
    if (checkForWinner()) {
        return isMaximizing ? -1 : 1;
    }

    if (isBoardFull(cells)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        Array.from(cells).forEach(cell => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                bestScore = Math.max(bestScore, minimax(cells, depth + 1, false));
                cell.textContent = ''; // Undo move
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        Array.from(cells).forEach(cell => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer === 'X' ? 'O' : 'X';
                bestScore = Math.min(bestScore, minimax(cells, depth + 1, true));
                cell.textContent = ''; // Undo move
            }
        });
        return bestScore;
    }
}



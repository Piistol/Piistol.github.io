let currentPlayer = 'X'; // Start game with player X
let aiMode = 'Random'; // Default AI mode

document.getElementById('aiMode').addEventListener('change', function() {
    aiMode = this.value === '0' ? 'Random' : 'Minimax';
    document.getElementById('aiModeLabel').textContent = aiMode;
});

function makeMove(cell) {
    if (cell.textContent === '') {
        cell.textContent = currentPlayer;
        if (checkForWinner()) {
            alert(currentPlayer + ' wins!');
            return;
        }
        togglePlayer();
        if (aiMode === 'Random') {
            setTimeout(makeRandomMove, 500);
        } else if (aiMode === 'Minimax') {
            setTimeout(makeMinimaxMove, 500);
        }
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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
    currentPlayer = 'X';
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

function isBoardFull(cells) {
    return Array.from(cells).every(cell => cell.textContent !== '');
}


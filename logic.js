const gridItem = document.getElementsByClassName("grid-item");
const startBtn = document.querySelector("#start");
const resetBtn = document.querySelector("#reset");
const gameOverModal = document.querySelector(".modal-container");

const gameBoard = (function () {

    const board = ['', '', '', '', '', '', '', '', ''];

    const printBoard = () => {
        let formattedString = '';
        board.forEach((cell, index) => {
            formattedString += cell ? ` ${cell} |` : '   |';
            if ((index + 1) % 3 == 0) {
                formattedString = formattedString.slice(0, -1);
                if (index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
            }

        });
        console.log('%c' + formattedString, 'color: #6d4e42;font-size:16px');
    }

    const insertMarker = (symbol, position) => {
        if (position > 8 || board[position]) return false; //Cell is either occupied or does not exist
        board[position] = symbol;
        return true;
    }

    const boardFull = () => {
        return board.every(cell => cell);
    }
    const boardEmpty = () => {
        return board.every(cell => !cell);
    }
    const isGameOver = () => {

        if (boardEmpty()) return false;

        // Row winning combinations 
        if (board[0] == board[1] && board[0] == board[2] && board[0]) {
            return { 'winner': board[0], 'direction': 'H', 'row': 1 };
        }
        if (board[3] == board[4] && board[3] == board[5] && board[3]) {
            return { 'winner': board[3], 'direction': 'H', 'row': 2 };
        }
        if (board[6] == board[7] && board[6] == board[8] && board[6]) {
            return { 'winner': board[6], 'direction': 'H', 'row': 3 };
        }

        // Column winning combinations 
        if (board[0] == board[3] && board[0] == board[6] && board[0]) {
            return { 'winner': board[0], 'direction': 'V', 'row': 1 };
        }
        if (board[1] == board[4] && board[1] == board[7] && board[1]) {
            return { 'winner': board[1], 'direction': 'V', 'row': 2 };
        }
        if (board[2] == board[5] && board[2] == board[8] && board[2]) {
            return { 'winner': board[2], 'direction': 'H', 'row': 3 };
        }

        // Diagonal winning combinations
        if (board[0] == board[4] && board[0] == board[8] && board[0]) {
            return { 'winner': board[0], 'direction': 'D', 'row': 1 };
        }
        if (board[2] == board[4] && board[2] == board[6] && board[2]) {
            return { 'winner': board[2], 'direction': 'D', 'row': 1 };
        }

        if (boardFull()) {
            return { 'winner': 'draw' };
        }

    }
    const clearBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
        for (var i = 0; i < gridItem.length; i++) {
            gridItem[i].innerHTML = '';
            gridItem[i].removeAttribute('data-value');
        }
        return board;
    }
    return { printBoard, insertMarker, isGameOver, clearBoard };

})();


function createPlayer(name, marker) {

    const playerName = name;
    const playerMarker = marker;
    let playerScore = 0;

    const increaseScore = () => playerScore++;
    const getPlayerScore = () => playerScore;
    const setPlayerName = (name) => playerName = name;
    const getPlayerName = () => playerName;
    return { playerName, playerMarker, playerScore, increaseScore, getPlayerScore, setPlayerName, getPlayerName };

}

function disableButtons(){
    startBtn.disabled = true;
    resetBtn.disabled = true;
}

function enableButtons(){
    startBtn.disabled = false;
    resetBtn.disabled = false;
}

const gameController = (function () {
    const playerOne = createPlayer('Player One', 'X');
    const playerTwo = createPlayer('Player Two', 'O');

    const players = [
        {
            name: playerOne.playerName,
            marker: playerOne.playerMarker
        },
        {
            name: playerTwo.playerName,
            marker: playerTwo.playerMarker
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurns = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }
    const playNewRound = () => {
        let position;



        for (var i = 0; i < gridItem.length; i++) {
            gridItem[i].addEventListener('click', function (event) {
                console.log(event.target.innerHTML);
                
                if (!event.target.hasAttribute("data-value")){
                    position = event.target.dataset.item;
                    let result = gameBoard.insertMarker(getActivePlayer().marker, position);
                    const markerText = document.createElement('p');
                    markerText.innerHTML = getActivePlayer().marker;
                    event.target.appendChild(markerText);
                    event.target.dataset.value  = getActivePlayer().marker;
                    console.log(result);
                    if(gameBoard.isGameOver()){
                        const playerOneWin = document.querySelector("#one-win");
                        const playerOneLoss = document.querySelector("#one-loss");
                        const playerTwoWin = document.querySelector("#two-win");
                        const playerTwoLoss = document.querySelector("#two-loss");
                        if ( gameBoard.isGameOver().winner === players[0].marker) {
                            console.log(players[0].name + " wins!");
                           
                            gameController.playerOne.increaseScore();
                            playerOneWin.innerHTML = "Wins: " + playerOne.getPlayerScore();
                            console.log(playerOne.getPlayerScore());
                            
                        } else {
                            console.log(players[1].name + " wins!");
                            playerTwo.increaseScore();
                            playerTwoWin.innerHTML = "Wins: " + playerTwo.getPlayerScore();
                            console.log(playerTwo.getPlayerScore());
                            
                        }
                        for (let i = 0; i < gridItem.length; i++){
        
                            gridItem.item(i).style.pointerEvents = "none";
                    

                        }
                        gameOverModal.style.display = "flex";
                        disableButtons();
                        return;
                    }
                    
                    switchPlayerTurns();
                    gameBoard.printBoard();
                }
                
            });
        }



    }



    return { playNewRound, getActivePlayer, playerOne };
})();

document.body.addEventListener('click', function(e) {
   let btn = e.target;
   console.log(btn)
    if (btn.id === "start"){
        for (let i = 0; i < gridItem.length; i++){
       
            gridItem.item(i).style.pointerEvents = "auto";
    
        }
        gameController.playNewRound();
    }
    if (btn.id === "reset"){
        gameBoard.clearBoard();
        for (let i = 0; i < gridItem.length; i++){
        
            gridItem.item(i).style.pointerEvents = "none";
    
        }
    }
    if (btn.id ==="close"){
        gameBoard.clearBoard();
        gameOverModal.style.display = "none";
        enableButtons();
    }
    
});





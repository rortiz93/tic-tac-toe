const gameBoard = (function() {
    
    const board = ['','','','','','','','',''];
 
    const printBoard = () => {
        let formattedString = '';
        board.forEach((cell, index) => {
            formattedString += cell ? ` ${cell} |` : '   |';
            if((index + 1) % 3 == 0)  {
                formattedString = formattedString.slice(0,-1);
                if(index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
    	}
        
	});
    console.log('%c' + formattedString, 'color: #6d4e42;font-size:16px');
    }

    const insertMarker = (symbol, position) => {
        if(position > 8 || board[position]) return false; //Cell is either occupied or does not exist
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
            return {'winner' : board[0] , 'direction' : 'H' , 'row' : 1};
        }
        if (board[3] == board[4] && board[3] == board[5] && board[3]) {
            return {'winner' : board[3] , 'direction' : 'H' , 'row' : 2};
        }
        if (board[6] == board[7] && board[6] == board[8] && board[6]) {
            return {'winner' : board[6] , 'direction' : 'H' , 'row' : 3};
        }

        // Column winning combinations 
        if (board[0] == board[3] && board[0] == board[6] && board[0]) {
            return {'winner' : board[0] , 'direction' : 'V' , 'row' : 1};
        }
        if (board[1] == board[4] && board[1] == board[7] && board[1]) {
            return {'winner' : board[1] , 'direction' : 'V' , 'row' : 2};
        }
        if (board[2] == board[5] && board[2] == board[8] && board[2]) {
            return {'winner' : board[2] , 'direction' : 'H' , 'row' : 3};
        }

        // Diagonal winning combinations
        if (board[0] == board[4] && board[0] == board[8] && board[0]) {
            return {'winner' : board[0] , 'direction' : 'D' , 'row' : 1};
        }
        if (board[2] == board[4] && board[2] == board[6] && board[2]) {
            return {'winner' : board[2] , 'direction' : 'D' , 'row' : 1};
        }

        if(boardFull()) {
            return {'winner': 'draw'};
        }

    }
    const clearBoard = () => {
        for (let i = 0; i < board.length; i++){
            board[i] = '';
        }
        return board;
    }
    return {printBoard , insertMarker ,  isGameOver, clearBoard};
   
})();


function createPlayer (name , marker ) {

    const playerName = name;
    const playerMarker = marker;
    let playerScore = 0; 

    const increaseScore = () => playerScore++; 
    const getPlayerScore = () => playerScore;
    return { playerName , playerMarker, playerScore , increaseScore, getPlayerScore};

}

const gameController = (function () {
    const playerOne = createPlayer('Player One' , 'X');
    const playerTwo = createPlayer('Player Two' , 'O');

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
       while(!gameBoard.isGameOver()){
        let position = prompt("Which position would you like to put your marker? ");
        let result = gameBoard.insertMarker(getActivePlayer().marker , position);
        while (!result) {
            let position = prompt("That position is invalid, please enter a valid position (0-8). Which position would you like to put your marker? ");
            result = gameBoard.insertMarker(getActivePlayer().marker , position);
        }
       
        console.log(result);
        

        switchPlayerTurns();
        printNewRound();
       }
       console.log(gameBoard.isGameOver());
       if (gameBoard.isGameOver().winner === players[0].marker ){
         console.log(players[0].name + " wins!");
         gameController.playerOne.increaseScore();
         console.log(playerOne.getPlayerScore());
       }else {
        console.log(players[1].name + " wins!");
        playerTwo.increaseScore();
        console.log(playerTwo.getPlayerScore());
       }
        

    }

    printNewRound();

    return { playNewRound, getActivePlayer , playerOne};
}) ();

var original_brd;
const human_player = 'O';
const ai_player = 'X';

//all winning scenario
const win_scenario =[
    [0, 1, 2], //0 0 0
    [3, 4, 5], //horizontal
    [6, 7, 8],

    [0, 3, 6],//0  vertical
    [1, 4, 7],//0
    [2, 5, 8],//0

    [0, 4, 8],//0   diagonal
    [2, 4, 6],//    0
              //        0
]

const cells = document.querySelectorAll('.cell')
//selecting all element with class cell, 
//which means select all cells

startGame();
function startGame(){
    document.querySelector(".endgame").style.display = "none";
    //original_brd = Array.from(Array(9).keys());
    //assigning 0-8 to all cells
    original_brd = Array(9);
    for (let i = 0; i < 9; i++) 
        original_brd[i] = i
    
    //resetting cell properties
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }

    console.log(original_brd);
}

function turnClick(cell){
    //if the cell is not filled
    //every cell is marked 0->8
    //if cell is fill, it should be O or X
    if(typeof original_brd[cell.target.id] == 'number'){
        move(cell.target.id, human_player); 
        if(!checkTie()) //check if all cells is filled, but no winner found
            move(bestSpot(), ai_player);
    }
    
}

function move(cellId, player){
    original_brd[cellId] = player;
    //if human_player return O
    //else return X
    document.getElementById(cellId).innerText = player;//display move
    let won = checkWon(original_brd, player);
    if(won) gameOver(won);
}

function checkWon(board, player){
    //find every cell which had been filled by the player
    //going through all cells
	let plays = board.reduce((return_val, element, index) => 
        (element === player) ? return_val.concat(index) : return_val, []);
    //console.log(plays);
    let gameWon = null;
	for (let [index, win] of win_scenario.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon){
    //checking if the move is in the winning scenario or not
    for(let index of win_scenario[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == human_player ? "lightblue": "red";
    }
    //locking all the remaining cells, game already over here :) 
    for(let i = 0; i< cells.length; i++)
        cells[i].removeEventListener('click', turnClick, false);
    printWinner(gameWon.player == human_player ? "You won" : "You lost");
}

function emptyCells(){
    //looping through the board, see if there's any empty cell to return
    return original_brd.filter(cell => typeof cell == 'number');
}

function bestSpot(){
    return minimax(original_brd, ai_player).index;
}

function printWinner(player){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = player;
}

function checkTie(){
    if(emptyCells().length == 0){
        for(let i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green"; //fill all cells green
            cells[i].removeEventListener('click', turnClick, false); //lock all remaning cells
        }
        printWinner("Tie");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
	var availableSpots = emptyCells();

	if (checkWon(newBoard, human_player)) {
		return {score: -10};
	} else if (checkWon(newBoard, ai_player)) {
		return {score: 10};
	} else if (availableSpots.length === 0) {
		return {score: 0};
	}
    var arrMoves = [];
    //calling itself at every empty cell
	for (var i = 0; i < availableSpots.length; i++) {
        var move = {};
        //assigning index number of current empty spot to get its score
        move.index = newBoard[availableSpots[i]];
        
        //assigning O or X to new board
		newBoard[availableSpots[i]] = player;

        //going deeper into the tree if not found terminal state
		if (player == ai_player) {
			var result = minimax(newBoard, human_player);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, ai_player);
			move.score = result.score;
		}

        //reset value
		newBoard[availableSpots[i]] = move.index;

		arrMoves.push(move);
	}

	var bestMove;
	if(player === ai_player) {
        //ai - highest score
		var bestScore = -99999;
		for(var i = 0; i < arrMoves.length; i++) {
            //which ever moves with score higher that best score is saved
			if (arrMoves[i].score > bestScore) {
				bestScore = arrMoves[i].score;
				bestMove = i;
			}
		}
	} else {
        //human - lowest score
		var bestScore = 99999;
		for(var i = 0; i < arrMoves.length; i++) {
			if (arrMoves[i].score < bestScore) {
				bestScore = arrMoves[i].score;
				bestMove = i;
			}
		}
	}

	return arrMoves[bestMove];
}









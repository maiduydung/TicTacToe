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
    move(cell.target.id, human_player); //only human player can "click
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
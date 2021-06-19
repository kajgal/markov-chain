console.log("[ HELLO! ]")

// board initial configuration
const board = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
    orientation: 'white',
    onDrop : onDrop,
    onMoveEnd : onMoveEnd
})

// simulation - speed - slider
const slider = document.getElementById('simulation-timer')
// output is like "Move delay: [value] seconds."
const output = document.getElementById('simulation-seconds')
// output default value 
output.innerHTML = `Move delay: ${slider.value} miliseconds`

let simulationDelay = slider.value

slider.oninput = function() {
    output.innerHTML = `Move delay: ${this.value} miliseconds`;
    simulationDelay = this.value
}

let boardCleared = true;

let simulationWorking = false;

const toggleBtn = document.getElementById('iterative-simulation');

const iterationsInput = document.getElementById("iterations-number");

const movesOutput = document.getElementById('simulation-moves');

const simulationHeader = document.getElementById('simulation-header');

let iterator = 0

function iterativeSimulation() {

    if(simulationWorking) {

        alert("You are not allowed to change mode while simulation is active.")
        return;
    }
    else {
        if(!toggleBtn.checked) {
            iterationsInput.style.display = "none";
            iterationsInput.value = ""
            //
            simulationHeader.innerHTML = "Simulation"
            simulationHeader.style.fontSize = "30px";
            movesOutput.innerHTML = `Moves: 0`
            
        }
        else {
            iterationsInput.style.display = "block";

            // get input from user
            let iterationsCount = iterationsInput.value;

            console.log(iterationsCount);

            simulationHeader.style.fontSize = "18px";
            simulationHeader.innerHTML = `AVG Moves: 0 | Iteration: 0`
            movesOutput.innerHTML = `Moves: 0`
        }
    }
}

// whole chessboard
const chessboard = document.getElementsByClassName('board-b72b1')[0]

// all rows of chessboard
const chessboardRows = document.getElementsByClassName('row-5277c')

// all squares of chessboard
const chessboardSquares = document.getElementsByClassName('square-55d63');

// get all squares (DOM Elements) into 2d array to manipulate with style

const divChessboard = [];

let divChessrow

for(let i = 0; i < 64; i++) {
    if(i % 8 == 0) {
        divChessrow = []
    }

    divChessrow.push(chessboardSquares[i])
    chessboardSquares[i].innerHTML = "";
    chessboardSquares[i].style.display = "flex";

    if(i % 8 == 7) {
        divChessboard.push(divChessrow)
    }
}

const startSimulationBtn = document.getElementById('start-simulation');

startSimulationBtn.addEventListener( 'click', startSimulation);

function startSimulation() {

    if(!boardCleared) {
        alert("Clear the board before starting simulation!");
        window.location.href = window.location.href;
        return;
    }
    
    if(simulationWorking) {
        alert("You cannot start another simulation while one is active! Clear the board first");
        return;
    }
    console.log(iterationsInput.value);
    console.log(Number.isInteger(iterationsInput.value))
    if(iterationsInput.value < 0 || !(iterationsInput.value % 1 == 0)) {
        alert("Your iterations input is invalid! It should be integer number.");
        return;
    }

    // check if piece is placed on chessboard
    if(initialPiecePosition != "OUT_OF_BOARD") {
        initSimulation()
        simulationWorking = true;
        toggleBtn.disabled = true;
    } else {
        alert("Please put piece on the board to see result!");
    }

    // at simulation start, basically I have to trigger onMoveEnd so it requires to manually move in RANDOM way particular piece
}

let movesCounter = 0;

clear();

function initSimulation() {
    const initialBoardPosition = fenToPieceCoordinates( Chessboard.objToFen(boardPosition) );

    executeRandomMove(initialBoardPosition, pieceType)
}

// remove top pieces from DOM
const topPieces = document.querySelector('.spare-pieces-top-4028b')

// remove numeric from board
const leftsideNumeric = document.getElementsByClassName('notation-322f9')

// remove bottom pawn from DOM
const bottomPawn = document.querySelector( "[data-piece=wP]")

bottomPawn.parentNode.removeChild(bottomPawn);

const bottomPieces = document.querySelector('.spare-pieces-bottom-ae20f')

bottomPieces.style.paddingLeft = "";
bottomPieces.style.textAlign = 'center';

const bottomPiecesParentNode = bottomPieces.parentNode

topPieces.parentNode.removeChild(topPieces)

topPieces.remove() 

let boardBlocked = false

let boardPosition = null

let initialPiecePosition = "OUT_OF_BOARD";

const numberOfMovesBtn = document.getElementById('number-of-moves');

numberOfMovesBtn.addEventListener( 'click', numberOfMoves)

function numberOfMoves() {

    if(simulationWorking) {
        alert("You cannot do this while simulation is working! Clear the board first.");
        return;
    }

    clear()
    if(initialPiecePosition != "OUT_OF_BOARD") {
        const numberOfMoves = countNumberOfMoves(pieceType)
        diagonalAnimation(numberOfMoves, 0);
        boardCleared = false;
    } else {
        alert("Please put piece on the board to see result!");
    }
}

const stationaryDistributionBtn = document.getElementById('stationary-distribution');

stationaryDistributionBtn.addEventListener( 'click', stationaryDistribution)

function stationaryDistribution() {

    if(simulationWorking) {
        alert("You cannot do this while simulation is working! Clear the board first.");
        return;
    }

    clear()
    if(initialPiecePosition != "OUT_OF_BOARD") {
        const boardOfFraction = countStationaryDistribution(pieceType)
        diagonalAnimation(boardOfFraction, 1);
        boardCleared = false;
    } else {
        alert("Please put piece on the board to see result!")
    }
}

const clearBtn = document.getElementById('clear-board');

clearBtn.addEventListener('click', clearBoard);

function clearBoard() {
    window.location.reload(false);
}


//////////////////
let currentPieceCoordinates;

async function onMoveEnd(oldPos, newPos) {
    
    const afterMovePosition = fenToPieceCoordinates( Chessboard.objToFen(newPos) );

    if(initialPiecePosition != afterMovePosition) {
        await sleep(simulationDelay)
        executeRandomMove(afterMovePosition, pieceType);
    } else {

        // check if iterative mode is turned on
        if(toggleBtn.checked && iterator < iterationsInput.value) {

            console.log(`FINISHED ${iterator + 1} ITERATION`)
            
            iterator = iterator + 1;

            let avgMoves = Math.round(movesCounter / iterator);

            simulationHeader.innerHTML = `AVG Moves: ${avgMoves} | Iteration: ${iterator}`

            initSimulation();
        }
        // one simulation 
        else {
            console.log("[ SIMULATION END ]")
            simulationWorking = false;
            toggleBtn.disabled = false;
        }
    }
}

// just moving piece
function move(move) {
    board.move(move)
}

// position is like chess[- pieceRow][pieceColumn]
function fenToPieceCoordinates(fenString) {
    let pieceInNotation = false;
    let pieceRow = 0;
    const chessRows = fenString.split('/');

    // look for element different than 8 which is empty row
    for(row of chessRows) {
        if(row != "8") {
            pieceInNotation = row
            break;
        }
        pieceRow = pieceRow + 1;
    }

    let pieceColumn;
    // check if its 3 chars long like 5N2
    if(pieceInNotation.length == 3) {
        pieceColumn = parseInt(pieceInNotation.charAt(0))
    }
    // its like N7 or 7N
    else {
        // if its N7
        if(isNaN(pieceInNotation.charAt(0))) {
            pieceColumn = 0
        }
        else {
            pieceColumn = 7
        }
    }

    const pieceCoordinates = [pieceRow, pieceColumn]


    return coordinatesToNotation(pieceCoordinates)
}

// function that returns position in notation from two coordinates [Y, X] - returns like f2, e4 etc.
function coordinatesToNotation(pieceCoordinates) {
    const number = (8 - pieceCoordinates[0])
    const letter = numberToNotation(pieceCoordinates[1])

    const newMoveNotation = letter + number

    return newMoveNotation
}

// configuration set up when piece is dropped on chessboard
let pieceType;


// if one piece lands on board, rest disappears
function onDrop (source, target, piece, newPos, oldPos, orientation) {

    removeHighlightAfterMove()

    boardPosition = newPos
    
    // allows only one piece to be dropped on chessboard - fires only at start
    if(!boardBlocked && target !== 'offboard') {
        initialPiecePosition = target;
        bottomPiecesParentNode.removeChild(bottomPieces)
        boardBlocked = true
        clearBtn.style.display = 'block';

        // piece returns two characters, first is w or b (white/black) and second is piece K/Q/R/B/N/P so I take only second character for piece type
        pieceType = piece.charAt(1);

        //
        let notation = Object.keys(newPos)[0]
        let coordinates = notationToCoordinates(notation)
        higlightSquareWithPiece(coordinates[0], coordinates[1])

        countAverageMovesToReturn(pieceType, notation)
    }

    // updates piece position if user moves piece after dragging on chessboard before starting simulation
    if(boardBlocked && target !== 'offboard') {
        initialPiecePosition = target;

        let notation = Object.keys(newPos)[0]
        let coordinates = notationToCoordinates(notation)
        higlightSquareWithPiece(coordinates[0], coordinates[1])

        countAverageMovesToReturn(pieceType, notation)
    }

    // allows user to drag piece on chess board when chessboard is empty
    if(target == 'offboard') {
        initialPiecePosition = "OUT_OF_BOARD";
        bottomPiecesParentNode.appendChild(bottomPieces)
        boardBlocked = false

        // clear pieceType if there is no piece on chessboard
        pieceType = null;

        clearBtn.style.display = 'none';
    }

}


function higlightSquareWithPiece(yCord, xCord) {
    divChessboard[yCord][xCord].style.boxSizing = "border-box";
    divChessboard[yCord][xCord].style.backgroundColor = "#C0392B";
    highlightedSquare = divChessboard[yCord][xCord];
}

function removeHighlightAfterMove() {
    if(highlightedSquare != null) {
        highlightedSquare.style.backgroundColor = "";
    }
}

// refresh output with number of moves 
function refreshMoves(passedMoves=-1) {
    movesCounter += 1;

    if(passedMoves != -1) {
        movesCounter = passedMoves
    }
    movesOutput.innerHTML = `Moves: ${movesCounter}`
}

//

function executeRandomMove(piecePositionNotation, pieceType) {

    refreshMoves()

    if(highlightedSquare != null) {
        removeHighlight()
    }

    // piecePosition is like g3, e2 so I need to get it's coordinates
    const piecePositionCoordinates = notationToCoordinates(piecePositionNotation)

    // get all legal moves for particular piece depending on its type
    const legalMoves = getLegalMoves(pieceType);

    let yCord = piecePositionCoordinates[0];
    let xCord = piecePositionCoordinates[1];

    const possibleMoves = []

    let yMoveChange
    let xMoveChange

    for(const [moveDirection, moveVector] of Object.entries(legalMoves)) {
        yMoveChange = moveVector[0]
        xMoveChange = moveVector[1]

        if(yCord + yMoveChange >= 0 
            && yCord + yMoveChange <= 7
                && xCord + xMoveChange >= 0 
                    && xCord + xMoveChange <= 7) {
            
            possibleMoves.push(moveVector)
        }
    }
    
    const randomMove = getRandomMove(possibleMoves);

    // position of piece in coordinates notation after move
    const coordinatesAfterMove = [ yCord + randomMove[0], xCord + randomMove[1] ]
    const notationAfterMove = coordinatesToNotation(coordinatesAfterMove)

    const nextMove = `${piecePositionNotation}-${notationAfterMove}`

    highlightOnMove(yCord + randomMove[0], xCord + randomMove[1])

    board.move(nextMove)
}

// notationPosition is piecePosition in notation which is like f4, h1
// function to convert piece position from onDrop method 
function notationToCoordinates(notationPosition) {
    // xCord is information about 1nd dimension which are columns in board array
    const xCord = notationToNumber( notationPosition.charAt(0) )
    // yCord is information about 2nd dimension which are rows in board array
    const yCord = ( 8 - parseInt(notationPosition.charAt(1)))
    const pieceCoordinates = [yCord, xCord]

    return pieceCoordinates
}

let highlightedSquare

function highlightOnMove(yCord, xCord) {
    divChessboard[yCord][xCord].style.boxSizing = "border-box";
    divChessboard[yCord][xCord].style.border = "2px solid yellow";
    highlightedSquare = divChessboard[yCord][xCord];
}

function removeHighlight() {
    highlightedSquare.style.border = "";
}

// function that animates diagonal showing up values 
async function diagonalAnimation(itemsArray, mode) {

    for(let i = 0; i < 15; i++) {
        for(let j = 0; j <= i; j++) {
            let k = i - j;
            if(k < 8 && j < 8) {
                // [k][j]
                let textPopOut;
                // mode = 0 is for number of moves
                divChessboard[k][j].style.boxSizing = "border-box"
                if(mode == 0) {
                    textPopOut = `${itemsArray[k][j]}`

                }
                else {
                    textPopOut = `<sup>${itemsArray[k][j].split("/")[0]}</sup><span>&frasl;</span><sub>${itemsArray[k][j].split("/")[1]}</sub>`;
                }
                divChessboard[k][j].innerHTML = textPopOut
                divChessboard[k][j].style.color = "black";
                await sleep(100)
            }
        }
    }
}

//* MATH *//

// function that counts number of moves for all squares
function countNumberOfMoves(pieceType) {

    let movesBoard = new Array(8)
    let currentPosition
    const legalMoves = getLegalMoves(pieceType)
    
    for(let i = 0; i < 8; i++) {
        movesBoard[i] = new Array(8)
        for(let j = 0; j < 8; j++) {
            currentPosition = [i, j]
            movesBoard[i][j] = movesFromSquare(currentPosition, legalMoves)
        }
    }

    // logs for F12
    console.log("[NUMBER OF MOVES]");
    console.log(`Number of moves array for ${pieceType} is: `);
    console.log(movesBoard);

    return movesBoard
}

// function that returns possible moves from specified square for specified piece
function movesFromSquare(currentPosition, legalMoves) {

    let possibleMoves = 0

    const yCord = currentPosition[0]
    const xCord = currentPosition[1]

    for(const [moveDirection, moveVector] of Object.entries(legalMoves)) {
        yMoveChange = moveVector[0]
        xMoveChange = moveVector[1]

        if(yCord + yMoveChange >= 0 
            && yCord + yMoveChange <= 7
                && xCord + xMoveChange >= 0 
                    && xCord + xMoveChange <= 7) {
            
            possibleMoves = possibleMoves + 1;
        }
    }

    return possibleMoves
}

// function that counts stationary distribution for specified situation
function countStationaryDistribution(pieceType, roundTo = 18) {
    // anyways i need possibleMoves array
    let possibleMoves = countNumberOfMoves(pieceType)
    
    console.log(possibleMoves)

    // calculate sum of possibleMoves (each square and possible moves from that square)
    let sumOfAllMoves = 0

    possibleMoves.forEach( row => {
        sumOfAllMoves += row.reduce( function(previousValue, currentValue) {
            return previousValue + currentValue;
        })
    });

    if(pieceType == 'B') {
        sumOfAllMoves = sumOfAllMoves / 2;
    }

    // calculate array of fractions
    // calculate array of float values
    let boardOfFractions = []
    let boardOfFloatFractions = []
    let rowOfFractions
    let rowOfFloatFractions;
    let fraction;
    let floatFraction;

    possibleMoves.forEach( row => {
        rowOfFractions = []
        rowOfFloatFractions = []
        row.forEach( squareMoves => {
            fraction = Ratio(squareMoves, sumOfAllMoves).simplify().toString();
            floatFraction = parseFloat((squareMoves / sumOfAllMoves).toFixed(roundTo))
            rowOfFractions.push(fraction)
            rowOfFloatFractions.push(floatFraction)
        });
        boardOfFractions.push(rowOfFractions)
        boardOfFloatFractions.push(rowOfFloatFractions)
    });

    // logs for F12
    console.log("[STATIONARY DISTRIBUTION]");
    console.log(`Stationary distribution array in fractions: `);
    console.log(boardOfFractions);
    console.log(`Stationary distribution array in floats: `);
    console.log(boardOfFloatFractions);
    console.log(` Sum of all possible moves from all squares: ${sumOfAllMoves}`);

    return boardOfFractions;
}

// function counts average number of moves of piece to return to starting state
function countAverageMovesToReturn(pieceType, notation) {

    let coordinates = notationToCoordinates(notation)

    const stationaryDistribution = countStationaryDistribution(pieceType)

    const distributionAtState = stationaryDistribution[coordinates[0]][coordinates[1]]

    const averageMovesToReturn = 1 / eval(distributionAtState)

    const logText = `Stationary distribution for ${pieceType} at ${notation} is ${distributionAtState}. Average number of moves to return to that state is ${averageMovesToReturn}`

    // logs for F12
    console.log("[AVERAGE NUMBER OF MOVES]")
    console.log(logText)

    // refresh on page
    setAverageValue(averageMovesToReturn);
}

/* CHESS UTILS */

// legalMoves is object of arrays which says how coordinates of piece will change on board, if board is 2dim array [y][x] ---> [rows][columns]
// moves up decreases y value, moves down increases y value
// moves left decreases x value, moves right increases x value
function getLegalMoves(pieceType) {

    let legalMoves = {};

    switch(pieceType) {
        // K - king - 9 moves
        case 'K': 
            legalMoves = {
                "straightTop": [-1, 0],
                "leftTop": [-1, -1],
                "rightTop": [-1, 1],
                "straightRight": [0, 1],
                "bottomRight": [1, 1],
                "straightBottom": [1, 0],
                "bottomLeft": [1, -1],
                "straightLeft": [0, -1]
            }
            break;

        // Q - queen
        case 'Q':
            legalMoves = rookVectors(legalMoves)
            legalMoves = bishopVectors(legalMoves)
            break;

        // R - rook - 28 moves
        case 'R':
            legalMoves = rookVectors(legalMoves)
            break;

        // B - bishop - 28 moves
        case 'B':
            // it would be waste of resources to write it by hand so let's generate these vectors and reuse them later in queen
            legalMoves = bishopVectors(legalMoves)
            break;


        // N - knight - 8 moves 
        case 'N':
            legalMoves = {
                "topLeft": [-2, -1],
                "topRight": [-2, 1],
                "rightTop": [-1, 2],
                "rightBottom": [1, 2],
                "bottomRight": [2, 1],
                "bottomLeft": [2, -1],
                "leftBottom": [1, -2],
                "leftTop": [-1, -2]
            }
            break;
        
    }

    return legalMoves
}

// function to generate all possible vectors of move for bishop
function bishopVectors(legalMoves) {
    for(let i = 1; i < 8; i++) {
        // generate vectors like [-1, -1], [-2, -2]
        legalMoves[`top${-i}Left`] = [-i, -i]

        // generate vectors like [-1, 1], [-2, 2]
         legalMoves[`top${i}Right`] = [-i, i]

        // generate vectors like [1, 1], [2, 2]
        legalMoves[`bottom${i}Right`] = [i, i]

        // generate vectors like [1, -1], [2, -2]
        legalMoves[`bottom${-i}Left`] = [i, -i]
        
    }
    return legalMoves
}

// function to generate all possible vectors of move for rook
function rookVectors(legalMoves) {
    for(let i = 1; i < 8; i++) {
        // generate vectors like [1, 0], [2, 0]
        legalMoves[`straight${i}Bottom`] = [i, 0]

        // generate vectors like [0, 1], [0, 2]
        legalMoves[`straight${i}Right`] = [0, i]

        // generate vectors like []
        legalMoves[`straight${-i}Left`] = [0, -i]

        // generate vectors like [-1, 0], [-2, 0]
        legalMoves[`straight${-i}Top`] = [-i, 0]
    }

    return legalMoves
}

// function choose random move from all possible legal moves at particular moment
function getRandomMove(possibleMoves) {
    return possibleMoves[ Math.floor(Math.random() * possibleMoves.length) ];
}

// function to get notation letter from array index
function numberToNotation(number) {
    switch(number) {
        case 0:
            return 'a';
        case 1:
            return 'b';
        case 2:
            return 'c';
        case 3:
            return 'd';
        case 4:
            return 'e';
        case 5:
            return 'f';
        case 6:
            return 'g';
        case 7:
            return 'h';
        default:
            return 'ERROR';
    }
}

// function to get index of array from notation letter
function notationToNumber(letter) {
    switch(letter) {
        case 'a':
            return 0;
        case 'b':
            return 1;
        case 'c':
            return 2;
        case 'd':
            return 3;
        case 'e':
            return 4;
        case 'f':
            return 5;
        case 'g':
            return 6;
        case 'h':
            return 7;
        default:
            return 'ERROR';
    }
}

/* UTILS */

// helper function for delay in simulation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clear() {
    for(row of divChessboard) {
        for(div of row) {
            div.style.border = "";
            div.style.backgroundColor = "";
            div.style.innerHTML = "";
        }
    }
    // set average moves to 0
    setAverageValue(0);
    refreshMoves(0);
}

// function sets average number of moves after piece is placed on square
function setAverageValue(averageNumber) {
    const averageOutput = document.getElementById('simulation-average');

    averageOutput.innerHTML = `Expected: ${Math.ceil(averageNumber)}`;
}
// board initial configuration
const board = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
    orientation: 'white',
    onDrop : onDrop,
    onMoveEnd : onMoveEnd
})

// visu

// whole chessboard
const chessboard = document.getElementById('chessboard-63f37');

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

    if(i % 8 == 7) {
        divChessboard.push(divChessrow)
    }
}

console.log(divChessboard)

/*  TO DO
- fade in and fade out bottom pieces
- replace bottom pieces with text informating about that u have to move piece away to make other pieces appear again
*/

/* THREE BUTTONS
- NUMBER OF MOVES FROM THAT STATE
- COUNT STATIONARY DISTRIBUTION
- START SIMULATION
*/

const startSimulationBtn = document.getElementById('start-simulation');

startSimulationBtn.addEventListener( 'click', startSimulation);

function startSimulation() {
    // check if piece is placed on chessboard
    if(initialPiecePosition != "OUT_OF_BOARD") {
        initSimulation()
    } else {
        alert("PUT PIECE ON THE BOARD!");
    }

    // at simulation start, basically I have to trigger onMoveEnd so it requires to manually move in RANDOM way particular piece
}

function initSimulation() {
    const initialBoardPosition = fenToPieceCoordinates( Chessboard.objToFen(boardPosition) );
    executeRandomMove(initialBoardPosition, pieceType)
}

// remove top pieces from DOM
const topPieces = document.querySelector('.spare-pieces-top-4028b')

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

function onMoveEnd(oldPos, newPos) {
    
    const afterMovePosition = fenToPieceCoordinates( Chessboard.objToFen(newPos) );

    if(initialPiecePosition != afterMovePosition) {
        executeRandomMove(afterMovePosition, pieceType);
    } else {
        console.log("Simulation end!");
    }
}

function move(move) {
    board.move(move)
}

// position is like chess[- pieceRow][pieceColumn]
function fenToPieceCoordinates(fenString) {
    let pieceInNotation = false;
    let pieceRow = 0;
    const chessRows = fenString.split('/');

    console.log(chessRows)

    // look for element different than 8 which is empty row
    for(row of chessRows) {
        if(row != "8") {
            pieceInNotation = row
            break;
        }
        pieceRow = pieceRow + 1;
    }

    console.log(pieceInNotation)

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

    console.log(pieceCoordinates)

    return coordinatesToNotation(pieceCoordinates)
}

// return like f2, e4 etc.
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

    boardPosition = newPos
    
    // allows only one piece to be dropped on chessboard - fires only at start
    if(!boardBlocked && target !== 'offboard') {
        initialPiecePosition = target;
        bottomPiecesParentNode.removeChild(bottomPieces)
        boardBlocked = true


        // piece returns two characters, first is w or b (white/black) and second is piece K/Q/R/B/N/P so I take only second character for piece type
        pieceType = piece.charAt(1);
    }

    // updates piece position if user moves piece after dragging on chessboard before starting simulation
    if(boardBlocked && target !== 'offboard') {
        initialPiecePosition = target;
    }

    // allows user to drag piece on chess board when chessboard is empty
    if(target == 'offboard') {
        initialPiecePosition = "OUT_OF_BOARD";
        bottomPiecesParentNode.appendChild(bottomPieces)
        boardBlocked = false

        // clear pieceType if there is no piece on chessboard
        pieceType = null;
    }
}
//

function executeRandomMove(piecePositionNotation, pieceType) {

    // piecePosition is like g3, e2 so I need to get it's coordinates
    const piecePositionCoordinates = notationToCoordinates(piecePositionNotation)
    console.log(piecePositionCoordinates)

    // get all legal moves for particular piece depending on its type
    const legalMoves = getLegalMoves(pieceType);

    console.log(legalMoves)

    let yCord = piecePositionCoordinates[0];
    let xCord = piecePositionCoordinates[1];

    const possibleMoves = []

    let yMoveChange
    let xMoveChange

    for(const [moveDirection, moveVector] of Object.entries(legalMoves)) {
        yMoveChange = moveVector[0]
        xMoveChange = moveVector[1]

        console.log(moveDirection)

        if(yCord + yMoveChange >= 0 
            && yCord + yMoveChange <= 7
                && xCord + xMoveChange >= 0 
                    && xCord + xMoveChange <= 7) {
            
            possibleMoves.push(moveVector)
            console.log(moveVector)
        }
    }
    
    const randomMove = getRandomMove(possibleMoves);

    // position of piece in coordinates notation after move
    const coordinatesAfterMove = [ yCord + randomMove[0], xCord + randomMove[1] ]
    const notationAfterMove = coordinatesToNotation(coordinatesAfterMove)

    const nextMove = `${piecePositionNotation}-${notationAfterMove}`

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

function getRandomMove(possibleMoves) {
    return possibleMoves[ Math.floor(Math.random() * possibleMoves.length) ];
}

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
/*  TO DO
- fade in and fade out bottom pieces
- replace bottom pieces with text informating about that u have to move piece away to make other pieces appear again
*/

/* THREE BUTTONS
- NUMBER OF MOVES FROM THAT STATE
- COUNT STATIONARY DISTRIBUTION
- START SIMULATION
*/


// board initial configuration
const board = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
    orientation: 'white',
    onDrop : onDrop,
    onMoveEnd : onMoveEnd,
    onSnapEnd: onSnapEnd
})

// remove top pieces from DOM
const topPieces = document.querySelector('.spare-pieces-top-4028b')

const bottomPieces = document.querySelector('.spare-pieces-bottom-ae20f')

const bottomPiecesParentNode = bottomPieces.parentNode

topPieces.parentNode.removeChild(topPieces)

topPieces.remove() 

let boardBlocked = false

function onSnapEnd () {
    console.log('xd')
  }


function onMoveEnd(oldPos, newPos) {
      console.log('Move animation complete:')
  console.log('Old position: ' + Chessboard.objToFen(oldPos))
  console.log('New position: ' + Chessboard.objToFen(newPos))
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
}


// if one piece lands on board, rest disappears
function onDrop (source, target, piece, newPos, oldPos, orientation) {
    
    if(!boardBlocked) {
        if(target !== 'offboard') {
            bottomPiecesParentNode.removeChild(bottomPieces)
            boardBlocked = true
        }
    }
    if(target == 'offboard') {
        console.log('offboard')
        bottomPiecesParentNode.appendChild(bottomPieces)
        boardBlocked = false
    }
    console.log('Source: ' + source)
    console.log('Target: ' + target)
    console.log('Piece: ' + piece)
    console.log('New position: ' + Chessboard.objToFen(newPos))
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('Orientation: ' + orientation)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(notationToCoordinates(target))
    
    const nextPosition = target.charAt(0) + (parseInt(target.charAt(1)) + 1).toString()
    console.log(nextPosition)
    const action = target + '-' + nextPosition
    console.log(action)
    board.move(action)
    console.log(board.move(action))
}
//

function knightPossibleMoves(knightPosition) {


    const initialPosition = knightPosition

    // all legal moves for knight to be checked from current position
    const legalMoves = {
        "topLeft": [-1,2],
        "topRight": [1,2],
        "rightTop": [2, 1],
        "rightBottom": [2, -1],
        "bottomRight": [1, -2],
        "bottomLeft": [-1, -2],
        "leftBottom": [-2, -1],
        "leftTop": [-2, 1]
    }

}

// function to convert piece position from onDrop method 
function notationToCoordinates(notationPosition) {
    const letter = notationPosition.charAt(0)
    const number = parseInt(notationPosition.charAt(1)) - 1
    const xCord = translateNotation(letter)
    const pieceCoordinates = [xCord, number]

    return pieceCoordinates
}

function translateNotation(letter) {
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
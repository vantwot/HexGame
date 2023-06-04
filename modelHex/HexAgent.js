const Agent = require('ai-agents').Agent;
const _ = require('lodash');
const goalTest = require('./goalTest');

class Ju{
    constructor(m, b) {
        this.movimiento = m
        this.board = b
    }
}

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }

    /**
     * Satoru
     */
    nextPlayer(player) {
        if(player == "1")
            return "2"
        return "1"
    }

    nextMoves(board, player) {
        var states_next = []
        for(let i= 0; i<5;i++) {
            for(let j=0;j<5;j++) {
                if (board[i][j] == "0") {
                    var copy_board = _.cloneDeep(board)
                    copy_board[i][j] = player
                    states_next.push(new Ju([i,j], copy_board))
                }
            }
        }

        return states_next
    }

    simulate(simulations) {

        var evaluacion = {}

        for(let s=0;s<simulations;s++) {
            var simulation = []
            var player = "1"
            var map_copy = []
            var nextNext = this.nextMoves(this.perception, player)
            var score = 5*5

            while (nextNext != []) {
                var random_move = Math.floor(Math.random() * (nextNext.length-1 - 0 +1 ))
                map_copy =  _.cloneDeep(nextNext[random_move].board)

                simulation.push([map_copy, nextNext[random_move].movimiento])
                if (goalTest(map_copy)) {
                    // if (player == "1")
                    //     console.log("GANO ganondorf")
                    // else
                    //     console.log("Gano chostoy")
                    break
                }

                score--
                player = this.nextPlayer(player)
                nextNext = this.nextMoves(map_copy, player)
            }

            var movimiento = simulation[0][1]
            if (player == "2" && goalTest(map_copy))
                score = score * -1

            if (movimiento in evaluacion) {
                evaluacion[movimiento] += score
            }
            else {
                evaluacion[movimiento] = score
            }
        }

        var bestOption = []
        var high = 0
        Object.entries(evaluacion).forEach(([key, val]) => {
            if (val > high) {
                high = val
                var pos = key.split(",")
                bestOption = [parseInt(pos[0]), parseInt(pos[1])]
            }
        })
        return bestOption
    }

    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */
    send() {
        let board = this.perception;
        if (this.getID() == "1") {
            return this.simulate(150)
        }
        else {
            let size = board.length;
            let available = getEmptyHex(board);
            let nTurn = size * size - available.length;
            console.log(nTurn)
            if (nTurn == 0) { // First move
                console.log([Math.floor(size / 2), Math.floor(size / 2) - 1])
                return [Math.floor(size / 2), Math.floor(size / 2) - 1];
            } else if (nTurn == 1) {
                console.log([Math.floor(size / 2), Math.floor(size / 2)])
                return [Math.floor(size / 2), Math.floor(size / 2)];
            }

            let move = available[Math.round(Math.random() * (available.length - 1))];
            return [Math.floor(move / board.length), move % board.length];
        }
    }

}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board 
 */
function getEmptyHex(board) {
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === 0) {
                result.push(k * size + j);
            }
        }
    }
    return result;
}

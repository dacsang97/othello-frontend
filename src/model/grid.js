import * as PIXI from 'pixi.js'
import Tile from './tile'
import whileTile from '../assets/white_tile.jpg'

export default class Grid {
  constructor(size, container, gameManager, playerNum = 0) {
    this.size = size
    this.container = container
    this.gm = gameManager
    console.log({ playerNum })
    // 0 for single, 1 for multi-player white, 2 for multi-player black
    this.playerNum = playerNum

    this.isMulti = playerNum !== 0

    // White start before
    if (this.playerNum === 0 || this.playerNum === 1) {
      this.isTurn = true
    } else {
      this.isTurn = false
    }

    this.current = 'white'

    this.numPlayed = 0

    this.grid = []
  }

  initBoard = () => {
    this.grid = []

    for (let x = 0; x < this.size; x++) {
      let row = (this.grid[x] = [])
      for (let y = 0; y < this.size; y++) {
        let color = null
        if ((x === 3 && y === 3) || (x === 4 && y === 4)) {
          color = 'white'
        }
        if ((x === 4 && y === 3) || (x === 3 && y === 4)) {
          color = 'black'
        }

        let tile = new Tile(new PIXI.Sprite.fromImage(whileTile), x, y, color)

        this.container.stage.addChild(tile.sprite)

        tile.sprite.mousedown = tile.sprite.touchstart = this.makeMove.bind(
          this,
          x,
          y,
          true,
        )

        row.push(tile)
      }
    }
    this.numPlayed = 4
    this.setTurn(this.current)
  }

  makeMove = (x, y, isOwnMove) => {
    console.log({ turn: this.isTurn })
    if (!this.isTurn && isOwnMove) return
    let moveColor = this.current
    console.log('move color: ' + moveColor)

    // remove game message
    if (this.numPlayed === 4) {
      this.gm.message = ''
    }

    let tile = this.grid[x][y]
    // if the tile is already used
    if (tile.color !== null) {
      tile.noFlipAnimate()
      return
    }

    //find a Array of tiles that needs to be flipped
    let allAlteredTiles = this.findAlteredTiles(tile, moveColor)
    if (allAlteredTiles.length <= 1) {
      tile.noFlipAnimate()
      return
    }

    let moveData = {}
    moveData['move'] = [x, y]
    this.numPlayed += 1

    //flip all pieces
    for (let i = 0; i < allAlteredTiles.length; i++) {
      allAlteredTiles[i].flip(moveColor)
    }

    this.updateCountsGraphics()

    //check for game-end conditions
    moveData['gameOver'] = this.handleGameOver()

    //if opponents cannot make a move, the current player keeps his turn
    if (this.opponentsMovesPossible(moveColor)) {
      this.current = this.flipColor(this.current)
      this.setTurn(this.current)

      //handle multiplayer player-switching
      if (this.isMulti) {
        if (isOwnMove) {
          this.gm.sendMove(moveData)
          this.isTurn = false
          this.gm.message = "Waiting for Opponent's Turn..."
        } else {
          this.isTurn = true
          this.gm.message = ''
        }
      }
    }
  }

  flipColor = color => {
    if (color === 'black') {
      return 'white'
    }
    if (color === 'white') {
      return 'black'
    }
    return null
  }

  handleGameOver = () => {
    if (
      this.numPlayed === this.size * this.size ||
      (!this.opponentsMovesPossible('white') &&
        !this.opponentsMovesPossible('black'))
    ) {
      this.gm.turn = ''
      const { white, black } = this.numColor()
      if (white > black) {
        this.gm.handleGameOver({
          win: 1,
        })
      } else if (white < black) {
        this.gm.handleGameOver({
          win: 2,
        })
      } else {
        this.gm.handleGameOver({
          tie: true,
        })
      }
      return true
    }
    return false
  }

  //returns true if there is a possible move for the next player, false otherwise
  opponentsMovesPossible = currentPlayer => {
    let nextPlayer = currentPlayer === 'white' ? 'black' : 'white'
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (
          !this.grid[x][y].color &&
          this.findAlteredTiles(this.grid[x][y], nextPlayer).length > 1
        ) {
          return true
        }
      }
    }
    return false
  }

  findAlteredTiles = (tile, currentPlayColor) => {
    let tiles = []
    tiles.push(tile) //add the tile itself

    //For all 8 directions, find the tiles that needs to be flipped
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i !== 0 || j !== 0) {
          // add the tiles that need to be flipeed for a particular direction
          tiles.push.apply(
            tiles,
            this.findTilesByDir(tile, currentPlayColor, i, j),
          )
        }
      }
    }

    return tiles
  }

  findTilesByDir = (tile, color, dirX, dirY) => {
    let tiles = []
    let currentRow = tile.row + dirX
    let currentCol = tile.col + dirY
    while (this.inBounds(currentRow, currentCol)) {
      if (!this.grid[currentRow][currentCol].color) break
      if (this.grid[currentRow][currentCol].color === color) {
        return tiles
      }

      // otherwise it is a opposite colored tile, push it to the array
      tiles.push(this.grid[currentRow][currentCol])
      currentRow += dirX
      currentCol += dirY
    }

    //no tiles can be flipped in this direction
    return []
  }

  numColor = () => {
    let white = 0
    let black = 0
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j].color === 'white') white++
        else if (this.grid[i][j].color === 'black') black++
      }
    }
    return {
      white,
      black,
    }
  }

  updateCountsGraphics = () => {
    const { white, black } = this.numColor()
    this.gm.white = white
    this.gm.black = black
  }

  // helper function to see if a tile is in bounds
  inBounds = (x, y) => {
    return x >= 0 && y >= 0 && x < this.size && y < this.size
  }

  setTurn = turn => {
    this.gm.turn = turn
  }
}

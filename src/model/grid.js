import * as PIXI from 'pixi.js'
import Tile from './tile'
import whileTile from '../assets/white_tile.jpg'

export default class Grid {
  constructor(size, container, gameManager, playerNum = 0) {
    this.size = size
    this.container = container
    this.gm = gameManager

    // 0 for single, 1 for multi-player white, 2 for multi-player black
    this.playerNum = 0

    this.isMulti = playerNum !== 0

    // White start before
    if (this.playerNum === 0 || this.playerNum === 1) {
      this.isTurn = true
    } else {
      this.isTurn = false
    }

    // 0 - white, 1 - black
    this.current = 0

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

        tile.sprite.mousedown = tile.sprite.touchstart = this.makeMove

        row.push(tile)
      }
    }
    this.numPlayed = 4
    this.setTurn(this.current)
  }

  makeMove = () => {
    console.log('ahihi')
  }

  setTurn = turn => {
    this.gm.turn = turn
  }
}

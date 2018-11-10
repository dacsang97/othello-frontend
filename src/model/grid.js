import * as PIXI from 'pixi.js'

import Tile from './tile'
import whileTile from '../assets/white_tile.jpg'

export default class Grid {
  constructor(size, container) {
    this.size = size
    this.container = container
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

        row.push(tile)
      }
    }
  }
}

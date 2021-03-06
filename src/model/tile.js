import * as TWEEN from '@tweenjs/tween.js'

export default class Tile {
  constructor(sprite, row, col, color) {
    this.color = color
    this.row = row
    this.col = col
    this.sprite = sprite
    this.animateInitial()
  }

  animateInitial = () => {
    this.sprite.buttonMode = true
    this.sprite.interactive = true

    this.sprite.position.x = Math.random() * 600
    this.sprite.position.y = -Math.random() * 100 - 100
    this.sprite.rotation = Math.random() * 2 * 3.14

    if (this.color == null) {
      //paint tile grey
      this.sprite.tint = 0x000000
      this.sprite.alpha = 0.1
    } else if (this.color == 'white') {
      this.sprite.tint = 0xffffff
      this.sprite.alpha = 1.0
    } else if (this.color == 'black') {
      this.sprite.tint = 0x000000
      this.sprite.alpha = 0.9
    }

    let row = this.row
    let col = this.col

    //initial spring animation
    new TWEEN.Tween(this.sprite)
      .to(
        { x: 7 + row * 80, y: 7 + col * 80, rotation: 0 },
        2400 + Math.random() * 1200,
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()
  }

  flip = color => {
    this.color = color

    // disable the player from clicking the tile while it is animating
    let tempMouseDown = this.sprite.mousedown
    this.sprite.mousedown = null

    if (this.color === 'white') {
      new TWEEN.Tween(this.sprite)
        .to({ width: 0.0, x: '+32' }, 300)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
          this.sprite.tint = 0xffffff
        })
        .chain(
          new TWEEN.Tween(this.sprite)
            .to({ alpha: 1.0, width: 64, x: '-32' }, 300)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
              this.sprite.mousedown = tempMouseDown
            }),
        )
        .start()
    } else {
      new TWEEN.Tween(this.sprite)
        .to({ width: 0.0, x: '+32' }, 300)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(() => {
          this.sprite.tint = 0x000000
        })
        .chain(
          new TWEEN.Tween(this.sprite)
            .to({ alpha: 0.9, width: 64, x: '-32' }, 300)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
              this.sprite.mousedown = tempMouseDown
            }),
        )
        .start()
    }
  }

  noFlipAnimate = () => {
    let tempMouseDown = this.sprite.mousedown

    this.sprite.mousedown = null

    new TWEEN.Tween(this.sprite)
      .to({ x: '+6' }, 50)
      .chain(
        new TWEEN.Tween(this.sprite).to({ x: '-12' }, 50).chain(
          new TWEEN.Tween(this.sprite).to({ x: '+6' }, 50).onComplete(() => {
            this.sprite.mousedown = tempMouseDown
          }),
        ),
      )
      .start()
  }
}

<template>
  <div>
    This is game page
    <div>
      <div id="whiteIndicator">
        <span class="count" id="whiteCount">2</span>
      </div>
      <canvas ref="game"></canvas>
      <div id="blackIndicator">
        <span class="count" id="blackCount">2</span>
      </div>
    </div>
    <div id="gameMessage">White starts. Good luck!</div>
  </div>
</template>

<script>
import Vue from 'vue'
import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'
import Grid from '../model/grid'

export default {
  data() {
    return {
      gameArea: null,
      grid: null,
      container: null,
      PIXIWrapper: {
        // Expose PIXI and the created app to all descendants.
        PIXI,
        PIXIApp: null,
      },
      EventBus: new Vue(),
    }
  },
  provide() {
    return {
      PIXIWrapper: this.PIXIWrapper,
      EventBus: this.EventBus,
    }
  },
  mounted() {
    this.gameArea = this.$refs.game
    this.startGame()
  },
  methods: {
    startGame() {
      this.PIXIWrapper.PIXIApp = new PIXI.Application(640, 640, {
        view: this.gameArea,
        backgroundColor: 0x888888,
      })
      this.grid = new Grid(8, this.PIXIWrapper.PIXIApp)
      this.grid.initBoard()
      this.animate()
    },
    animate() {
      requestAnimationFrame(this.animate)
      TWEEN.update()
    },
  },
}
</script>

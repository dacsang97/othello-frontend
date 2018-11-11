<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="8" class="text-center">
          <canvas ref="game"></canvas>
          <div id="gameMessage">{{ message }}</div>
        </b-col>
        <b-col md="4">
          <b-row>
            <b-col>
              <div
                :class="['card-user', 'white', { active: turn === 'white' }]"
              >
                <h5>{{ name1 }}</h5>
                <span class="count">{{ white }}</span>
              </div>
            </b-col>
            <b-col>
              <div
                :class="['card-user', 'black', { active: turn === 'black' }]"
              >
                <h5>{{ name2 }}</h5>
                <span class="count">{{ black }}</span>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'
import { mapGetters } from 'vuex'
import Grid from '../model/grid'

export default {
  data() {
    return {
      gameArea: null,
      grid: null,
      container: null,
      turn: '',
      message: 'White starts. Good luck!',
      win: null,
      PIXIWrapper: {
        // Expose PIXI and the created app to all descendants.
        PIXI,
        PIXIApp: null,
      },
      EventBus: new Vue(),
      white: 2,
      black: 2,
    }
  },
  computed: {
    ...mapGetters(['name1', 'name2', 'playerNum', 'gameId']),
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
      this.grid = new Grid(8, this.PIXIWrapper.PIXIApp, this, this.playerNum)
      this.grid.initBoard()
      this.animate()
      this.$io.socket.on('newMove', this.newMove)
    },
    sendMove(data) {
      this.$io.sendMove({
        ...data,
        gameId: this.gameId,
        playerNum: this.playerNum,
      })
    },
    newMove(data) {
      console.log('SocketClient: newMove received')
      if (this.playerNum !== data.playerNum) {
        this.receiveMove(data)
      }
    },
    receiveMove(data) {
      this.grid.makeMove(data['move'][0], data['move'][1], false)
    },
    animate() {
      requestAnimationFrame(this.animate)
      TWEEN.update()
    },
  },
}
</script>

<style lang="stylus" scoped>
.card-user {
  background-color: #fbeed7;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.25s ease-in;

  span {
    height: 18px;
    line-height: 18px;
    position: relative;
    padding-left: 24px;

    &:before {
      content: '';
      width: 18px;
      height: 18px;
      border-radius: 9px;
      position: absolute;
      border: 1px solid #000;
      top: 0;
      left: 0;
    }
  }

  &.white {
    span:before {
      background: #fff;
    }
  }

  &.black {
    span:before {
      background: #000;
    }
  }

  &.active {
    background: #ffba5a;
  }
}
</style>

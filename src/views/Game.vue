<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="8" class="text-center">
          <div
            class="game-tool d-flex mb-3 align-items-center justify-content-between"
          >
            <div id="gameMessage" class="d-flex justify-centent-start">
              <span class="name">System Message: </span> {{ message }}
            </div>
            <div>
              <b-button @click="surrender" variant="danger">Surrender</b-button>{{ ' ' }}
              <b-button @click="exit" variant="warning">Exit Room</b-button>
            </div>
          </div>
          <div class="game-area">
            <canvas ref="game"></canvas>
            <div :class="['message', { show: win || tie }]">
              <h1 v-if="win">{{ win }} won !!!</h1>
              <h1 v-if="tie">Tie !!!</h1>
            </div>
          </div>
        </b-col>
        <b-col md="4">
          <div>
            <div
              :class="[
                'card-user',
                'white',
                'mb-3',
                { active: turn === 'white' },
              ]"
            >
              <h5>{{ name1 }}</h5>
              <span class="count">{{ white }}</span>
            </div>
            <div :class="['card-user', 'black', { active: turn === 'black' }]">
              <h5>{{ name2 }}</h5>
              <span class="count">{{ black }}</span>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'
import { mapGetters, mapActions } from 'vuex'
import * as types from '../store/types'
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
      tie: false,
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
    ...mapActions({
      player1: types.PLAYER_1,
    }),
    startGame() {
      this.PIXIWrapper.PIXIApp = new PIXI.Application(640, 640, {
        view: this.gameArea,
        backgroundColor: 0x888888,
      })
      this.grid = new Grid(8, this.PIXIWrapper.PIXIApp, this, this.playerNum)
      this.grid.initBoard()
      this.animate()
      this.$io.socket.on('newMove', this.newMove)
      this.$io.socket.on('surrender', ({ win }) => {
        this.win = win
      })
      this.$io.socket.on('gameOver', ({ win, tie }) => {
        this.win = win
        this.tie = tie
      })
      this.$io.socket.on('exit', () => {
        if (this.playerNum === 2) {
          this.player1(this.name2)
        }
        this.$router.push('/room')
      })
    },
    surrender() {
      if (this.playerNum === 0) {
        if (this.turn === 'white') this.win = this.name2
        else this.win = this.name1
      } else {
        const win = this.playerNum === 1 ? 2 : 1
        this.$io.surrender({
          win,
          gameId: this.gameId,
        })
      }
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
    exit() {
      if (this.playerNum === 0) {
        this.$router.push('/')
      } else {
        this.$io.exit({
          gameId: this.gameId,
        })
      }
    },
    handleGameOver(data) {
      if (this.playerNum === 0) {
        if (data.win === 2) this.win = this.name2
        else if (data.win === 1) this.win = this.name1
        else this.tie = true
      } else {
        this.$io.gameOver({
          gameId: this.gameId,
          ...data,
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.card-user {
  background-color: #fbeed7;
  padding: 10px 15px;
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
  border-radius: 16px;
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

.game-tool {
  background: #fafafa;
  padding: 10px;
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
  border-radius: 16px;

  #gameMessage {
    flex: 1;
    border: 1px solid #ccc;
    margin-right: 10px;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;

    .name {
      font-weight: bold;
      margin-right: 5px;
    }
  }
}

.game-area {
  position: relative;
  background: #888;
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
  border-radius: 16px;

  .message {
    opacity: 0;
    display: none;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in;

    h1 {
      color: #fff;
    }

    &.show {
      display: flex;
      opacity: 1;
    }
  }
}
</style>

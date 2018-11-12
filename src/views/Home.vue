<template>
  <div class="home">
    <b-container>
      <b-row class="mt-3">
        <b-col md="4" offset-md="4" class="text-center">
          <b-card class="card-menu">
            <b-card-body>
              <h1 class="mt-2 mb-4 title">Othello Game</h1>
              <img
                src="data:image/png;base64,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"
              />
              <b-button block v-b-modal.modal1 class="mt-1">SINGLE COMPUTER GAME</b-button>
              <b-button block v-b-modal.modal2 class="mt-3">
                ONLINE GAME
              </b-button>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-modal
      ref="modal"
      id="modal1"
      title="Welcome to Othello Game"
      @ok="handleOk"
      @shown="clearName"
    >
      <form @submit.stop.prevent="handleSubmit">
        <b-form-group>
          <label>Player 1</label>
          <b-form-input v-model="name1" />
        </b-form-group>
        <b-form-group>
          <label>Player 2</label>
          <b-form-input v-model="name2" />
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      ref="modal2"
      id="modal2"
      title="Welcome to Othello Game"
      @ok="handleOkOnline"
      @shown="clearName"
    >
      <form @submit.stop.prevent="handleSubmitOnline">
        <b-form-group>
          <label>Your Name</label>
          <b-form-input v-model="name1" />
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import * as types from '../store/types'

export default {
  name: 'home',
  data() {
    return {
      name1: '',
      name2: '',
    }
  },
  methods: {
    ...mapActions({
      player1: types.PLAYER_1,
      player2: types.PLAYER_2,
    }),
    clearName() {
      this.name1 = ''
      this.name2 = ''
    },
    handleOk(evt) {
      evt.preventDefault()
      if (!this.name1 || !this.name2) {
        alert('Please enter player name')
      } else {
        this.handleSubmit()
      }
    },
    handleOkOnline(evt) {
      evt.preventDefault()
      if (!this.name1) {
        alert('Please enter your name')
      } else {
        this.handleSubmitOnline()
      }
    },
    handleSubmit() {
      if (!this.name1 || !this.name2) {
        alert('Please enter player name')
      } else {
        this.player1(this.name1)
        this.player2(this.name2)
        this.$refs.modal.hide()
        this.$router.push('/game')
      }
    },
    handleSubmitOnline() {
      if (!this.name1) {
        alert('Please enter your name')
      } else {
        this.player1(this.name1)
        this.$refs.modal2.hide()
        this.$router.push('/room')
      }
    },
  },
}
</script>

<style lang="stylus">
.home {
  .title {
    letter-spacing: 3px;
  }

  .card-menu {
    box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
    border-radius: 16px;
    border: 0;
  }
}
</style>

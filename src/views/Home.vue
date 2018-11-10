<template>
  <div class="home">
    <h1 class="text-center">Othello Game</h1>
    <b-container>
      <b-row>
        <b-col class="text-center">
          <b-button block v-b-modal.modal1>SINGLE COMPUTER GAME</b-button>
          <b-button block>CREATE ROOM GAME</b-button>
          <b-button block>JOIN EXISTS ROOM</b-button>
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
        </b-col>
      </b-row>
    </b-container>
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
  },
}
</script>

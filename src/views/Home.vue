<template>
  <div class="home">
    <h1 class="text-center">Othello Game</h1>
    <b-container>
      <b-row>
        <b-col class="text-center">
          <b-button v-b-modal.modal1 variant="primary">Play Game</b-button>
          <b-modal
            ref="modal"
            id="modal1"
            title="Welcome to Othello Game"
            @ok="handleOk"
            @shown="clearName"
          >
            <form @submit.stop.prevent="handleSubmit">
              <b-form-group>
                <label>Enter your name</label>
                <b-form-input v-model="name" />
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
      name: '',
    }
  },
  methods: {
    ...mapActions({
      playGame: types.PLAY_GAME,
    }),
    clearName() {
      this.name = ''
    },
    handleOk(evt) {
      evt.preventDefault()
      if (!this.name) {
        alert('Please enter your name')
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit() {
      if (!this.name) {
        alert('Please enter your name')
      } else {
        this.playGame(this.name)
        this.$refs.modal.hide()
        this.$router.push('/mode')
      }
    },
  },
}
</script>

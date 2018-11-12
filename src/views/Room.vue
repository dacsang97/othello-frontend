<template>
  <b-container>
    <b-row>
      <b-col>
        <div>
          <div class="float-right">
            <b-button v-b-modal.modalCreateGame :disabled="!!gameId">
              CREATE ROOM GAME
            </b-button>{{ ' ' }}
            <b-button v-b-modal.modal>JOIN EXISTS ROOM</b-button>
          </div>
          <h1>Hello {{ name1 }}</h1>
        </div>
        <hr />
      </b-col>
    </b-row>
    <b-row v-if="gameId">
      <b-col>
        <b-card>
          <b-card-body>Your Game ID: {{ gameId }}</b-card-body>
        </b-card>
        <hr />
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4" v-for="room in filteredRooms" :key="room.id">
        <b-card
          class="mb-4 card-room"
          @click="handleJoinRoom({ id: room.id, password: room.password })"
        >
          <b-card-body>
            <h1>{{ room.id }}</h1>
            <p>Created by {{ room.players[0].name }}</p>
            <p v-if="room.password">Password is required</p>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-modal
      ref="modal"
      id="modal"
      title="Join Game"
      @ok="handleOk"
    >
      <form @submit.stop.prevent="handleSubmit">
        <b-form-group>
          <label>Enter room ID</label>
          <b-form-input v-model="roomId" />
        </b-form-group>
        <b-form-group>
          <label>Enter room password</label>
          <b-form-input v-model="roomPassword" placeholder="Optional"/>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      ref="modalCreate"
      id="modalCreateGame"
      title="Create Game"
      @ok="handleOkCreate"
      @shown="clearPassword"
    >
      <form @submit.stop.prevent="handleSubmitCreate">
        <b-form-group>
          <label>Room Password</label>
          <b-form-input v-model="roomPassword" placeholder="Optional" />
        </b-form-group>
      </form>
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import * as types from '../store/types'

export default {
  data() {
    return {
      rooms: [],
      socketId: null,
      roomId: null,
      gameId: null,
      roomPassword: null,
    }
  },
  computed: {
    ...mapGetters(['name1']),
    filteredRooms() {
      return this.rooms.filter(room => {
        if (room.players.length === 2) return false
        return !room.players.map(player => player.id).includes(this.socketId)
      })
    },
  },
  mounted() {
    const { socket } = this.$io

    socket.on('connected', this.connected)
    socket.on('updateListRooms', this.updateRooms)
    socket.on('newGameCreated', this.updateInformation)
    socket.on('playerJoinedRoom', this.playerJoinedRoom)
    socket.on('inRoom', this.inRoom)

    socket.emit('getInfo')
  },
  methods: {
    ...mapMutations({
      setPlayerNum: types.SET_PLAYER_NUM,
      setGameId: types.SET_GAME_ID,
    }),
    ...mapActions({
      player1: types.PLAYER_1,
      player2: types.PLAYER_2,
    }),
    createNewGame() {
      this.$io.createGame({ name: this.name1, password: this.roomPassword })
      this.setPlayerNum(1)
    },
    joinGame(gameId) {
      this.$io.joinGame({
        gameId,
        name: this.name1,
        password: this.roomPassword,
      })
      this.setPlayerNum(2)
    },
    connected(data) {
      this.socketId = this.$io.socket.id
      this.updateRooms(data)
    },
    updateRooms({ rooms }) {
      this.rooms = rooms
    },
    updateInformation({ gameId, socketId }) {
      this.gameId = gameId
      this.socketId = socketId
    },
    playerJoinedRoom(data) {
      const { players, id } = data
      this.setGameId(id)
      this.player1(players[0].name)
      this.player2(players[1].name)
      this.$router.push('/game')
    },
    clearId() {
      this.roomPassword = ''
    },
    clearPassword() {
      this.roomPassword = ''
    },
    handleOkCreate() {
      this.handleSubmitCreate()
    },
    handleSubmitCreate() {
      this.createNewGame()
    },
    handleOk(evt) {
      evt.preventDefault()
      if (!this.roomId) {
        alert('Please enter room ID')
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit() {
      if (!this.roomId) {
        alert('Please enter room ID')
      } else {
        try {
          const id = Number.parseInt(this.roomId)
          this.joinGame(id)
        } catch (e) {
          alert('The room ID invalid')
        }
      }
    },
    inRoom() {
      alert('You are here !!!')
    },
    handleJoinRoom({ id, password }) {
      if (!password) {
        this.joinGame(id)
      } else {
        this.roomId = id
        this.$refs.modal.show()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.card-room {
  cursor: pointer;
}
</style>


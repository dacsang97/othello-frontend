<template>
  <b-container>
    <b-row>
      <b-col>
        <div>
          <div class="float-right">
            <b-button @click="createNewGame" :disabled="!!gameId">
              CREATE ROOM GAME
            </b-button>{{ ' ' }}
            <b-button>JOIN EXISTS ROOM</b-button>
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
        <b-card class="mb-4" @click="joinGame(room.id)">
          <b-card-body>{{ room.id }}</b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import * as types from '../store/types'

export default {
  data() {
    return {
      rooms: [],
      gameId: null,
      socketId: null,
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
      this.$io.createGame(this.name1)
      this.setPlayerNum(1)
    },
    joinGame(gameId) {
      this.$io.joinGame({ gameId, name: this.name1 })
      this.setPlayerNum(2)
    },
    connected(data) {
      console.log(this.$io.socket)
      this.socketId = this.$io.socket.id
      this.updateRooms(data)
    },
    updateRooms({ rooms }) {
      console.log('co update')
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
  },
}
</script>

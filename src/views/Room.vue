<template>
  <b-container>
    <b-row>
      <b-col>
        <div>
          <div class="float-right">
            <b-button
              variant="outline-secondary"
              v-b-modal.modalCreateGame
              :disabled="!!gameId"
            >
              CREATE ROOM GAME
            </b-button>{{ ' ' }}
            <b-button variant="outline-secondary" v-b-modal.modal>JOIN EXISTS ROOM</b-button>
          </div>
          <h3>Hello {{ name1 }}</h3>
        </div>
        <hr />
      </b-col>
    </b-row>
    <b-row v-if="gameId">
      <b-col>
        <div class="your-game">
          <b>Your Game ID:</b> {{ gameId }}
        </div>
        <hr />
      </b-col>
    </b-row>
    <b-row v-if="filteredRooms.length > 0">
      <b-col md="4" v-for="room in filteredRooms" :key="room.id">
        <div
          class="mb-4 card-room"
          @click="handleJoinRoom({ id: room.id, password: room.password })"
        >
          <div
            class="room-id d-flex justify-content-between align-items-center"
          >
            {{ room.id }} <i v-if="room.password" class="fas fa-key"></i>
          </div>
          <div class="created mt-2 d-flex justify-content-end">
            Created by <span class="author"> {{ room.players[0].name }}</span>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col class="text-center">
        <h5>No room available to join. Create new room to play game.</h5>
        <img
          style="width: 250px"
          src="https://nexus.leagueoflegends.com/wp-content/uploads/2018/02/balloons-03_ththqjulzqjay1n63ykc.png"
        />

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
.card-room, .your-game {
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
  border-radius: 16px;
  border: 0;
  background: #fff;
  padding: 20px;
}

.card-room {
  cursor: pointer;

  .room-id {
    border: 1px dashed #ccc;
    padding: 5px 5px 5px 15px;
    letter-spacing: 10px;
  }

  .created {
    color: #888;

    .author {
      color: #111;
      font-weight: bold;
      margin-left: 5px;
    }
  }
}

.your-game {
}
</style>

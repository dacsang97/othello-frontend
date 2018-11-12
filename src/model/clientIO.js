import io from 'socket.io-client'

const WS_URL = process.env.WS_URL || 'http://localhost:3000'
export default class ClientIO {
  constructor() {
    this.socket = io(WS_URL)

    this.socket.on('errMess', ({ message }) => {
      alert(message)
    })
  }

  createGame = ({ name, password }) => {
    this.socket.emit('hostCreateNewGame', { name, password })
    console.log('SocketClient: onCreateGameClick sent.')
  }

  joinGame = data => {
    this.socket.emit('playerJoinGame', data)
  }

  sendMove = data => {
    this.socket.emit('newMove', data)
  }

  surrender = data => {
    this.socket.emit('surrender', data)
  }

  exit = data => {
    this.socket.emit('exit', data)
  }

  gameOver = data => {
    this.socket.emit('gameOver', data)
  }
}

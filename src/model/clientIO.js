import io from 'socket.io-client'

export default class ClientIO {
  constructor() {
    this.socket = io('http://localhost:4200')
  }

  createGame = name => {
    this.socket.emit('hostCreateNewGame', { name })
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
}

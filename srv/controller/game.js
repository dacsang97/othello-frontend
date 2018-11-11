let io
let gameSocket
let rooms = []

exports.initGame = function(sio, socket) {
  io = sio
  gameSocket = socket
  gameSocket.emit('connected', {
    message: 'You are connected!',
    rooms,
  })

  gameSocket.on('hostCreateNewGame', hostCreateNewGame)
  gameSocket.on('disconnect', onDisconnect)
  // Player Events
  gameSocket.on('playerJoinGame', playerJoinGame)
  gameSocket.on('newMove', newMove)
  gameSocket.on('gameOver', gameOver)
}

function onDisconnect() {
  console.log(this.id)
  rooms = rooms.filter(room => room.players[0].id !== this.id)
  io.emit('updateListRooms', {
    rooms,
  })
}

function hostCreateNewGame(data) {
  // Create a unique Socket.IO Room
  var thisGameId = (Math.random() * 10000000) | 0

  rooms.push({
    id: thisGameId,
    players: [
      {
        id: this.id,
        name: data.name,
      },
    ],
  })

  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  this.emit('newGameCreated', {
    gameId: thisGameId,
    socketId: this.id,
    ...data,
  })

  io.emit('updateListRooms', {
    rooms,
  })

  // Join the Room and wait for the players
  this.join(thisGameId.toString())
}

function playerJoinGame(data) {
  console.log(
    'Player ' + data.name + ' attempting to join game: ' + data.gameId,
  )

  // A reference to the player's Socket.IO socket object
  // let sock = this

  // If the room exists
  let roomIds = rooms.map(room => room.id)
  if (roomIds.includes(data.gameId)) {
    console.log('Room is found.')

    const room = rooms.find(room => room.id)
    const playerNum = room.players.length

    if (playerNum === 1) {
      this.join(data.gameId)
      console.log('Player ' + data.playerName + ' joining game: ' + data.gameId)
      const player = {
        id: this.id,
        name: data.name,
      }
      room.players.push(player)
      io.emit('updateListRooms', {
        rooms,
      })
      io.sockets.in(data.gameId).emit('playerJoinedRoom', room)
    } else {
      this.emit('error', { message: 'This room is full' })
    }
  } else {
    this.emit('error', { message: 'This room does not exist.' })
  }
}

function newMove(data) {
  console.log('Received Move with data: ')
  console.log(data)
  io.sockets.in(data.gameId).emit('newMove', data)
}

function gameOver(data) {}

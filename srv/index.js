import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import { initGame } from './controller/game'

export default app => {
  const server = http.createServer(app)
  const io = socketIO(server)
  server.listen(4200)

  io.sockets.on('connection', function(socket) {
    initGame(io, socket)
  })
}

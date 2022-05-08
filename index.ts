const http = require('http')
const express = require('express')
const cors = require('cors')
const socketio = require('socket.io')

import { addRoom, changeRoomStatus, getRoom } from './controllers/rooms'
import { addUser, removeUser, getUser, getUsersInRoom } from './controllers/users'
import { ICallback, IRoom } from './models'

import { getCardsFromDir, getQuestionsFromTxtFile } from './utils'

import router from './router'
import { gameMove, gameNextMove, generateGame } from './controllers/game'

const app = express();

app.use(express.static('public'));
app.use('/source', express.static('source'));

const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket: any) => {
  socket.on('next', ({ gameId }, callback: ICallback) => {
    try {
      const game = gameNextMove(gameId)
      if (game) {
        io.to(game.roomId).emit('game', {
          game
        });
        callback({
          success: true, result: {
            game
          }
        });
      } else {
        callback({ success: false, error: 'Room not exist' });
      }
    } catch (e) {
      console.log({ e })
      callback({ success: false, error: e });
    }
  });
  socket.on('move', ({ gameId, userId, cardId }, callback: ICallback) => {
    try {
      const game = gameMove({ gameId, userId, cardId })
      if (game) {
        io.to(game.roomId).emit('game', {
          game
        });
        callback({
          success: true, result: {
            game
          }
        });
      } else {
        callback({ success: false, error: 'Room not exist' });
      }
    } catch (e) {
      console.log({ e })
      callback({ success: false, error: e });
    }
  });
  socket.on('startGame', ({ roomId }, callback: ICallback) => {
    try {
      const room = changeRoomStatus(roomId, 'in-progress')
      if (room) {
        const game = generateGame(room)
        io.to(roomId).emit('game', {
          game
        });
        io.to(roomId).emit('roomData', {
          room: room,
          users: getUsersInRoom(roomId)
        });
        callback({
          success: true, result: {
            room,
            game
          }
        });
      } else {
        callback({ success: false, error: 'Room not exist' });
      }
    } catch (e) {
      console.log({ e })
      callback({ success: false, error: e });
    }
  });
  socket.on('checkRoom', ({ roomId }, callback: ICallback) => {
    try {
      const room = getRoom(roomId)
      if (room) {
        callback({ success: true, result: room });
      } else {
        callback({ success: false, error: 'Room not exist' });
      }
    } catch (e) {
      console.log({ e })
      callback({ success: false, error: e });
    }
  });
  socket.on('createRoom', (data: { name: string, limit: number, userName: string }, callback: ICallback) => {
    try {
      const { name, limit } = data
      const room = addRoom({
        room: {
          name, limit,
          adminId: socket.id
        }
      });
      socket.join(room.id);
      callback({ success: true, result: room });
      console.log(`Created new room - ${room.id} - ${room.name}(${room.limit})`)
    } catch (e) {
      console.log({ e })
      callback({ success: false, error: e });
    }
  });
  socket.on('join', ({ name, roomId }: any, callback: ICallback) => {
    const room = getRoom(roomId)
    if (room) {
      const { error, user } = addUser({ id: socket.id, name: socket.id === room.adminId ? "Admin" : name, room });
      if (error) return callback({
        success: false,
        error
      });
      socket.join(roomId);
      socket.broadcast
        .to(roomId)
        .emit('message', { user: 'admin', text: `${user.name} has joined!` });

      io.to(roomId).emit('roomData', {
        room: room,
        users: getUsersInRoom(roomId)
      });
      callback({
        success: true,
        result: {
          room,
          user
        }
      });
    } else {
      callback({
        success: false,
        error: 'Room not exist'
      })
    }

  });

  socket.on('sendMessage', (message: any, callback: ICallback) => {
    const user = getUser(socket.id);
    io.to(user.roomId).emit('message', { user: user.name, text: message });
    callback({
      success: true
    });
  });

  socket.on('disconnect', () => {
    console.log("disconnect")
    const user = removeUser(socket.id);
    if (user) {
      const room = getRoom(user.roomId)
      if (room) {
        io.to(room.id).emit('message', {
          user: 'Admin',
          text: `${user.name} has left.`
        });
        io.to(room.id).emit('roomData', {
          room: room,
          users: getUsersInRoom(room.id)
        });
      }

    }
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server has started.`)
});
getCardsFromDir()
getQuestionsFromTxtFile()
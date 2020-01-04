const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const http = require('http')

const {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
} = require('./helpers/users')

const router = require('./routes/router')
const app = express()

// create cross origin 
app.use(cors())
// middlewares
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    // Sending initials when user join
    socket.on('join', ({
        name,
        room
    }, callback) => {
        const {
            error,
            user
        } = addUser({
            id: socket.id,
            name,
            room
        })
        // if error
        if (error) return callback(error)

        // emit event and return payload
        socket.emit('message', {
            user: 'admin',
            text: `${user.name}, welcome to the room ${user.room}`
        })
        // broadcast message to other users except the sender
        socket.broadcast.to(user.room).emit('message', {
            user: 'admin',
            text: `${user.name}. has joined!`
        })

        socket.join(user.room)
        // Getting users in the room
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    // Receive message/chat from user
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', {
            user: user.name,
            text: message
        })

        callback()
    })

    // Disconnect user
    socket.on('disconnect', () => {
        console.log('User disconnected')
        // remove user when disconnected
        const user = removeUser(socket.id)

        if (user) {
            // return admin and others users in the room
            io.to(user.room).emit('message', {
                user: 'admin',
                text: `${user.name} has left`
            })
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

// route
app.use(router)

const PORT = process.env.PORT || 5500

server.listen(PORT, () => console.log(`App running on PORT: ${PORT}`))
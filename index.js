const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const http = require('http')

const router = require('./router')
const app = express()

// create cross origin 
app.use(cors())
// middlewares
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    console.log('we have a new connection')

    socket.on('join', ({
        name,
        room
    }, callback) => {


        callback()
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

// route
app.use(router)

const PORT = process.env.PORT || 5500

server.listen(PORT, () => console.log(`App running on PORT: ${PORT}`))
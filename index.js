const express = require('express')
const socket = require('socket.io')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 5500

app.listen(PORT, ()=> console.log(`App running on PORT: ${PORT}`))
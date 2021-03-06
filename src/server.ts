
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'
import { entryPoint } from '@rpgjs/server'
import globalConfig from './config/server'
import modules from './modules'

const PORT = 3001

const app = express()
// console.log(app)
const server = http.createServer(app)

const io = new Server(server, {
    maxHttpBufferSize: 1e4,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(bodyParser.json())
const rpgGame = entryPoint(modules, { io, basePath: __dirname, globalConfig })
rpgGame.app = app // Useful for plugins (monitoring, backend, etc.)

app.use('/', express.static(__dirname + '/../client'))


server.listen(process.env.PORT || PORT, () => {
    rpgGame.start()
    console.log(`
        ===> MMORPG is running on http://localhost:${PORT} <===
    `)
}) 

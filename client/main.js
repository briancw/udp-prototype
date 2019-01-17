const dgram = require('dgram')
const {get} = require('./util.js')
const socket = dgram.createSocket({type: 'udp4'})
const serverAddress = '127.0.0.1'
const serverAuthPort = 3000
const serverUdpPort = 40000
const {encrypt, decrypt} = require('../encryption.js')

socket.on('message', (message) => {
    // console.log(message.toString())
})

let loginUrl = `http://${serverAddress}:${serverAuthPort}`
get(loginUrl)
.then((data) => {
    let {sessionId, encryptionKey} = JSON.parse(data)
    setInterval(() => {
        // const message = Buffer.from('heartbeat')
        const payload = encrypt(JSON.stringify({status: 'foo'}), encryptionKey)
        const messageString = `${sessionId},${payload}`
        const message = Buffer.from(messageString)
        socket.send(message, serverUdpPort, serverAddress)
    }, 1000)
})

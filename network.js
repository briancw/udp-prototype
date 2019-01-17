/* eslint-disable require-jsdoc */
const dgram = require('dgram')
const {encrypt, decrypt} = require('./encryption.js')
const auth = require('./auth.js')

class Network {
    constructor() {
        this.socket = dgram.createSocket({type: 'udp4', reuseAddr: false})
        const port = 40000
        this.cleanupTime = 5000

        this.clients = new Map()

        this.socket.on('message', this.message.bind(this))
        this.socket.bind(port)

        setInterval(this.cleanupClients.bind(this), 1000)
    }

    message(rawMessage, remote) {
        let message = rawMessage.toString().split(',')
        let [sessionId, payload] = message
        let decryptionKey = auth.sessions.get(sessionId)

        if (decryptionKey) {
            let messagePayload = decrypt(payload, decryptionKey)
            console.log(messagePayload)
        }

        // if (type === 'heartbeat') {
        //     let clientId = `${remote.address}:${remote.port}`
        //     let lastHeartbeat = Date.now()
        //     this.clients.set(clientId, {lastHeartbeat})
        //     console.log(`new heartbeat from ${remote.address}:${remote.port}, id: ${clientId}`)
        // }
    }

    cleanupClients() {
        this.clients.forEach(({lastHeartbeat}, clientId) => {
            let timeSinceLastHeartbeat = Date.now() - lastHeartbeat
            if (timeSinceLastHeartbeat > this.cleanupTime) {
                this.clients.delete(clientId)
            }
        })
    }

    sendToAll(message) {
        this.clients.forEach((clientData, clientId) => {
            this.send(message, clientId)
        })
    }

    sendToOne(clientId, message) {
        this.send(message, clientId)
    }

    send(message, fullAddress) {
        let messageBuffer = Buffer.from(message)
        let [address, port] = fullAddress.split(':')

        this.socket.send(messageBuffer, port, address, (err) => {
            if (err) {
                console.error(err)
            }
        })
    }
}

module.exports = new Network()

const http = require('http')
const crypto = require('crypto')

class Auth {
    constructor() {
        this.server = http.createServer()
        this.server.listen(3000)
        this.server.on('request', this.request.bind(this))

        this.sessions = new Map()
    }

    request(request, response) {
        this.authenticate(request, response)
    }

    authenticate(request, response) {
        let sessionId = crypto.randomBytes(16).toString('base64')
        let encryptionKey = crypto.randomBytes(16).toString('base64')
        response.setHeader('Content-Type', 'application/json')
        response.write(JSON.stringify({sessionId, encryptionKey}))
        response.end()
        this.sessions.set(sessionId, encryptionKey)
    }
}

module.exports = new Auth()

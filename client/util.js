const http = require('http')
const dgram = require('dgram')

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            let data = ''

            response.on('data', (chunk) => {
                data += chunk
            })

            response.on('end', () => {
                resolve(data)
            })
        })
    })
}

module.exports = {
    get,
}

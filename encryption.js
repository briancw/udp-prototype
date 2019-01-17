const crypto = require('crypto')
const algorithm = 'aes-256-ctr'

/**
 * Encrypt a message using an encryptionKey
 * @function encrypt
 * @param  {String} message         The data to be encrypted
 * @param  {Buffer} encryptionKey   A 256 byte (32 character) encryptionKey
 * @return {String} The encrypted data
 */
function encrypt(message, encryptionKey) {
    const key = crypto.createHash('sha256').update(encryptionKey).digest()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const encrypted = cipher.update(String(message), 'utf8', 'hex') + cipher.final('hex')
    return iv.toString('hex') + encrypted
}

/**
 * Decrypt a message
 * @function decrypt
 * @param  {String} encryptedMessage    The encrypted data
 * @param  {Buffer} encryptionKey       The encryption key used to decrypt this data
 * @return {String} The decrypted data
 */
function decrypt(encryptedMessage, encryptionKey) {
    const key = crypto.createHash('sha256').update(encryptionKey).digest()
    const stringValue = String(encryptedMessage)
    const iv = Buffer.from(stringValue.slice(0, 32), 'hex')
    const encrypted = stringValue.slice(32)
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

module.exports = {
    encrypt,
    decrypt,
}

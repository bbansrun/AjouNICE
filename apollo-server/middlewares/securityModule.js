const crypto = require('crypto')

const decodeTextBody = async (text) => {
  let buffer = Buffer.from(text, 'base64')
  const iv = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  const key = await crypto.subtle.importKey(
    'jwk', {
      kty: 'oct',
      kid: 'b48e9af0-34c1-4179-9ee3-c2ccab3c2786',
      k: 'Qtisu1fz9NZ0lTsBfTD8hMqRTWJnnpdqhDXGNwUoPfI',
      alg: 'A256GCM'
    },
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
  buffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    buffer
  )
  return buffer
}

const graphqlDecode = async (req, res, next) => {
  try {
    if (req.get('content-transfer-encoding') === 'base64') {
      const str = await decodeTextBody(req.body)
      req.body = JSON.parse(str)
      req.headers['content-type'] = 'application/json'
      req.graphqlWasEncoded = true
    }
    next()
  } catch (e) {
    next(e)
  }
}

module.exports = { graphqlDecode }

const shouldEncode = (url, options) => {
  // if (process.env.NODE_ENV === 'development') return false
  if (!options.method || options.method.toLowerCase() !== 'post') return false
  url = url.split('?')[0].split('#')[0]
  if (!url.endsWith('/graphql')) return false
  return true
}

const encodeTextBody = (text) => {
  const buffer = new Uint8Array(new TextEncoder().encode(text))
  return btoa(unescape(encodeURIComponent(String.fromCharCode.apply(null, buffer))))
}

const decodeTextBody = (text) => {
  const buffer = new Uint8Array(
    [...atob(text)].map(char => char.charCodeAt(0))
  )
  return new TextDecoder().decode(buffer)
}

const response = (req) => {
  const isCrypting = true
  const keys = []; const all = []; const headers = {}; let header

  req.getAllResponseHeaders()
    .replace(/^(.*?):\s*([\s\S]*?)$/gm, (m, key, value) => {
      keys.push((key = key.toLowerCase()))
      all.push([key, value])
      header = headers[key]
      headers[key] = header ? `${header},${value}` : value
    })

  return {
    ok: ((req.status / 200) | 0) === 1,
    status: req.status,
    statusText: req.statusText,
    url: req.responseURL,
    clone: response,
    text: async () => (isCrypting
      ? await decodeTextBody(req.responseText)
      : req.responseText
    ),
    json: async () => JSON.parse(isCrypting
      ? await decodeTextBody(req.responseText)
      : req.responseText
    ),
    blob: () => Promise.resolve(new Blob([req.response])),
    headers: {
      keys: () => keys,
      entries: () => all,
      get: n => headers[n.toLowerCase()],
      has: n => n.toLowerCase() in headers
    }
  }
}

const fetch = (url, options) => {
  options = options || {}
  const isEncoding = shouldEncode(url, options)
  return new Promise(async (resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open(options.method || 'get', url)
    for (const i in options.headers) {
      if (isEncoding && i.toLowerCase() === 'content-type') {
        req.setRequestHeader(i, 'text/plain; charset=UTF-8')
        req.setRequestHeader('Content-Transfer-Encoding', 'base64')
      } else {
        req.setRequestHeader(i, options.headers[i])
      }
    }
    req.withCredentials = options.credentials === 'include'
    req.onload = () => {
      resolve(response(req))
    }
    req.onerror = reject

    const body = options.body
    req.send(isEncoding ? await encodeTextBody(body) : body)
  })
}

module.exports = fetch

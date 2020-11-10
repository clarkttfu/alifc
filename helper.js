'use strict'

const url = require('url')

function buildCanonicalHeaders (headers, prefix) {
  const list = []
  const keys = Object.keys(headers)

  const fcHeaders = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    const lowerKey = key.toLowerCase().trim()
    if (lowerKey.startsWith(prefix)) {
      list.push(lowerKey)
      fcHeaders[lowerKey] = headers[key]
    }
  }
  list.sort()

  let canonical = ''
  for (let i = 0; i < list.length; i++) {
    const key = list[i]
    canonical += `${key}:${fcHeaders[key]}\n`
  }

  return canonical
}

function composeStringToSign (method, path, headers, queries) {
  const contentMD5 = headers['content-md5'] || ''
  const contentType = headers['content-type'] || ''
  const date = headers.date
  const signHeaders = buildCanonicalHeaders(headers, 'x-fc-')

  // eslint-disable-next-line node/no-deprecated-api
  const u = url.parse(path)
  const pathUnescaped = decodeURIComponent(u.pathname)
  let str = `${method}\n${contentMD5}\n${contentType}\n${date}\n${signHeaders}${pathUnescaped}`

  if (queries) {
    const params = []
    Object.keys(queries).forEach(function (key) {
      const values = queries[key]
      const type = typeof values
      if (type === 'string') {
        params.push(`${key}=${values}`)
        return
      }
      if (Array.isArray(values)) {
        queries[key].forEach(function (value) {
          params.push(`${key}=${value}`)
        })
      }
    })
    params.sort()
    str += '\n' + params.join('\n')
  }
  return str
}

module.exports = {
  composeStringToSign: composeStringToSign
}

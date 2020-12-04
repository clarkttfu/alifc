'use strict'

const assert = require('assert')
const crypto = require('crypto')
const axios = require('axios')

const helper = require('./helper')
const { parseOptions } = require('./parser')

const kEndpoint = Symbol('endpoint')
const kAccessKeySec = Symbol('accessKeySecret')
const kAccessKey = Symbol('accessKey')
const kAccountid = Symbol('accountid')
const kVersion = Symbol('version')
const kHost = Symbol('host')
const kAliDomain = Symbol('aliDomain')

class HttpBase {
  /**
   * @param {String|Object} endpointOpts
   */
  constructor (endpointOpts) {
    const { accountid, endpoint, host, alidomain } = parseOptions(endpointOpts)

    this[kHost] = host
    this[kVersion] = '2016-08-15'
    this[kAliDomain] = alidomain
    this[kAccountid] = accountid
    this[kEndpoint] = endpoint
  }

  get version () {
    return this[kVersion]
  }

  get accessKey () {
    return this[kAccessKey]
  }

  get requireSignature () {
    return false
  }

  buildHeaders (headers) {
    const now = new Date()
    const fcHeaders = {
      accept: 'application/json',
      date: now.toUTCString(),
      host: this[kHost],
      'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
      'x-fc-account-id': this[kAccountid]
    }
    return Object.assign(fcHeaders, headers)
  }

  request (method, path, data, axiosConfig = {}) {
    const isAlidomain = this[kAliDomain]
    const url = assertPath(path, this.version, isAlidomain)
    method = assertMethod(method)

    let queries = null
    if (isAlidomain) {
      queries = axiosConfig.params || {}
    }

    const headers = this.buildHeaders(axiosConfig.headers)
    if (this.requireSignature) {
      headers.authorization = signRequest(
        this[kAccessKey],
        this[kAccessKeySec],
        method, url, headers, queries
      )
    }

    const config = Object.assign({}, axiosConfig, {
      method,
      url,
      baseURL: this[kEndpoint],
      headers,
      params: queries
    })

    return axios.request(config)
  }

  get (url, config) {
    return this.request('GET', url, null, config)
  }

  delete (url, config) {
    return this.request('DELETE', url, null, config)
  }

  post (url, data, config) {
    return this.request('POST', url, data, config)
  }

  put (url, data, config) {
    return this.request('PUT', url, data, config)
  }
}

class HttpFunc extends HttpBase {
  constructor (accessKey, accessKeySecret, endpointOpts) {
    super(endpointOpts)
    assert(this[kAccessKey] = accessKey, 'accessKey is required')
    assert(this[kAccessKeySec] = accessKeySecret, 'accessKeySecret is required')
  }

  get requireSignature () {
    return true
  }
}

module.exports = {
  HttpBase,
  HttpFunc
}

/**
 * @param {String} accessKey
 * @param {String} accessKeySecret
 * @param {String} method GET POST PUT
 * @param {String} path '/proxy/service/func/'
 * @param {*} headers
 * @param {*} query
 */
function signRequest (accessKey, accessKeySecret, method, path, headers, query) {
  const stringToSign = helper.composeStringToSign(method, path, headers, query)
  const sign = signString(stringToSign, accessKeySecret)
  return `FC ${accessKey}:${sign}`
}

function signString (source, secret) {
  const buff = crypto.createHmac('sha256', secret)
    .update(source, 'utf8')
    .digest()
  return buff.toString('base64')
}

function assertMethod (method) {
  const supported = [
    'get', 'delete', 'post', 'put',
    'GET', 'DELETE', 'POST', 'PUT'
  ]
  if (supported.includes(method)) {
    return method.toUpperCase()
  }
}

function assertPath (path, version, isAlidomain = true) {
  assert(typeof path === 'string' && path.startsWith('/'))

  if (isAlidomain) {
    if (path.startsWith('/proxy/')) {
      return `/${version}${path}`
    } else {
      return `/${version}/proxy${path}`
    }
  }
  return path
}

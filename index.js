'use strict'

const assert = require('assert')
const crypto = require('crypto')
const axios = require('axios')
const helper = require('./helper')

const kAxios = Symbol('axios')
const kAccessKeySec = Symbol('accessKeySecret')
const kAccessKey = Symbol('accessKey')
const kAccountid = Symbol('accountid')
const kHost = Symbol('host')
const kVersion = Symbol('version')

class HttpFc {
  constructor (accessKey, accessKeySecret, endpointOpts) {
    const { accountid, axiosOptions, endpoint, host } = parseOptions(endpointOpts)

    this[kVersion] = '2016-08-15'
    this[kAccountid] = accountid
    this[kHost] = host
    assert(this[kAccessKey] = accessKey, 'accessKey is required')
    assert(this[kAccessKeySec] = accessKeySecret, 'accessKeySecret is required')

    this[kAxios] = Object.assign(axiosOptions, {
      baseURL: `${endpoint}/${this[kVersion]}/`
    })
  }

  get version () {
    return this[kVersion]
  }

  get accessKey () {
    return this[kAccessKey]
  }

  request (method, path, data, axiosConfig = {}) {
    const headers = this.buildHeaders(axiosConfig.headers)
    if (!path.startsWith('/')) {
      path = '/' + path
    }

    let queriesToSign = null
    if (path.startsWith('/proxy/')) {
      queriesToSign = axiosConfig.params || {}
    }
    const auth = signRequest(
      this[kAccessKey],
      this[kAccessKeySec],
      method, `/${this.version}${path}`, headers, queriesToSign
    )
    headers.authorization = auth

    const config = Object.assign({}, this[kAxios], axiosConfig, {
      method,
      url: path,
      headers,
      params: queriesToSign
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

  buildHeaders (headers) {
    const now = new Date()
    const fcHeaders = {
      accept: 'application/json',
      date: now.toUTCString(),
      host: this[kHost],
      'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch}) SDK`,
      'x-fc-account-id': this[kAccountid]
    }
    return Object.assign(fcHeaders, headers)
  }
}

module.exports = {
  HttpFc,
  parseAccountid,
  parseOptions
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

function parseOptions (endpointOptions) {
  if (typeof endpointOptions === 'object') {
    const url = new URL(endpointOptions.endpoint)
    if (/[0-9]{6,20}/.test(endpointOptions.accountid)) {
      assert(url, 'endpoint is not valid url')
      const res = {
        host: url.host,
        accountid: endpointOptions.accountid,
        endpoint: endpointOptions.endpoint
      }
      delete endpointOptions.endpoint
      delete endpointOptions.accountid
      res.axiosOptions = endpointOptions
      return res
    } else {
      const accountid = parseAccountid(endpointOptions.endpoint)
      const res = {
        host: url.host,
        accountid,
        endpoint: endpointOptions.endpoint
      }
      delete endpointOptions.endpoint
      res.axiosOptions = endpointOptions
      return res
    }
  }

  const url = new URL(endpointOptions)
  const accountid = parseAccountid(endpointOptions)
  return {
    host: url.host,
    accountid,
    endpoint: endpointOptions,
    axiosOptions: {}
  }
}

function parseAccountid (url) {
  const regex = /^(http|https):\/\/([0-9]{6,20})\.([a-z]{2}-[a-z]{2,}(-[1-9])?)(-internal)?\.fc.aliyuncs.com$/
  const match = regex.exec(url)
  assert(match, `invalid endpoint url: ${url}`)
  return match[2] // accountid
}

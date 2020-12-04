const assert = require('assert')

module.exports = {
  parseOptions, parseEndpoint, isAlidomain
}

const domain = 'fc.aliyuncs.com'

const rgxProtocol = /(http|https)/
const rgxAccountid = /([0-9]{6,20})/
const rgxRegion = /([a-z]{2}-[a-z]{2,}(?:-[1-9])?)/

/**
 * @typedef {Object} EndpointOptions
 * @property {String} endpoint
 * @property {String} accountid?
 * @property {String} host?
 * @property {Boolean} alidomain?
 */

/**
 * Parse endpoint string or axiosConfig object with endpoint/accountid field.
 * @param {EndpointOptions|String} endpointOptions
 * @returns {EndpointOptions} { host, alidomain, accoundid, endpoint }
 */
function parseOptions (endpointOptions) {
  if (typeof endpointOptions === 'object') {
    const url = new URL(endpointOptions.endpoint)
    assert(url, 'endpoint is not valid url')

    if (rgxAccountid.test(endpointOptions.accountid)) {
      return {
        host: url.host,
        alidomain: isAlidomain(url.hostname),
        accountid: endpointOptions.accountid,
        endpoint: endpointOptions.endpoint
      }
    } else {
      const endpoint = endpointOptions.endpoint
      const { accountid, alidomain } = parseEndpoint(endpoint)
      return {
        host: url.host,
        alidomain,
        accountid,
        endpoint
      }
    }
  }

  const url = new URL(endpointOptions)
  const { accountid, alidomain } = parseEndpoint(endpointOptions)
  return {
    alidomain,
    host: url.host,
    accountid,
    endpoint: endpointOptions
  }
}

/**
 * Parse *.fc.aliyun.com endpoint url
 * @param {String} url of aliyun fc endpoint
 * @returns {Ojbect} { protocol, accountid, region, internal: boolean, alidomain: boolean }
 */
function parseEndpoint (url) {
  const pattern = `^${rgxProtocol.source}://${rgxAccountid.source}.${rgxRegion.source}(-internal)?.${domain}$`
  const match = new RegExp(pattern).exec(url)
  assert(match, `invalid endpoint url: ${url}`)
  return {
    protocol: match[1],
    accountid: match[2],
    region: match[3],
    internal: !!match[4],
    alidomain: true
  }
}

/**
 * @param {String} url
 * @returns {Boolean}
 */
function isAlidomain (url) {
  return typeof url === 'string' && url.endsWith(domain)
}

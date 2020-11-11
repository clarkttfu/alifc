const test = require('tape')
const { parseEndpoint, parseOptions, isAlidomain } = require('../parser.js')

test('isAlidomain', t => {
  t.ok(isAlidomain('fc.aliyuncs.com'), 'domain')
  t.ok(isAlidomain('abc.fc.aliyuncs.com'), 'sub domain')
  t.notOk(isAlidomain('abc.fc.aliyuncs.com:8080'), 'should not include port')
  t.notOk(isAlidomain('abc.com'), 'abc.com')
  t.notOk(isAlidomain(), 'undefined')
  t.notOk(isAlidomain(null), 'null')
  t.notOk(isAlidomain(''), 'empty')
  t.end()
})

test('parseEndpoint 1', t => {
  const {
    accountid,
    protocol,
    region,
    internal
  } = parseEndpoint('https://1234567890123456.ap-southeast-5.fc.aliyuncs.com')
  t.equal(protocol, 'https', protocol)
  t.equal(accountid, '1234567890123456', accountid)
  t.equal(region, 'ap-southeast-5', region)
  t.notOk(internal, 'not internal')
  t.end()
})

test('parseEndpoint 2', t => {
  const {
    accountid,
    protocol,
    region,
    internal
  } = parseEndpoint('http://0123456789012345.cn-hangzhou-internal.fc.aliyuncs.com')
  t.equal(protocol, 'http', protocol)
  t.equal(accountid, '0123456789012345', accountid)
  t.equal(region, 'cn-hangzhou', region)
  t.ok(internal, 'internal')
  t.end()
})

test('parseOption string', t => {
  const {
    host,
    alidomain,
    accountid,
    endpoint
  } = parseOptions('https://1234567890987654.ap-southeast-5.fc.aliyuncs.com')
  t.equal(host, '1234567890987654.ap-southeast-5.fc.aliyuncs.com', host)
  t.equal(accountid, '1234567890987654', accountid)
  t.equal(endpoint, 'https://1234567890987654.ap-southeast-5.fc.aliyuncs.com', endpoint)
  t.ok(alidomain, 'alidomain')
  t.end()
})

test('parseOption object', t => {
  const {
    host,
    alidomain,
    accountid,
    endpoint
  } = parseOptions({ endpoint: 'https://0987654.us-west-1.fc.aliyuncs.com' })
  t.equal(host, '0987654.us-west-1.fc.aliyuncs.com', host)
  t.equal(accountid, '0987654', accountid)
  t.equal(endpoint, 'https://0987654.us-west-1.fc.aliyuncs.com', endpoint)
  t.ok(alidomain, 'alidomain')
  t.end()
})

test('parseOption object', t => {
  const {
    host,
    alidomain,
    accountid,
    endpoint
  } = parseOptions({ accountid: '0987654', endpoint: 'http://my.endpoint.com' })
  t.equal(host, 'my.endpoint.com', host)
  t.equal(accountid, '0987654', accountid)
  t.equal(endpoint, 'http://my.endpoint.com', endpoint)
  t.notOk(alidomain, 'alidomain')
  t.end()
})

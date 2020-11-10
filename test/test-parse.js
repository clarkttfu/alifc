const test = require('tape')
const { parseAccountid, parseOptions } = require('../index.js')

test('parseEndpoint', t => {
  const accountid1 = parseAccountid('https://1234567890123456.ap-southeast-5.fc.aliyuncs.com')
  t.equal(accountid1, '1234567890123456', accountid1)
  const accountid2 = parseAccountid('http://1234567890123456.cn-hangzhou-internal.fc.aliyuncs.com')
  t.equal(accountid2, '1234567890123456', accountid1)
  t.end()
})

test('parseOption string', t => {
  const {
    host,
    accountid,
    endpoint,
    axiosOptions
  } = parseOptions('https://1234567890987654.ap-southeast-5.fc.aliyuncs.com')
  t.equal(host, '1234567890987654.ap-southeast-5.fc.aliyuncs.com', host)
  t.equal(accountid, '1234567890987654', accountid)
  t.equal(endpoint, 'https://1234567890987654.ap-southeast-5.fc.aliyuncs.com', endpoint)
  t.deepEqual(axiosOptions, {})
  t.end()
})

test('parseOption object', t => {
  const {
    host,
    accountid,
    endpoint,
    axiosOptions
  } = parseOptions({ endpoint: 'https://0987654.us-west-1.fc.aliyuncs.com' })
  t.equal(host, '0987654.us-west-1.fc.aliyuncs.com', host)
  t.equal(accountid, '0987654', accountid)
  t.equal(endpoint, 'https://0987654.us-west-1.fc.aliyuncs.com', endpoint)
  t.deepEqual(axiosOptions, {})
  t.end()
})

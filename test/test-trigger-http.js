const test = require('tape')
const { HttpFc } = require('../index.js')

require('dotenv').config()

const {
  FC_ACCESS_KEY: accessKey,
  FC_ACCESS_KEY_SEC: accessKeySecret,
  FC_ACCESS_EP: endpoint
} = process.env

test.only('HttpFc.get', t => {
  const httpFc = new HttpFc(accessKey, accessKeySecret, endpoint)
  t.ok(httpFc)
  httpFc.get('/proxy/test/foo/').then(res => {
    t.equal(res.status, 200)
    t.end()
  })
})

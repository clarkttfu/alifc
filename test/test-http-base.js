const test = require('tape')
const { HttpBase } = require('../index.js')

require('dotenv').config()

const {
  FC_ACCESS_KEY: accessKey,
  FC_ACCESS_KEY_SEC: accessKeySecret,
  FC_ACCESS_EP: endpoint
} = process.env

const httpBase = new HttpBase(accessKey, accessKeySecret, endpoint)

test('HttpBase constructor', t => {
  t.ok(httpBase, 'constructor')
  t.equal(httpBase.accessKey, accessKey)
  t.end()
})

test('HttpBase.get', t => {
  Promise.all([
    httpBase.get('/test/bar/'),
    httpBase.get('/proxy/test/bar/')
  ])
    .then(([res1, res2]) => {
      t.equal(res1.status, 200, '/service/func/')
      t.equal(res2.status, 200, '/proxy/service/func/')
      t.end()
    })
})

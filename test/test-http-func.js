const test = require('tape')
const { HttpFunc } = require('../index.js')

require('dotenv').config()

const {
  FC_ACCESS_KEY: accessKey,
  FC_ACCESS_KEY_SEC: accessKeySecret,
  FC_ACCESS_EP: endpoint
} = process.env

const httpFunc = new HttpFunc(accessKey, accessKeySecret, endpoint)

test('HttpFunc constructor', t => {
  t.ok(httpFunc, 'constructor')
  t.end()
})

test('HttpFc.get', t => {
  Promise.all([
    httpFunc.get('/test/foo/'),
    httpFunc.get('/proxy/test/foo/')
  ])
    .then(([res1, res2]) => {
      t.equal(res1.status, 200, '/service/func/')
      t.equal(res2.status, 200, '/proxy/service/func/')
      t.end()
    })
})

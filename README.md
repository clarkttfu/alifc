Minimal Aliyun FC Utility
===

For those who prefer a simpler http client than @alicloud/fc2.

## Install
```
npm i alifc
```

## Usage

HttpBase is wrapper of aixos that set the '/version/proxy/' baseURL for you.  
HttpFunc also sign the request to pass function Authorization.

```
const { HttpBase, HttpFunc } = require('alifc')
const func = new HttpFunc(
  accessKey,
  accessKeySecret
  endpoint
)

func.get('/service/func') // axios Promise
```

## Test requirements

- A fc service named 'test'
- 2 functions under 'test:
  - foo: which use function authorization
  - bar: which accept anonymous request
- 3 environment variables (or set them via .env):
  - FC_ACCESS_KEY: accessKey,
  - FC_ACCESS_KEY_SEC: accessKeySecret,
  - FC_ACCESS_EP: endpoint

## Reference

- [fc-nodejs-sdk](https://github.com/aliyun/fc-nodejs-sdk)
- [Create a trigger](https://www.alibabacloud.com/help/doc-detail/74769.htm)
- [Authorization](https://www.alibabacloud.com/help/doc-detail/53252.html)
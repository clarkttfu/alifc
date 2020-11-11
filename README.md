Minimal Aliyun FC Utility
===

For those who merely need a http trigger invoker.

## Install
```
npm i alifc
```

## Usage

HttpBase is wrapper of aixos that build aliyun fc headers for you, see buildHeaders method
HttpFunc also sign the request to pass function Authorization 

```
const { HttpBase, HttpFunc } = require('alifc')
const httpFc = new HttpFc(
  accessKey,
  accessKeySecret
  endpoint
)
```

## Reference

- [fc-nodejs-sdk](https://github.com/aliyun/fc-nodejs-sdk)
- [Create a trigger](https://www.alibabacloud.com/help/doc-detail/74769.htm)
- [Authorization](https://www.alibabacloud.com/help/doc-detail/53252.html)
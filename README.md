Minimal Aliyun FC Utility
===

## Install
```
npm i alifc
```

## Usage

HttpFc is a wrapper of aixos but sign the authorization header for you

```
const { HttpFc } = require('alifc')
const httpFc = new HttpFc(
  accessKey,
  accessKeySecret
  endpoint
)
```
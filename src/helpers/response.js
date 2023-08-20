const pjson = require('../../package.json')

module.exports = response = (resp, code, message, data = null) => {
  let res = code >= 400 ? 'error' : 'data'
  const results = {
    [res]: data,
    message,
    version: pjson.version
  }
  return resp.status(code).send(results)
}
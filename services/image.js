var request = require('request')

var BASE_URL = "https://api.cognitive.microsoft.com/bing/v7.0/images"

var HEADERS = {
  "Ocp-Apim-Subscription-Key" : process.env["BING_API_KEY1"]
}

function search(options, callback) {
  options.count = 10
  request({
    baseUrl: BASE_URL,
    uri: 'search',
    headers: HEADERS,
    qs: options
  }, function(error, response, body) {
    var res, err
    if (!error && response.statusCode < 400) {
      res = JSON.parse(body).value.map(function(val) {
        return {
          url: val.contentUrl,
          thumbnail: val.thumbnailUrl,
          snippet: val.name,
          context: val.hostPageUrl
        }
      })
    } else {
      err = true
      res = JSON.parse(body)
    }
    callback(err, res)
  })
}

module.exports = { search }
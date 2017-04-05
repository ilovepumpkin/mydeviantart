var baseUrl = "https://www.deviantart.com"
var util = require('./util')

var wxRequest = util.wxPromisify(wx.request)

module.exports.fetchAccessToken = function() {
    return wxRequest({
        url: baseUrl + '/oauth2/token',
        data: {
            "grant_type": "client_credentials"
        },
        method: "POST",
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: "Basic NjAyMTplYWVkZjBhYmI5NDU1Y2Q5Y2Y4MGJjNTg4Yzc5ZDNjMw=="
        }
    }).then((res) => {
        console.log(res.data)

        var accessToken = res.data["access_token"]
        wx.setStorageSync("accessToken", accessToken)
    })
}

module.exports.getFolders = function(){

}

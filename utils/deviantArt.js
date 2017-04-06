var baseUrl = "https://www.deviantart.com"
var apiBaseUrl = baseUrl + "/api/v1/oauth2"
var util = require('./util')

var wxRequest = util.wxPromisify(wx.request)

function basicConfig(path, options) {
    var access_token = wx.getStorageSync("access_token");
    let data = {
        "access_token": access_token,
        username: "ilovepumpkin2014"
    };
    data = Object.assign({}, data, options)
    return {
        url: apiBaseUrl + path,
        data: data,
        header: {
            'content-type': 'application/json'
        }
    }
}

function authenticate() {
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
        console.log(res.data);

        var accessToken = res.data["access_token"];
        wx.setStorageSync("access_token", accessToken);
    })
}

function getFolders() {
    return authenticate().then(function() {
        return wxRequest(basicConfig("/gallery/folders")).then(function(res) {
            return res.data["results"];
        });
    })
}

function getAll(options) {
    return authenticate().then(function() {
        return wxRequest(basicConfig("/gallery/all", options)).then(function(res) {
            return res.data;
        });
    })
}

function getComments(deviationid) {
    return authenticate().then(function() {
        return wxRequest(basicConfig("/comments/deviation/" + deviationid)).then(function(res) {
            return res.data["thread"];
        });
    })
}

module.exports = {
    "authenticate": authenticate,
    "getAll": getAll,
    "getComments": getComments
}
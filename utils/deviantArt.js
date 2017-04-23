var baseUrl = "https://www.deviantart.com"
var apiBaseUrl = baseUrl + "/api/v1/oauth2"
var util = require('./util')

var wxRequest = util.wxPromisify(wx.request)

const KEY_ACCESS_TOKEN = "access_token"

function basicConfig(path, options) {
    var access_token = wx.getStorageSync(KEY_ACCESS_TOKEN)["token"];
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

function placebo() {
    return wxRequest({
        url: apiBaseUrl + '/placebo'
    });
}

function authenticate() {
    var access_token = wx.getStorageSync(KEY_ACCESS_TOKEN);
    var now = Date.now()
    var expiresTime = access_token["expires_time"]
    console.log("Checking if the access token is expired or not: now - " + now + ", expiresTime - " + expiresTime);
    if (!expiresTime || now > expiresTime) {
        console.log("The access_token is expired, retrieve it again.");
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
            let expires_time = Date.now() + res.data["expires_in"] * 1000;
            let tokenObj = {
                "token": accessToken,
                "expires_time": expires_time
            }
            console.log(tokenObj);
            wx.setStorageSync(KEY_ACCESS_TOKEN, tokenObj);
        });
    } else {
        console.log("The access_token is not expired.");
        return new Promise((resolve, reject) => {
            resolve();
        })
    }
}

function whoami() {
    return authenticate().then(function() {
        return wxRequest(basicConfig("/user/profile/ilovepumpkin2014?expand=user.stats,user.details,user.geo")).then(function(res) {
            return res.data;
        });
    })
}

function getFolders() {
    return authenticate().then(function() {
        return wxRequest(basicConfig("/gallery/folders")).then(function(res) {
            return res.data["results"];
        });
    })
}

function getDeviation(deviationid) {
    return authenticate().then(function() {
        return wxRequest(basicConfig(`/deviation/${deviationid}`)).then(function(res) {
            return res.data;
        });
    })
}

function getFolderDeviations(folderid, options) {
    return authenticate().then(function() {
        return wxRequest(basicConfig("/gallery/" + folderid, options)).then(function(res) {
            return res.data;
        });
    })
}

function getComments(deviationid, options) {
    return authenticate().then(function() {
        return wxRequest(basicConfig("/comments/deviation/" + deviationid, options)).then(function(res) {
            return res;
        });
    })
}

function search(keyword) {
    let url = "https://backend.deviantart.com/rss.xml?type=deviation&q=by:ilovepumpkin2014 sort:time meta:all " + keyword;
    return wxRequest({
        url,
        dataType: "xml",
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }).then(function(res) {
        return res.data;
    });
}

module.exports = {
    authenticate,
    getFolderDeviations,
    getComments,
    getDeviation,
    whoami,
    search
}
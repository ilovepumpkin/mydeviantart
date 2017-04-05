var dA = require('../../utils/deviantArt.js')

var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {}
    },
    onLoad: function() {
      dA.fetchAccessToken()
    }
})

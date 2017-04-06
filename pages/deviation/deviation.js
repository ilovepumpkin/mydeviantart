var dA = require('../../utils/deviantArt.js')

Page({
  data: {
    deviation: {}
  },
  onLoad: function(option) {
    var deviationid = option.deviationid;
    let self = this;
    dA.getDeviation(deviationid).then(function(res) {
      self.setData({
        deviation: res
      })
    });

  }
})
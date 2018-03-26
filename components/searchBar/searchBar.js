var util = require('../../utils/util.js');

let caller = null;
let isEnterSearch;

let touchStart = 0;
let touchEnd = 0;

function onPhotoTouchStart(e) {
  touchStart = e.timeStamp;
  console.log('touchStart:' + touchStart);
}

function onPhotoTouchEnd(e) {
  touchEnd = e.timeStamp;
  console.log('touchStart:' + touchStart);
}

function onPhotoTouchTap(e) {
  const touchTime = touchEnd - touchStart;
  console.log('touchTime:' + touchTime);

  if (touchTime > 350) {
    /*long tap*/
    const authorPage = 'pages/author/author';
    const pages = getCurrentPages();
    if (pages[pages.length - 1].route !== authorPage) {
      wx.navigateTo({
        url: '/' + authorPage
      });
    }
  } else {
    // tap
    const pages = getCurrentPages();
    if (pages[pages.length - 1].route === 'pages/gallery/gallery') {
      getApp().globalData.showAuthorPicker();
    }

    // const url = "/pages/deviation/deviation?deviationid=" + deviationid
    // wx.navigateTo({
    //     url
    // })
    // wx.previewImage({
    //     current: dataset.fullsizeurl,
    //     urls: getApp().globalData.imageUrls
    // })
  }
}

const searchActiveChangeinput = function(e) {
  const val = e.detail.value;
  this.setData({
    'search.showClearBtn': val != '' ? true : false,
    'search.searchValue': val
  });
  if (!isEnterSearch) {
    caller.doSearch(val);
  }
};

const searchActiveChangeclear = function(e) {
  this.setData({
    'search.showClearBtn': false,
    'search.searchValue': ''
  });
  caller.doSearchClear();
};

const handleEnterSearch = function(e) {
  const val = e.detail.value;
  if (isEnterSearch) {
    caller.doSearch(val);
  }
};

function init(that, enterSearch) {
  caller = that;
  for (let func in this) {
    that[[func]] = this[func];
  }
  isEnterSearch = enterSearch;
  // that["authorPhotoUrl"]=util.getCurrentUser()["usericon"]
}

export default {
  init,
  searchActiveChangeinput,
  searchActiveChangeclear,
  handleEnterSearch,
  onPhotoTouchStart,
  onPhotoTouchEnd,
  onPhotoTouchTap
};

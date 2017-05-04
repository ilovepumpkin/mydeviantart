import { deleteBookmark, addBookmark } from '../../utils/bookmark'

var touchStart = 0;
var touchEnd = 0

var menuItems = [];

var deleteBookmarkCallback = () => {
};

const MI_ADD_BOOKMARK = "add_bookmark"
const MI_DELETE_BOOKMARK = "delete_bookmark"

function onTouchStart(e) {
    touchStart = e.timeStamp;
    console.log("touchStart:" + touchStart);
}

function onTouchEnd(e) {
    touchEnd = e.timeStamp;
    console.log("touchStart:" + touchStart);
}

function onTouchTap(e) {
    const touchTime = touchEnd - touchStart;
    console.log("touchTime:" + touchTime);

    const deviationid = e.currentTarget.id
    const dataset = e.currentTarget.dataset

    if (touchTime > 350) {
        /*long tap*/
        showActionSheet(deviationid, dataset.title, dataset.src, dataset.width, dataset.height);
    } else {
        // tap
        const url = "/pages/deviation/deviation?deviationid=" + deviationid
        wx.navigateTo({
            url
        })
    }
}

function showActionSheet(deviationid, title, thumbSrc, thumbWidth, thumbHeight) {
    const self = this;
    const itemList = menuItems.map((mi) => mi.text);
    wx.showActionSheet({
        itemList: itemList,
        success: function(res) {
            console.log(res.tapIndex)
            if (res.tapIndex) {
                menuItems[res.tapIndex].handler(deviationid, title, thumbSrc, thumbWidth, thumbHeight)
            }
        },
        fail: function(res) {
            console.log(res.errMsg)
        }
    })
}

function init(that, userFeatures, deleteBookmarkCB) {
    for (let func in this) {
        that[[func]] = this[func]
    }

    if (deleteBookmarkCB) {
        deleteBookmarkCallback = deleteBookmarkCB
    }

    if (userFeatures) {
        initMenuItems(userFeatures)
    }
}
;

function handleAddBookmark(deviationid, title, thumbSrc, thumbWidth, thumbHeight) {
    const result2 = addBookmark(deviationid, title, thumbSrc, thumbWidth, thumbHeight);
    if (result2) {
        wx.showToast({
            title: "收藏成功啦！",
            icon: "success",
            duration: 1500
        })
    } else {
        wx.showToast({
            title: "哎呦，收藏出错了！",
            duration: 1500
        })
    }
}

function handleDeleteBookmark(deviationid) {
    const result = deleteBookmark(deviationid)
    if (result) {
        wx.showToast({
            title: "删除成功啦！",
            icon: "success",
            duration: 1500
        })
        deleteBookmarkCallback();
    } else {
        wx.showToast({
            title: "哎呦，删除出错了！",
            duration: 1500
        })
    }
}

function initMenuItems(features) {
    let items = []
    if (features[MI_ADD_BOOKMARK]) {
        items.push({
            text: "收藏",
            handler: handleAddBookmark
        })
    }
    if (features[MI_DELETE_BOOKMARK]) {
        items.push({
            text: "删除",
            handler: handleDeleteBookmark
        })
    }
    menuItems = items;
}

export default {
    onTouchStart,
    onTouchEnd,
    onTouchTap,
    init,
    MI_ADD_BOOKMARK,
    MI_DELETE_BOOKMARK
}
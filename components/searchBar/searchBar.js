var util = require("../../utils/util.js");

let caller=null;
let isEnterSearch;

const searchActiveChangeinput = function (e) {
    const val = e.detail.value;
    this.setData({
        'search.showClearBtn': val != '' ? true : false,
        'search.searchValue': val
    })
    if(!isEnterSearch){
        caller.doSearch(val)
    }
}

const searchActiveChangeclear = function (e) {
    this.setData({
        'search.showClearBtn': false,
        'search.searchValue': ''
    })
    caller.doSearchClear()
}

const handleEnterSearch=function(e){
    const val = e.detail.value;
    if(isEnterSearch){
        caller.doSearch(val)
    }
}

function init(that,enterSearch) {
    caller=that;
    for (let func in this) {
        that[[func]] = this[func]
    }
    isEnterSearch=enterSearch
    // that["authorPhotoUrl"]=util.getCurrentUser()["usericon"]
};

export default {
    init,
    searchActiveChangeinput,
    searchActiveChangeclear,
    handleEnterSearch
}
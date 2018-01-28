const KEY_AUTHORS = "authors"

const KEY_STATS_INFO = "stats_info"

export const addAuthor = (username,real_name,usericon) => {
    let authors = wx.getStorageSync(KEY_AUTHORS)
    if(authors===""){
        authors=[]
    }
    authors.push({username,real_name,usericon})
    wx.setStorageSync(KEY_AUTHORS, authors)
}

export const getAuthors = () => {
    let authors=wx.getStorageSync(KEY_AUTHORS)
    if(authors===""){
        authors=[]
    }
    return authors;
}

export const deleteAuthor = (userId) => {
    let authors = wx.getStorageSync(KEY_AUTHORS)
    const userIndex=authors.findIndex(author=>author.userId===userId)
    authors.splice(userIndex,1)
    wx.setStorageSync(KEY_AUTHORS, authors)
}

export const loadStatsInfo=function() {
    return wx.getStorageSync(KEY_STATS_INFO)
}

export const clearStatsInfo=function() {
    return wx.removeStorageSync(KEY_STATS_INFO)
}

export const saveStatsInfo=function(user_deviations, watchers, user_favourites) {
    wx.setStorageSync(KEY_STATS_INFO, {
      user_deviations,
      watchers,
      user_favourites
    })
}
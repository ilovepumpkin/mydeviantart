const KEY_AUTHORS = "authors"

const KEY_STATS_INFO = "stats_info"

export const addAuthor = (username,real_name,usericon) => {
    let authors = wx.getStorageSync(KEY_AUTHORS)
    if(authors===""){
        authors=[]
    }
    const author={username,real_name,usericon}
    authors.push(author)
    wx.setStorageSync(KEY_AUTHORS, authors)
    return author;
}

export const getAuthors = () => {
    let authors=wx.getStorageSync(KEY_AUTHORS)
    if(authors===""){
        authors=[]
    }
    return authors;
}

export const findAuthor=(username)=>{
    return getAuthors().find(author=>author.username===username)
}

export const deleteAuthor = (username) => {
    let authors = wx.getStorageSync(KEY_AUTHORS)
    const userIndex=authors.findIndex(author=>author.username===username)
    authors.splice(userIndex,1)
    wx.setStorageSync(KEY_AUTHORS, authors)
}

export const loadStatsInfo=function() {
    return wx.getStorageSync(KEY_STATS_INFO)
}

export const setAuthors=function(authors) {
    return wx.setStorageSync(KEY_AUTHORS, authors)
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
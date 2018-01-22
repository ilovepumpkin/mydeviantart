const KEY_AUTHORS = "authors"

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
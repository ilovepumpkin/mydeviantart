const KEY_AUTHORS="authors"

export const addAuthor=(userId,username)=>{
    let authors=wx.getStorageSync(KEY_AUTHORS)
    if(!authors){
        wx.setStorageSync(KEY_AUTHORS,[])
    }
}

export const getAuthors=()=>{
    return wx.getStorageSync(KEY_AUTHORS)
}

export const deleteAuthor=(userId)=>{
    
}
const KEY_GROUPS = "groups"

export const addGroup = (name) => {
    let groups = wx.getStorageSync(KEY_GROUPS)
    if(groups===""){
        groups=[]
    }
    const group={name}
    groups.push(group)
    wx.setStorageSync(KEY_GROUPS, groups)
    return group;
}

export const getGroups = () => {
    let groups=wx.getStorageSync(KEY_GROUPS)
    if(groups===""){
        groups=[]
    }
    return groups;
}

export const setGroups=(groups)=>{
    wx.setStorageSync(KEY_GROUPS, groups)
}

export const findGroup=(name)=>{
    return getGroups().find(group=>group.name===name)
}

export const deleteGroup = (name) => {
    let groups = wx.getStorageSync(KEY_GROUPS)
    const userIndex=groups.findIndex(group=>group.name===name)
    groups.splice(userIndex,1)
    wx.setStorageSync(KEY_GROUPS, groups)
}
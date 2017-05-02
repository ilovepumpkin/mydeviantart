const KEY_BOOKMARKS = "deviation_bookmarks"
const PAGE_SIZE = 10

function addBookmark(deviationid, title, imgUrl, imgWidth, imgHeight) {
	let bookmarks = getBookmarks().data;
	const found = bookmarks.find((bookmark) => {
		return bookmark.deviationid === deviationid
	})

	if (!found) {
		const item = {
			deviationid,
			ts: Date.now(),
			title,
			imgUrl,
			imgWidth,
			imgHeight
		}
		bookmarks.push(item)
		wx.setStorageSync(KEY_BOOKMARKS, JSON.stringify(bookmarks))
	}
	return true;
}

function getBookmarks(offset) {
	let data = wx.getStorageSync(KEY_BOOKMARKS)
	if (data) {
		let jsonData = JSON.parse(data)

		if (!!offset) {
			let next_offset = offset + PAGE_SIZE;
			next_offset = next_offset > jsonData.length ? null : next_offset;
			return {
				data: jsonData.splice(offset, PAGE_SIZE),
				next_offset
			}
		} else {
			return {
				data: jsonData,
				next_offset: null
			}
		}

	} else {
		return {
			data: [],
			next_offset: null
		}
	}
}

function deleteBookmark(deviationid) {
	const bookmarks = wx.getStorageSync(KEY_BOOKMARKS)
	const idx = bookmarks.findIndex((b) => b.deviationid === deviationid)
	bookmarks.splice(idx, 1)
	return true;
}

export {
	addBookmark,
	getBookmarks,
	deleteBookmark
}
function switchPageTo(e) {
	const pageUrl = e.currentTarget.dataset.url;

	wx.navigateTo({
		url: pageUrl
	});
}

function isCurrentPage(e) {
	const url = e.currentTarget.dataset.url
	const pages = wx.getCurrentPages()

}

module.exports = {
	switchPageTo,
	isCurrentPage
}
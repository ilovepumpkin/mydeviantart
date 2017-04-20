function switchPageTo(e) {
	const pageUrl = e.currentTarget.dataset.url;

	wx.navigateTo({
		url: pageUrl
	});
}

function init(that) {
	for (let funcName in this) {
		that[[funcName]] = this[funcName]
	}
}

module.exports = {
	switchPageTo,
	init
}
function Shop() {
	this.items = []
}

module.exports = Shop

Shop.prototype.setup = function() {
	this.items.push( new item("Score Multiplier", 10) )
	this.items.push( new item("Some other upgrade", 50) )
}

Shop.prototype.getAvailable = function(playerTracker) {
	var results = {}
	var items = playerTracker.shopHandler.items
	for (var i = items.length - 1; i >= 0; i--) {
		var thisitem = items[i]
		if (playerTracker.taps > thisitem.price) {
			results[ thisitem.name ] = thisitem
		}
	}
	return results
}

function item(name, price) {
	this.name = name
	this.price= price
	this.owned= 0
}

function playerTracker() {
	this.taps 	= 0
	this.id   	= 0
	this.name 	= ""
	this.socket 	= null
	this.gameServer = null
}

module.exports = playerTracker;

playerTracker.prototype.NameGen = function () {
	var adj = ['Fluffy', 'Musty', 'Chusty', 'Skusty',
        'Crusty', 'Fusty', 'Spusty', 'Justy',
        'Husty', 'Busty', 'Stusty', 'Spusty',
        'Flusty', 'Vusty', 'Rusty', 'Shusty',
        'Grusty', 'Zusty', 'Nusty', 'Xusty',
        'Khusty', 'Wusty', 'Custy', 'Gusty'
    ]
    var noun = ['Turkey', 'Rabbit', 'Antelope', 'Cucumber',
        'Unicorn', 'Catfish', 'Badger', 'Milkshake',
        'Diaper', 'Spoon', 'Durag', 'Cheesesteak',
        'Rooster', 'Chicken', 'Dragon', 'Robot',
        'Skateboard', 'Meatloaf', 'Turtle', 'Possum',
        'Kettle', 'Lips', 'Earlobe', 'Magician',
        'Butterfly', 'Dog', 'Socks', 'Superhero',
        'T-Rex', 'Elephant', 'Walrus', 'Villager',
        'Carpenter', 'Noodle', 'Doorknob', 'Champion'
    ]
    this.name = adj[Math.floor(Math.random() * adj.length)] + ' ' + noun[Math.floor(Math.random() * noun.length)]
}

playerTracker.prototype.getContextOfString = function() {
	if (Connected > 1) {
        var txt = ' people are online'
    } else {
        var txt = ' person is online'
    }
}

playerTracker.prototype.handleTap = function(msg, socket) {
	this.taps++
    var userMsg = {
        taps: socket.playerTracker.taps,
        txt: 'Your taps - ',
        name: socket.playerTracker.name
    }
    socket.emit('name', userMsg)
    var getAvailable = socket.playerTracker.shopHandler.getAvailable(socket.playerTracker)
    socket.emit('shop-item', getAvailable)
}
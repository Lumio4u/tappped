function GameServer() {
	this.totalTap 		= 0
	this.users 	  		= []
	this.leaderboard 	= []
	this.ioServer 		= require('./ioServer')
	this.playerTracker  = require('./playerTracker')
	this.rewardsService = require('./rewards')
	this.rewards 		= new this.rewardsService()
	this.shopHandler	= require('./ShopHandler')
}

module.exports = GameServer;

GameServer.prototype.start = function () {
	var that 	  = this
	this.ioServer = new this.ioServer()
	this.ioServer.start()
	this.ioServer.io.on('connection', function(socket) {
		that.connection(socket, that)
	})
}

GameServer.prototype.updateLeaderBoard = function(that) {
	var clients = that.users.valueOf()
	clients.sort(function(a,b) {
		return b.playerTracker.taps - a.playerTracker.taps
	})
	var leaderboard = {}
	for (var i = 0; i < clients.length; i++) {
		if (i>10) break
		leaderboard[i] = {
			"name" : clients[i].playerTracker.name
		}
	}
	that.ioServer.io.sockets.emit('lb', leaderboard)
}

GameServer.prototype.connection = function(socket, that) {
	that.ioServer.connection()
	socket.on('disconnect', function() {
		that.ioServer.io.sockets.emit('TxtMsg', socket.playerTracker.name + ' left')
		that.disconnect(socket, that)
	})

	socket.playerTracker 			= new that.playerTracker()
	socket.playerTracker.shopHandler= new that.shopHandler()
	socket.playerTracker.id 		= that.users.length
	socket.playerTracker.socket 	= socket
	socket.playerTracker.gameServer = that
	socket.playerTracker.NameGen()
	socket.playerTracker.shopHandler.setup()

	that.users[that.users.length] 	= socket

	that.ioServer.io.sockets.emit('userCount', that.ioServer.Connected)
	socket.broadcast.emit('TxtMsg', socket.playerTracker.name + ' joined!')

	socket.on('tap', function(msg) {
		socket.playerTracker.handleTap(msg, socket)
		that.handleTap(msg, socket, that)
	})
}

GameServer.prototype.disconnect = function(socket, that) {
	that.users.splice(socket.playerTracker.id, 1)
	that.ioServer.disconnect()
	that.ioServer.io.sockets.emit('userCount', that.ioServer.Connected)
}

GameServer.prototype.handleTap = function(msg, socket, that) {
	that.updateLeaderBoard(that)
	that.totalTap++
	var message = {
        txt: 'Tapped!  - ' + that.totalTap + ' total taps',
        taps: that.totalTap,
        col: msg.color,
        tag: that.rewards.getReward(that.totalTap)
    }
    that.ioServer.io.sockets.emit('mytap', message)
    that.ioServer.io.sockets.emit('tap', msg)
}
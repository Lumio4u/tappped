function ioServer() {
	this.Connected= 0
	this.app 	  = require('express')()
	this.http 	  = require('http').Server(this.app)
	this.io 	  = require('socket.io')(this.http)
	this.file 	  = require('./readFile')
}

module.exports = ioServer;

ioServer.prototype.start = function() {
	var that = this;

	this.app.get('/', function(req, res) {
		var outPut = that.file.replace(
			'./client/index.html',
			that.file.res('<script></script>', "<script>\n" + that.file.replace('./client/index.js') + "\n</script>"),
			that.file.res('</style>', that.file.replace('./client/index.css') + "\n</style>")
			)

	    res.send(outPut)
	})

	this.http.listen(process.env.PORT || 3000, function(port) {
	    console.log('Listening on port, ' + 3000)
	})
}

ioServer.prototype.connection = function() {
	this.Connected++
}

ioServer.prototype.disconnect = function() {
	this.Connected--
}
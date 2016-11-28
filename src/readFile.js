var fs 		   = require('fs')

function replaceFile(file) {
	var file    = fs.readFileSync(file, 'utf8')
	var args    = Array.prototype.slice.call(arguments, 0);
	args.splice(0, 1);
	for (var i  = args.length - 1; i >= 0; i--) {
		file    = file.replace(args[i].one, args[i].two)
	}
	return file;
}

function replaceStr(input, output) {
	return {'one':input,'two':output}
}

var readfile 	= {};

readfile.replace= replaceFile;
readfile.res	= replaceStr;

module.exports	= readfile;
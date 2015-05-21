/**
 * Module dependencies.
 */
var fs = require('fs');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true
}).listen(8888, 'localhost', function (err, result) {
	if (err) {
		console.log(err);
	}
	console.log('Webpack listening at localhost:8888');
});

var omx = {
	start: function(videoId, cb) {
		console.log('omx start ' + videoId);
		setTimeout(function() {
			console.log('omx finish');
			cb();
		}, 30000);
	},
	pause: function() {
		console.log('omx pause');
	},
	quit: function() {
		console.log('omx stop');
	}
}

// file is included here:
eval(fs.readFileSync('server.js')+'');
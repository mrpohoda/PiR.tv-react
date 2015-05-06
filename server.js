/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var spawn = require('child_process').spawn;
var omx = require('./scripts/omxcontrol.js');
var Firebase = require("firebase");
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(omx());

var firebaseRef = new Firebase("https://pirtv.firebaseio.com/playing");

// development only
if ('production' != app.get('env')) {
	var omx = {
		start: function(videoId, cb) {
			console.log('omx start ' + videoId);
			setTimeout(function() {
				console.log('omx finish');
				cb();
			}, 3000);
		},
		pause: function() {
			console.log('omx pause');
		},
		quit: function() {
			console.log('omx stop');
		}
	}
}

app.listen(8080, function() {
	console.log('Lenik TV is running on port ' + 8080);
});

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true
}).listen(8888, 'localhost', function (err, result) {
	if (err) {
		console.log(err);
	}
	console.log('Listening at localhost:8080');
});


var playlist = [],
	nowPlaying = null,
	downloading = [],
	nowDownloading = false;

//Run and pipe shell script output
function run_shell(cmd, args, cb, end) {
	var spawn = require('child_process').spawn,
		child = spawn(cmd, args),
		me = this;
	child.stdout.on('data', function(buffer) {
		cb(me, buffer);
	});
	child.stdout.on('end', end);
}

// Retrieve new movies as they are added to Firebase and add them
// to playlist array
firebaseRef.on("child_added", function(snapshot) {
	var movie = {
		key: snapshot.key(),
		movie: snapshot.val()
	};
	playlist.push(movie);
	console.log(movie.key + ' added to the playlist');

	downloadMovieLocally(movie, function () {
		if (nowPlaying === null) {
			console.log(movie.key + ' is going to play, nothing is currently playing.');
			nowPlaying = movie;
			playVideo(movie);
		}
	});
});

firebaseRef.on("child_changed", function(childSnapshot, prevChildName) {
	omx.pause();
});

// If movie is stopped from the client, child_removed occurs
// we need to stop the current video and play next one if there is any
firebaseRef.on("child_removed", function(snapshot) {
	stopVideo();
	playNext();
});

function playVideo(video) {
	console.log(video.key + ' just about to start playing...');
	omx.start(getFileName(video), function() {
		console.log(video.key + ' finished playing...');

		// video is finished, remove it from the "playing" list
		playlist.shift();

		nowPlaying = null;

		// remove it also from the firebase playlist
		var itemToRemove = new Firebase('https://pirtv.firebaseio.com/playing/' + video.key);
		itemToRemove.remove();

		playNext();
	});
}

/**
 * play next video in playlist
 * @return {[type]} [description]
 */
function playNext() {
	if (playlist.length && !nowPlaying) {
		nowPlaying = playlist[0];
		console.log('playNext is going to play ' + nowPlaying.key + '...');
		setTimeout(function () {
			playVideo(nowPlaying);
		}, 2000);
	}
}

function stopVideo(video) {
	omx.quit();
}

function getFileName(video) {
	return 'video/' + video.movie.id + '.mp4'; // 'video/%(id)s.%(ext)s'
}

function downloadMovieLocally(video, cb) {
	fs.exists(getFileName(video), function(exists) {
		if (exists) {
			console.log(video.key + ' downloaded before...');
			cb();
		} else {
			downloading.push({
				video: video,
				cb: cb
			});
			if (!nowDownloading) {
				download_file();
			}
		}
	});
}

/**
 * get first item from array and download it
 * @return {[type]} [description]
 */
function download_file() {
	// indicate that download is in progress and that we don't have more simultaneous downloads
	nowDownloading = true;
	var item = downloading.shift();
	var url = "http://www.youtube.com/watch?v=" + item.video.movie.id,
		fileName = getFileName(item.video);
	var runShell = new run_shell('youtube-dl', ['-o', fileName, '-f', '/18/22', url],
		function(me, buffer) {
			// me.stdout += buffer.toString();
			// console.log(me.stdout);
		}, function(){
			item.cb();
			nowDownloading = false;
			// if there are some items to be download, download the next one
			if (downloading.length) {
				download_file();
			}
		});
}

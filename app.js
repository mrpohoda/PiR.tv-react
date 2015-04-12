/**
 * Module dependencies.
 */
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	path = require('path'),
	fs = require('fs'),
	// io = require('socket.io').listen(server),
	spawn = require('child_process').spawn,
	omx = require('./scripts/omxcontrol.js'),
	Firebase = require("firebase");



// all environments
app.set('port', process.env.TEST_PORT || 8888);
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '/')));
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
			console.log('omx pause' + videoId);
		},
		quit: function() {
			console.log('omx stop' + videoId);
		}
	}
}

//Routes
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});


//Socket.io Config
// io.set('log level', 1);

server.listen(app.get('port'), function() {
	console.log('Lenik TV is running on port ' + app.get('port'));
});

var playlist = [],
	nowPlaying = null;

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
			download_file(video, function() {
				console.log(video.key + ' succesfully downloaded...');
				cb();
			});
		}
	});
}

function download_file(video, cb) {
	var url = "http://www.youtube.com/watch?v=" + video.movie.id,
		fileName = getFileName(video);
	var runShell = new run_shell('youtube-dl', ['-o', fileName, '-f', '/18/22', url],
		function(me, buffer) {
			// me.stdout += buffer.toString();
			// console.log(me.stdout);
		}, cb);
}

// //Socket.io Server
// io.sockets.on('connection', function(socket) {

//   if (nowPlaying) {
//     socket.emit("video", {
//       action: 'play',
//       video: nowPlaying
//     });
//   }
//   broadcastPlaylist();

//   function getFileName(video) {
//     return 'video/' + video.id + '.mp4'; // 'video/%(id)s.%(ext)s'
//   }

//   function playVideo(video) {
//     stopVideo();

//     setTimeout(function () {
//       nowPlaying = video;

//       // socket.emit - send message only to current user
//       // socket.broadcast.emit - send message to all except current user
//       // io.sockets.emit - send message to all
//       io.sockets.emit("video", {
//         action: 'play',
//         video: video
//       });
//       omx.start(getFileName(video), function () {
//         broadcastStop();
//         if (playlist.length) {
//           playVideo(playlist.shift());
//           broadcastPlaylist();
//         }
//       });
//     }, 200);
//   }

//   function pauseVideo(video) {
//     nowPlaying.isPaused = !nowPlaying.isPaused;
//     io.sockets.emit("video", {
//       action: 'pause',
//       video: nowPlaying
//     });
//     omx.pause();
//   }

//   function stopVideo(video) {
//     broadcastStop();
//     omx.quit();
//   }

//   function broadcastStop() {
//     nowPlaying = null;
//     io.sockets.emit("video", {
//       action: 'stop'
//     });
//   }

//   function broadcastPlaylist() {
//     io.sockets.emit("playlist", {
//       data: playlist
//     });
//   }

//   function download_file(video, cb) {
//     var url = "http://www.youtube.com/watch?v=" + video.id,
//       fileName = getFileName(video);
//     var runShell = new run_shell('youtube-dl', ['-o', fileName, '-f', '/18/22', url],
//       function(me, buffer) {
//         me.stdout += buffer.toString();
//         socket.emit("loading", {
//           output: me.stdout
//         });
//         console.log(me.stdout);
//       }, cb);
//   }

//   socket.on("video", function(data) {
//     var action = data.action,
//       video = data.video;

//     if (action === "play") {
//       fs.exists(getFileName(video), function(exists) {
//         if (exists) {
//           playVideo(video);
//         } else {
//           download_file(video, function () {
//               //child = spawn('omxplayer',[id+'.mp4']);
//               playVideo(video);
//           });
//         }
//       });
//     }
//     else if (action === "pause") {
//       pauseVideo(video);
//     }
//     else if (action === "stop") {
//       stopVideo(video);
//     }
//     else if (action === 'favourite' && video) {
//       var favouritesRef = firebaseRef.child("favourites");
//       // this $$hashKey is added by Angular and will be resolved when switching from socket.io
//       // to some Angular version of lib - it's because of JSON.stringify
//       delete video.$$hashKey;
//       favouritesRef.child(video.id).set(video);
//     }
//     else if (action === 'queue' && video) {
//       fs.exists(getFileName(video), function(exists) {
//         if (exists) {
//           // if this is the first item added to the queue, play it
//           // this is because "play" is not directly called from the frontend but instead
//           // everything is being added to the queue
//           if (!nowPlaying) {
//             playVideo(video);
//           }
//           else {
//             playlist.push(video);
//             broadcastPlaylist();
//           }
//         } else {
//           download_file(video, function () {
//               //child = spawn('omxplayer',[id+'.mp4']);
//                if (!nowPlaying) {
//                   playVideo(video);
//                 }
//                 else {
//                   playlist.push(video);
//                   broadcastPlaylist();
//                 }
//           });
//         }
//       });
//     }
//   });
// });
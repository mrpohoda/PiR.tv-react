var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxPlayerConstants = require('../constants/FluxPlayerConstants');
var _ = require('lodash');
var Firebase = require("firebase");

var FIREBASE_PLAYING_URL = 'https://pirtv.firebaseio.com/playing_test';
var firebasePlayingRef = new Firebase(FIREBASE_PLAYING_URL);

// Define initial data points
var _playing = [];

// Extend PlayingStore with EventEmitter to add eventing capabilities
let PlayingStore = _.extend({}, EventEmitter.prototype, {

  getPlaying: function() {
    return _playing;
  },

  // Emit Change event
  emitChange: function() {
    this.emit('change');
  },

  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  // Remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }

});

var emitChange = _.debounce(PlayingStore.emitChange.bind(PlayingStore), 300, {
  leading : false,
  trailing : true
});

// Retrieve new movies as they are added to Firebase and add them
// to playlist array
firebasePlayingRef.on('child_added', function(snapshot) {
  var movie = getMovieFromSnapshot(snapshot);
  _playing.push(movie);
  emitChange();
});

firebasePlayingRef.on("child_changed", function(childSnapshot, prevChildName) {
  var movie = getMovieFromSnapshot(childSnapshot);
  _playing[0] = movie;
  emitChange();
});

// Remove movie from playlist when it is removed from the Firebase
firebasePlayingRef.on('child_removed', function(snapshot) {
  var movie = getMovieFromSnapshot(snapshot);
  var index = getMovieIndex(movie);
  if (index > -1) {
    _playing.splice(index, 1);
    emitChange();
  }
});

function getMovieFromSnapshot(snapshot) {
  return {
    key: snapshot.key(),
    movie: snapshot.val()
  };
}

function getMovieIndex(movie) {
  var index = -1;
  for (var i = 0; i < _playing.length; i++) {
    if (_playing[i].key === movie.key) {
      index = i;
      break;
    }
  }
  return index;
}

function getFirebaseMovie(id) {
  var url = FIREBASE_PLAYING_URL + '/' + id;
  return new Firebase(url);
}

function playMovie(movie) {
  if (getMovieIndex(movie) < 0) {
    firebasePlayingRef.push(movie);
  }
}

function pauseMovie(movie) {
  var currentMovie = _playing[0];
  var paused = currentMovie.paused || false;
  var item = getFirebaseMovie(currentMovie.key);
  if (item) {
    item.update({paused: !paused});
  }
}

function stopMovie(movie) {
  var currentMovie = _playing[0];
  var item = getFirebaseMovie(currentMovie.key);
  if (item) {
     item.remove();
  }
}

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {

    // Respond to RECEIVE_DATA action
    case FluxPlayerConstants.PLAY_MOVIE:
      playMovie(action.data);
      break;

    case FluxPlayerConstants.PAUSE_MOVIE:
      pauseMovie(action.data);
      break;

    case FluxPlayerConstants.STOP_MOVIE:
      stopMovie(action.data);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  // Emit change is called manually whenever some data comes from Firebase
  // PlayingStore.emitChange();

  return true;

});

export default PlayingStore;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxPlayerConstants = require('../constants/FluxPlayerConstants');
var _ = require('lodash');
var Firebase = require("firebase");

var firebaseFavouritesRef = new Firebase("https://pirtv.firebaseio.com/favourites");

// Define initial data points
var _favouriteMovies = [],
  _movies = [],
  _categories = [];


function updateCategories(movie) {
  if (!movie.category) {
    movie.category = 'Ostatní';
  }
  if (_categories.indexOf(movie.category) < 0) {
    _categories.push(movie.category);
  }
}

// Extend MovieStore with EventEmitter to add eventing capabilities
let MovieStore = _.extend({}, EventEmitter.prototype, {

  getMovies: function() {
    return _movies;
  },

  getCategories: function() {
    return _categories;
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

var emitChange = _.debounce(MovieStore.emitChange.bind(MovieStore), 300, {
  leading : false,
  trailing : true
});

// Retrieve new movies as they are added to Firebase and add them
// to playlist array
firebaseFavouritesRef.on('child_added', function(snapshot) {
  var movie = {
    key: snapshot.key(),
    movie: snapshot.val()
  };
  _favouriteMovies.push(movie);

  updateCategories(movie.movie);

  emitChange();
});

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {

    case FluxPlayerConstants.SEARCH_MOVIES:
      _movies = action.data.map(function(movie){
        return {
          key: movie.id,
          movie: movie
        }
      });
      break;

    case FluxPlayerConstants.GET_MOVIES_BY_CATEGORY:
      _movies = _favouriteMovies.filter(function(movie){
        return movie.movie.category === action.data;
      });
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  MovieStore.emitChange();

  return true;

});

export default MovieStore;
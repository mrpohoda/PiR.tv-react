var AppDispatcher = require('../dispatcher/AppDispatcher');
var FluxPlayerConstants = require('../constants/FluxPlayerConstants');
var YoutubeApi = require('../utils/YoutubeApi');

// Define actions object
let FluxPlayerActions = {

  playMovie: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxPlayerConstants.PLAY_MOVIE,
      data: data
    })
  },

  pauseMovie: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxPlayerConstants.PAUSE_MOVIE,
      data: data
    })
  },

  stopMovie: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxPlayerConstants.STOP_MOVIE,
      data: data
    })
  },

  addToFavourites: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxPlayerConstants.ADD_TO_FAVOURITES,
      data: data
    })
  },

  removeFromFavourites: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxPlayerConstants.REMOVE_FROM_FAVOURITES,
      data: data
    })
  },

  searchMovies: function(data) {
    YoutubeApi.findMovies({query: data}).then(function(movies){
      AppDispatcher.handleAction({
        actionType: FluxPlayerConstants.SEARCH_MOVIES,
        data: movies
      });
    }, function(reason){
      alert('Chyba z nedbalosti a nepozornosti :-(');
    });
  },

  showNextPageMovies: function() {
    YoutubeApi.findMovies({query: null, nextPage: true}).then(function(movies){
      AppDispatcher.handleAction({
        actionType: FluxPlayerConstants.SHOW_NEXT_PAGE_MOVIES,
        data: movies
      });
    }, function(reason){
      alert('Chyba z nedbalosti a nepozornosti :-(');
    });
  },

  getMoviesByCategory: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxPlayerConstants.GET_MOVIES_BY_CATEGORY,
      data: data
    })
  }
};

export default FluxPlayerActions;
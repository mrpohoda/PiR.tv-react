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

  getMoviesByCategory: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxPlayerConstants.GET_MOVIES_BY_CATEGORY,
      data: data
    })
  }
};

export default FluxPlayerActions;
var keyMirror = require('react/lib/keyMirror');

// Define action constants
export default keyMirror({
  PLAY_MOVIE: null,   // Play movie
  PAUSE_MOVIE: null,
  STOP_MOVIE: null,
  ADD_TO_FAVOURITES: null,
  REMOVE_FROM_FAVOURITES: null,
  SEARCH_MOVIES: null,  // search movies on yutube
  GET_MOVIES_BY_CATEGORY: null, // return stored movies with given category
  SHOW_NEXT_PAGE_MOVIES: null
});
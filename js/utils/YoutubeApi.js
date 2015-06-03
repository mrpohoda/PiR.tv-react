var Q = require('q');

var YOUTUBE_API_KEY = 'AIzaSyCMgqDPWiH8SWHABbgwmAxoG_IHRMMj9-0';
var YOUTUBE_RESULT_LIMIT = 20;
var getBaseUrl = function () {
  return 'https://www.googleapis.com/youtube/v3/search?' +
    'key=' + YOUTUBE_API_KEY +
    '&part=snippet' +
    '&maxResults=' + YOUTUBE_RESULT_LIMIT +
    '&type=video';
};

// this is used for remembering which query was used
// we can then handle infinite scrolling using pageToken
let lastUsedQuery, nextPageToken;

function transformYoutubeData (movies) {
    var items = [],
      entry;
    if (!movies.items.length) {
      return null;
    }
    for (var i = 0; i < movies.items.length; i++) {
      entry = movies.items[i];

      items.push({
        id: entry.id.videoId,
        title: entry.snippet.title,
        preview: entry.snippet.thumbnails.default.url
        // duration: entry.media$group.yt$duration.seconds
      });
    }

    // remember nextPageToken for infinite scrolling
    nextPageToken = movies.nextPageToken;

    return items;
}

let YoutubeApi = {

  findMovies: function(params) {
    var url = getBaseUrl();
    if (params.nextPage) {
      params.query = lastUsedQuery;
      url += '&pageToken=' + nextPageToken;
    }
    else {
      lastUsedQuery = params.query;
    }

    url += '&q=' + escape(params.query);

    var deferred = Q.defer();
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = transformYoutubeData(JSON.parse(this.response));
        deferred.resolve(data);
      } else {
        // We reached our target server, but it returned an error
        deferred.reject();
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      deferred.reject();
    };

    request.send();

    return deferred.promise;
  }
};

export default YoutubeApi;
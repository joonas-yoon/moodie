var express = require('express');
var request = require('request');
var urlencode = require('urlencode');
var router = express.Router();

// middleware that is specific to this router
router.use(function (req, res, next) {
  next();
});

router.get('/list/:page?', function(req, res) {
  var page = req.param('page') || 1;
  get_movies(page, function(list){
    res.json(to_general_form(list));
  });
});

router.get('/search/:text', function(req, res) {
  var page = req.param('page') || 1;
  var text = req.param('text');
  search_movies(text, page, function(list){
    res.json(to_general_form(list.items));
  });
});

function to_general_form(movie){
  var former = function(info){
    if( 'data' in info ){ // from yts' API
      return info.data;
    }
    else { // from naver
      var ret = {};
      ret.url = info.link;
      ret.title_long = info.title + ' ('+ info.pubDate +')';
      ret.medium_cover_image = info.image;
      ret.rating = info.userRating;
      return ret;
    }
  };
  
  if( Array.isArray(movie) ){
    var lst = [];
    movie.forEach(function(e){
      lst.push(former(e));
    });
    return {
      movies: lst
    };
  } else {
    return former(movie || {});
  }
}

function get_movies(page, callback){
  var url = 'https://yts.am/api/v2/list_movies.json?';
  var queries = 'limit=12&page=' + page;
  
  request(url + queries, function(error, response, html){  
    if (error) {
      // throw error;
      return callback(error);
    }
    return callback(JSON.parse(response.body));
  });
}

function search_movies(text, page, callback){
  text = urlencode(text);
  var display = 12;
  var start = display * (page - 1) + 1;
  var url = 'https://openapi.naver.com/v1/search/movie.json?';
  var queries = 'display=' + display + '&start=' + start + '&query=' + text;
  var headers = { 
    'X-Naver-Client-Id': 'QK1yApWnIBHQeBNvdijj',
    'X-Naver-Client-Secret': 'QUunXjnpMZ'
  };
  
  console.log(url + queries);
  request({
      headers: headers,
      uri: url + queries,
      method: 'GET'
    }, function (err, res, body) {
    	callback(JSON.parse(body));
    }
  );
}

exports = module.exports = router;
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

// middleware that is specific to this router
router.use(function (req, res, next) {
  next();
});

router.get('/list/:page?', function(req, res) {
  var page = req.param('page') || 1;
  get_movie_list(page, function(list){
    res.json(list);
  });
});

function get_movie_list(page, callback){
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

exports = module.exports = router;
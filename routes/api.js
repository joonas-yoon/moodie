var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

// middleware that is specific to this router
router.use(function (req, res, next) {
  next();
});

router.get('/', function(req, res) {
  res.render('pages/index', { title: 'Express' });
});

exports = module.exports = router;
var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');
var exphbs  = require('express-handlebars');
var hbs = exphbs.create({
  defaultLayout: 'main'
});
var session = require('express-session')(
  { secret: 'keyboard-cat', resave: false, saveUninitialized: false }
);

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();
var config = require('./config');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var flash = require('connect-flash');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session);
app.use(flash());
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(require('./routes/error'));

// Listen Server
var usingPort = process.env.PORT || config.port;
app.listen(usingPort, function(){
  console.log("Server listening on port", usingPort);
});
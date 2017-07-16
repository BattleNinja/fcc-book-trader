var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var router = require('./routes/index');
var user = require('./routes/user');
var api = require('./routes/api');
var expressValidator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
// ------------------Connect to mongodb----------------------//
mongoose.connect('mongodb://localhost/book');
mongoose.Promise = global.Promise;
var db = mongoose.connection;


// ------------------view engine setting----------------------//
// var hbs = hbs.create({ /* config */ });


app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout'
}));
app.use(express.static(path.join(__dirname, 'public')));


// ------------------Parser setting----------------------//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

// ------------------Validator setting----------------------//
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// ------------------session setting----------------------//

app.use(session({
  secret: 'uahsdskuvsbdasaqqwforkuksdbvysurgeiyagouy',
  resave: false,
  saveUninitialized: true,
  maxAge: 60000
}));

// ------------------passport setting----------------------//
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// ------------------router----------------------//
app.use('/', router);
app.use('/user',user);
app.use('/api',api);
// ------------------listen on 3000----------------------//
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

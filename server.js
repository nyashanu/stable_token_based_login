var express = require('express');
var app = express();
// var port = process.env.PORT || 8080;
var path = require('path');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);

app.set('port', (process.env.PORT || 5000));
var configDB = require('./config/database.js');
mongoose.connect('mongodb://test:test@ds015878.mlab.com:15878/heroku_q0q4cd13');
require('./config/passport')(passport);
var db = mongoose.connection;
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true,
				 store: new MongoStore({ mongooseConnection: mongoose.connection,
				 							ttl: 2 * 24 * 60 * 60 })}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs');

var api = express.Router();
require('./app/routes/api.js')(api, passport);
app.use('/api', api);

var auth = express.Router();
require('./app/routes/auth.js')(auth, passport);
app.use('/auth', auth);

var secure = express.Router();
require('./app/routes/secure.js')(secure, passport);
app.use('/', secure);


// app.listen(port);
// console.log('Server running on port: ' + port);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



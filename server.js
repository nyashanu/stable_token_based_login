var express = require('express')
var app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));


var configDB = require('./config/database.js');


mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds127928.mlab.com:27928/heroku_0v2hfpdx');
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// 
// 
require('./app/routes.js')(app, passport);
// 
	app.get('/x', function(req, res){
		res.render('x.ejs');
	});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function(req, res) {
// 	res.render('/index');
// })

app.listen(port, function() {
	console.log('app running')
})

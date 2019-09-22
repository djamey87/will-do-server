const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const COOKIE_NAME = 'todo',
	COOKIE_SECRET = 'todo for you';

require('./models/Task');
require('./models/User');

require('./config/passport');

// setup db and document defaults
require('./lib/dbSetup');

// redis setup
const redisPort = '6379';
const redisHost = '127.0.0.1';
const redisClient = redis.createClient();

redisClient.on('connect', function() {
	console.log('Connected to Redis at port: ' + redisPort + ' and host: ' + redisHost);
});
redisClient.on('error', function(error) {
	console.log('Failed to connect to Redis');
	console.log('Redis ERROR: ' + error);
});

// TODO: make dynamic, so no need for explicit assigment
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(helmet());

app.use(
	session({
		store: new redisStore({
			client: redisClient,
			ttl: 32400,
			secret: COOKIE_SECRET,
		}),
		name: COOKIE_NAME,
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// app.use(cors());

app.use(function(req, res, next) {
	// console.log('header check', req.headers.origin);

	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
	);
	res.header('Access-Control-Allow-Credentials', 'true');

	next();
});

app.use(require('morgan')('dev'));
app.use(require('method-override')());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// TODO: make route declaration dynamic
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

module.exports = app;

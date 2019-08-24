var mongoose = require('mongoose');
var User = require('../models/User');
var Task = require('../models/Task');

var db = function () {
    var connection = mongoose.connect('mongodb://localhost:27017/todo');
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        console.log('db connection open');

		// create initial documents
		var newUser = new User({displayName: 'test'});

		newUser.save(function(err, saved){
			if (err){
				return console.error('[databaseLib] error saving user',err);
			}
			console.log('User', newUser.displayName, 'created', saved);
		})
    });
};

module.exports = db();

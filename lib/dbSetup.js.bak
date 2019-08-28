const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

// default user list
const defaultUsers = [
	{
		name: 'dave',
		email: 'djamey87@gmail.com',
		password: 'daveisgreat',
	},
];

const dbSetup = function() {
	const connection = mongoose.connect('mongodb://localhost:27017/todo');
	const db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback() {
		console.log('db connection open');

		defaultUsers.forEach(async function(user) {
			const foundDoc = await User.findOne({ email: user.email });

			if (foundDoc) {
				return console.warn(`[dbSetup] user ${user.email} already exists, skipping`);
			}

			// create the doc
			let newUser = new User(user);

			await newUser.save();
		});
	});
};

module.exports = dbSetup();

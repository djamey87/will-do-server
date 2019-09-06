const router = require('express').Router();
const passport = require('passport');

const authLib = require('../lib/auth');
const User = require('../models/User');
const Task = require('../models/Task');

const passportStrategy = passport.authenticate('local');

// create task
router.post('/', async function(req, res, next) {
	const { title, content } = req.body;

	// TODO: verify incoming meets model validation before proceeding
	if (!title) {
		return res.status(422).json({ msg: 'check fields' });
	}

	let task = new Task();

	// if no user exists, create away!
	task.title = title;
	task.content = content;

	try {
		await task.save();

		return res.json({ success: true, task });
	} catch (err) {
		console.log('error saving task', err);
		return res.status(422).json({ errors: err, msg: 'check fields' });
	}
});

/* GET task listings */
router.get('/', authLib.required(), async function(req, res, next) {
	const tasks = await Task.find()
		.lean()
		.exec();

	console.log('found tasks', tasks);
	return res.json({ tasks: tasks });
});

module.exports = router;

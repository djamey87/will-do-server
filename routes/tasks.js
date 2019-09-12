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

/* GET task listings, newest first */
router.get('/', authLib.required(), async function(req, res, next) {
	let query = {};

	console.log('tasks query', req.query);

	if (req.query.status) {
		query.status = String(req.query.status).toLowerCase();
	}

	const tasks = await Task.find(query)
		.lean()
		.sort({ createdAt: -1 })
		.exec();

	return res.json({ tasks: tasks });
});

/* DELETE task item -
   this is a soft delete, preventing the item from returning in the general listings
*/
router.delete('/:id', authLib.required(), async function(req, res, next) {
	console.log('gotta delete this', req.params.id);
	const task = await Task.findOne({ _id: req.params.id }).exec();

	// if none are found then error that shit
	if (!task) {
		return res.status(422).json({ msg: 'no task found mate' });
	}

	// else set the status to deleted
	task.status = 'deleted';

	await task.save();

	return res.status(200).json({ success: true });
});

module.exports = router;

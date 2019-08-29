const router = require('express').Router();
const passport = require('passport');

const authLib = require('../lib/auth');
const User = require('../models/User');

const passportStrategy = passport.authenticate('local');

// create user
router.post('/', async function(req, res, next) {
	let user = new User();
	const { email, name, password } = req.body;

	// check no user exists already
	const existingUser = await User.findOne({ email })
		.lean()
		.exec();

	if (existingUser) {
		return res.status(422).json({ success: false, msg: 'User already exists' });
	}

	// if no user exists, create away!
	user.email = email;
	user.name = name;
	user.password = password;

	try {
		await user.save();

		return res.json({ user });
	} catch (err) {
		console.log('error saving user', err);
		return res.status(422).json({ errors: err, msg: 'check fields' });
	}
});

// login to system
router.post('/login', passportStrategy, async (req, res, next) => {
	console.log('users/login', req.user);

	try {
		// returns user data after user logins in.
		const user = req.user.toObject();

		delete user.password;

		req.session.settings = {};

		return res.json({ user, settings: req.session.settings, success: true });
	} catch (error) {
		console.log('error: ', error);
		return res.status(500).json({ msg: 'An error has occurred.' });
	}
});

router.get('/logout', authLib.required(), async (req, res) => {
	try {
		// logs out a user.
		req.logout();
		await req.session.destroy();
		res.json({ user: { status: 'logged out' } });
	} catch (error) {
		console.log('error: ', error);
		res.status(500).json({ msg: 'An error has occurred.' });
	}
});

/* GET users listing. */
router.get('/', authLib.required(), async function(req, res, next) {
	const users = await User.find()
		.lean()
		.exec();

	return res.json({ users });
});

/* GET current user session */
router.get('/currentSession', authLib.required(), async function(req, res, next) {
	let user = req.user;
	delete user.password;
	return res.json({ user: req.user });
});

module.exports = router;

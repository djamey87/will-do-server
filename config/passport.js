const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User');

const localOptions = {
	usernameField: 'user[email]',
	passwordField: 'user[password]',
};

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(
	new LocalStrategy(localOptions, function(email, password, done) {
		User.findOne({ email: email })
			.then(function(user) {
				if (!user || !user.validatePassword(password)) {
					return done(null, false, { errors: { 'email or password': 'is invalid' } });
				}

				return done(null, user);
			})
			.catch(done);
	})
);

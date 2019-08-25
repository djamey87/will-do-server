const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			match: [/\S+@\S+\.\S+/, 'is invalid'],
			index: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

// generate a hash from user password and change the password to the hash.
userSchema.pre('save', function(next) {
	const user = this;
	const saltFactor = 5;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(saltFactor, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.validatePassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema);

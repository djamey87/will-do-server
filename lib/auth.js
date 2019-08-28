const auth = (() => ({
	required: () => {
		return function(req, res, next) {
			if (req.isAuthenticated()) {
				return next();
			}
			res.status(403).json({ msg: 'Not logged in' });
		};
	},
}))();

module.exports = auth;

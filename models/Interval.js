const mongoose = require('mongoose');
const { Schema } = mongoose;

// NOTES:
// - title to be optional, for the user to describe what they did while recording

const intervalSchema = new Schema(
	{
		title: String,
		task: { type: Schema.Types.ObjectId, ref: 'Task' },
		user: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Interval', intervalSchema);

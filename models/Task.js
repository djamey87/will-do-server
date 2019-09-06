const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: String,

		author: { type: Schema.Types.ObjectId, ref: 'User' },
		// can be assigned to multiple users, e.g. a meeting will have multiple attendees
		assignedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);

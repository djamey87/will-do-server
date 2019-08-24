const mongoose = require('mongoose');
const {Schema} = mongoose;

const intervalSchema = new Schema({
  	title: String,
	_task: { type: Schema.Types.ObjectId, ref: 'Task' },
  	_user: { type: Schema.Types.ObjectId, ref: 'User' }
},{timestamps:true});

module.exports = mongoose.model('Interval', intervalSchema);

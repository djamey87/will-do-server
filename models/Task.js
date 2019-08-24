const mongoose = require('mongoose');
const {Schema} = mongoose;

const taskSchema = new Schema({
  	title: String,
  	content: String,

  	_user: { type: Schema.Types.ObjectId, ref: 'User' }
},{timestamps:true});

// console.log('taskSchema', taskSchema)

module.exports = mongoose.model('Task', taskSchema);

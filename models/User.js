const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  	displayName: {
		type:String,
		required: true
	}

},{timestamps:true});

module.exports = mongoose.model('User', userSchema);

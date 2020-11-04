const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userId: {
		type: mongoose.Schema.Types.ObjectId,
    },
    username:{
        type:String,
        required:true
    },
	caption: {
		type: String,
		required: true,
    },
    photo:{
        data: Buffer,
        contentType: String
        //required:true must be added later
    },
	likes: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
			},
		},
	],
	comments: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
			},
			text: {
				type: String,
				required: true,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('post', PostSchema);

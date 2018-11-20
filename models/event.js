const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables');
const eventSchema = mongoose.Schema({
	name: {
		type: String
	},
	description: {
		type: String
	},
	date: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	image: {
		type: String
	}
});

eventSchema.plugin(dataTables);
module.exports = mongoose.model('Event', eventSchema);


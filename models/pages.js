const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables');
const pagesSchema = mongoose.Schema({
	name: {
		type: String
	},
	description: {
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

pagesSchema.plugin(dataTables);
module.exports = mongoose.model('Pages', pagesSchema);


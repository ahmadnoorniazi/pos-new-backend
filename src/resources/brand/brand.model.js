import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String
	},
	contact: {
		type: String
	},
	location: {
		type: String,
		required: true
	}
});

const Brand = mongoose.model('brand', brandSchema);

export default Brand;

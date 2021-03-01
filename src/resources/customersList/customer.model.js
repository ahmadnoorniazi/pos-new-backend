import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	contact: {
		type: String
	},
	address: {
		type: String
	},
	shop_name: {
		type: String
	}
});

const Customer = mongoose.model('customerList', customerSchema);

export default Customer;

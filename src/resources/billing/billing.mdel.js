import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const BillingSchema = new mongoose.Schema({
	customer_id: {
		type: Schema.Types.ObjectId
	},
	customer_name: {
		type: String
	},
	discount: {
		type: Number,
		default: 0
	},
	total_amount: {
		type: Number,
		required: true
	},
	grand_total: {
		type: Number,
		required: true
	},
	amount_received: {
		type: Number,
		required: true
	},
	amount_pending: {
		type: Number,
		required: true,
		default: 0
	},
	discount_percentage: {
		type: Number,
		default: 0
	},
	type: {
		type: String,
		required: true,
		enum: [ 'PAID', 'HOLD', 'PENDING' ],
		default: 'PAID'
	},
	tax_name: {
		type: String
	},
	tax_percentage: {
		type: Number,
		default: 0
	},
	tax_amount: {
		type: Number,
		default: 0
	},
	bill_category: {
		type: String,
		required: true
	},
	products: [
		{
			quantity: {
				type: Number,
				required: true
			},
			name: {
				type: String,
				required: true
			},
			price: {
				type: Number,
				required: true
			},
			id: {
				type: Schema.Types.ObjectId
			},
			type: {
				type: String,
				enum: [ 'CUSTOM', 'AUTO' ],
				default: 'AUTO'
			}
		}
	],
	time: { type: Date, default: new Date('2020-04-06T18:59:59.999Z') }
});

const Billing = mongoose.model('billing', BillingSchema);

export default Billing;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const ReceivedStock = new mongoose.Schema({
	product_id: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	product_name: {
		type: String,
		required: true
	},
	product_quantity: {
		type: Number,
		required: true
	},
	brand_name: {
		type: String,
		required: true
	},
	brand_id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	time: { type: Date, default: Date.now }
});

const ReceivedStocks = mongoose.model('received_stock', ReceivedStock);

export default ReceivedStocks;

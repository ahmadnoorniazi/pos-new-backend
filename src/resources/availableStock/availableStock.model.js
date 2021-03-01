import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const AvailableStockSchema = new mongoose.Schema({
	product_id: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	total_received: {
		type: Number,
		required: true
	},
	available: {
		type: Number,
		required: true
	},
	stock_in: {
		type: Boolean,
		required: true
	},
	isLow: {
		type: Boolean,
		required: true
	},
	time: { type: Date, default: Date.now }
});

const AvailableStock = mongoose.model('stock', AvailableStockSchema);

export default AvailableStock;

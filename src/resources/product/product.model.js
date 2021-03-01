import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	available_stock: {
		type: Number
	},
	brand_id: {
		type: Schema.Types.ObjectId,
		ref: 'Brand',
		required: true
	},
	description: {
		type: String
	},
	sale_price_a: {
		type: Number,
		required: true
	},
	sale_price_b: {
		type: Number,
		required: true
	},
	sale_price_c: {
		type: Number,
		required: true
	},
	items_per_pack: {
		type: Number
	},
	user_id: {
		type: Schema.Types.ObjectId
	},
	low_limit: {
		type: Number,
		required: true
	},
	actual_price: {
		type: Number,
		required: true
	}
});

const Product = mongoose.model('product', productSchema);

export default Product;

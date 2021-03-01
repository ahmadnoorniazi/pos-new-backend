import moment from 'moment';

/**Get All Users */
const getAll = (model) => async (req, res) => {
	try {
		const users = await model.find({}).exec();
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

const getAllProducts = (model) => async (req, res) => {
	const agg = [
		{
			$lookup: {
				from: 'brands',
				localField: 'brand_id',
				foreignField: '_id',
				as: 'brand'
			}
		},
		{
			$unwind: {
				path: '$brand'
			}
		},
		{
			$project: {
				name: 1,
				actual_price: 1,
				sale_price_a: 1,
				sale_price_b: 1,
				sale_price_c: 1,
				items_per_pack: 1,
				low_limit: 1,
				description: 1,
				'brand.name': 1,
				id: 1,
				'brand._id': 1
			}
		}
	];

	try {
		const users = await model.aggregate(agg);
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

/** Create New User*/
export const create = (model) => async (req, res) => {
	try {
		const user = await model.create(req.body);
		res.status(201).json({ message: 'User added into account', data: user });
		res.status(201).json({ message: 'Manager added into account', data: user });
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};
/** Edit User */
const update = (model) => async (req, res) => {
	try {
		const { id } = req.params;
		const updatedUser = await model.findByIdAndUpdate(id, req.body, { new: true }).exec();
		await updatedUser.save();
		res.status(201).json({ message: 'User info updated into account', data: updatedUser });
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

/** Update Billing Info */

/** Delete User  */
const remove = (model) => async (req, res) => {
	try {
		const { id } = req.params;
		const removedUser = await model.findByIdAndRemove(id);
		res.status(201).json({ message: 'User info removed from account', data: removedUser });
	} catch (e) {
		res.status(400).send({
			message: e.message
		});
	}
};

async function updateAllProduct(availableStockModel, list) {
	console.log('updateeeeeeeeeee stock more above', list);
	if (Array.isArray(list) && list.length > 0) {
		for (var i = 0; i < list.length; i++) {
			console.log('updateeeeeeeeeee stock above comes');

			const { quantity, id, type } = list[i];
			if (type !== 'CUSTOM' && id) {
				const getStock = await availableStockModel.findOne({ product_id: id }).exec();
				if (getStock && Object.keys(getStock).length > 0) {
					const { available, _id, product_name, product_id } = getStock;
					const updateRemainingQuantity = Number(available) >= 0 ? Number(available) - Number(quantity) : 0;
					const updateStock = {
						available: updateRemainingQuantity >= 0 ? updateRemainingQuantity : 0,
						isLow: updateRemainingQuantity > 20 ? false : true,
						stock_in: updateRemainingQuantity > 0 ? true : false
					};
					console.log('updateeeeeeeeeee stock comes', updateStock);
					await availableStockModel.findByIdAndUpdate({ _id: _id }, updateStock, { new: true }).exec();
				}
			}
		}
	}
}

export const createBill = (model, availableStockModel) => async (req, res) => {
	try {
		await updateAllProduct(availableStockModel, req.body.products);
		await model.create(req.body);

		res.status(201).json({ message: 'Bill added into account' });
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const filterBillByDate = (model) => async (req, res) => {
	try {
		const { startDate, endDate } = req.params;

		const users = await model.find({ time: { $gte: `${startDate}`, $lte: `${endDate}` } }).exec();
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

const filter = (model) => async (req, res) => {
	try {
		const { search } = req.params;

		const users = await model.find({ name: { $regex: search, $options: 'i' } }).exec();
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

const getSalesData = (model) => async (req, res) => {
	try {
		const bills = await model.aggregate([
			{
				$group: {
					_id: null,
					total_sale: { $sum: '$total_sale_price' },
					total_profit: {
						$sum: {
							$subtract: [ '$total_sale_price', { $add: [ '$discount', '$total_actual_price' ] } ]
						}
					},
					total_discount: { $sum: '$discount' },
					total_actual: { $sum: '$total_actual_price' }
				}
			}
		]);
		res.status(200).json({ ...bills['0'] });
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

const getUnpaidBills = (model) => async (req, res) => {
	try {
		const bills = await model.find({ paid: false });
		res.status(200).json(bills);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const createStock = (model, availableStockModel, brandModel, productModel) => async (req, res) => {
	try {
		const { product_id, product_quantity, brand_id } = req.body;

		if (!product_id || !product_quantity || !brand_id) {
			throw new Error('not valid data');
		}

		const brand = await brandModel.findOne({ _id: brand_id }).exec();
		console.log('product modellll', productModel);
		const product = await productModel.findOne({ _id: product_id }).exec();

		console.log('branddddddd', brand);
		console.log(product_id, 'producttt', product);

		const stock = await model.create({ ...req.body, brand_id, brand_name: brand.name, product_name: product.name });
		const currentAvailableStock = await availableStockModel.findOne({ product_id: product_id }).exec();

		if (currentAvailableStock && Object.keys(currentAvailableStock).length > 0) {
			const { total_received, available, _id, product_name, product_id } = currentAvailableStock;
			const updateQuantity = Number(total_received) + Number(product_quantity);
			const updateRemainingQuantity = Number(available) + Number(product_quantity);
			const updateStock = {
				product_id,
				total_received: updateQuantity,
				available: updateRemainingQuantity,
				isLow: updateRemainingQuantity > 10 ? false : true,
				stock_in: updateRemainingQuantity > 0 ? true : false
			};
			const updatedUser = await availableStockModel
				.findByIdAndUpdate({ _id: _id }, updateStock, { new: true })
				.exec();
		} else {
			await availableStockModel.create({
				product_id,
				total_received: product_quantity,
				available: product_quantity,
				isLow: product_quantity > 10 ? false : true,
				stock_in: product_quantity > 0 ? true : false
			});
		}

		res.status(201).json({ message: 'Stock added into account', data: stock });
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const deleteStock = (model, availableStockModel) => async (req, res) => {
	try {
		const { product_id, product_quantity } = req.body;
		const { id } = req.params;

		const stock = await model.deleteOne({ _id: id });
		const currentAvailableStock = await availableStockModel.findOne({ product_id: product_id }).exec();

		if (currentAvailableStock && Object.keys(currentAvailableStock).length > 0) {
			const { total_received, available, _id, product_name, product_id } = currentAvailableStock;
			if (Number(available) < Number(product_quantity)) {
				throw new Error('error');
			}
			const updateQuantity = Number(total_received) - Number(product_quantity);
			const updateRemainingQuantity = Number(available) - Number(product_quantity);
			const updateStock = {
				product_id,
				total_received: updateQuantity,
				available: updateRemainingQuantity,
				isLow: updateRemainingQuantity > 10 ? false : true,
				stock_in: updateRemainingQuantity > 0 ? true : false
			};
			const updatedUser = await availableStockModel
				.findByIdAndUpdate({ _id: _id }, updateStock, { new: true })
				.exec();
		}

		res.status(201).json({ message: 'Stock added into account', data: stock });
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const filterWeekly = (model) => async (req, res) => {
	try {
		var m = moment();
		const start = m.startOf('week').startOf('day').toDate();
		const endOfStart = m.endOf('week').endOf('day').toDate();
		const result = await model.aggregate([
			//match will get all sale_items of the week with respect to start and endDate
			{ $match: { $or: [ { time: { $gte: start, $lt: endOfStart } } ] } },

			//project will add day on the base of time like day 1 or day 2

			{
				$project: {
					day: {
						$dayOfWeek: '$time'
					},
					total_sale_price: 1
				}
			},
			//grroup will group data on the base of day and will calculate the total sale

			{ $group: { _id: '$day', sale: { $sum: '$total_sale_price' } } }
		]);
		res.status(200).json(result);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const filterMonthly = (model) => async (req, res) => {
	try {
		const users = await model
			.aggregate([
				{
					/* group by week */
					$group: {
						_id: { $month: '$time' },
						count: { $sum: '$total_sale_price' }
					}
				}
			])
			.exec();
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const testingFilter = (model) => async (req, res) => {
	try {
		const users = await model.find({ total_sale_price: { $in: [ 562 ] } });
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const getReceivedStock = (model) => async (req, res) => {
	try {
		const stock = await model.find({}).exec();
		res.status(200).json(stock);
	} catch (e) {
		res.status(400).send({
			error: e.message
		});
	}
};

export const crudControllers = (model, second, third, forth) => ({
	getAll: getAll(model),
	create: create(model),
	update: update(model),
	remove: remove(model),
	filter: filter(model),
	createBill: createBill(model, second),
	filterBillByDate: filterBillByDate(model),
	getSalesData: getSalesData(model),
	createStock: createStock(model, second, third, forth),
	deleteStock: deleteStock(model, second),
	filterWeekly: filterWeekly(model),
	filterMonthly: filterMonthly(model),
	getUnpaidBills: getUnpaidBills(model),
	testingFilter: testingFilter(model),
	getReceivedStock: getReceivedStock(model),
	getAllProducts: getAllProducts(model)
});

/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import './config/mongoose';
import dotenv from 'dotenv';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import userRoute from './resources/user/user.router';
import customerRoute from './resources/customersList/customer.router';
import productRoute from './resources/product/product.router';
import brandRoute from './resources/brand/brand.router';

import Billing from './resources/billing/billing.router';
import ReceivedStock from './resources/ReceivedStock/received_stock.router';
import AvailableStock from './resources/availableStock/availableStock.router';
import path from 'path';
import multer from 'multer';
import { signin, protect, signup } from './utils/auth';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
dotenv.config();
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		// rejects storing a file
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

/** Public Routes */

app.get('/', (req, res) => {
	res.send('Hello Welcome');
});

app.post('/signin', signin);
app.post('/signup', upload.single('image'), signup);

app.use('/user', protect);
app.use('/user', userRoute);

app.use('/customers', customerRoute);

app.use('/products', productRoute);
app.use('/brands', brandRoute);

app.use('/billing', Billing);
app.use('/received_stock', ReceivedStock);
app.use('/available_stock', AvailableStock);

global.CronJob = require('./cron.js');

app.portNumber = 3000;

function listen(port) {
	app.portNumber = port;
	app
		.listen(port, () => {
			console.log('server is running on port :' + app.portNumber);
		})
		.on('error', function (err) {
			if (err.errno === 'EADDRINUSE') {
				console.log(`----- Port is Already Busy`);
			} else {
				console.log(err);
			}
		});
}

listen(app.portNumber);

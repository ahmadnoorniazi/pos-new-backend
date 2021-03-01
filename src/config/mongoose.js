import mongoose from 'mongoose';
const uri = 'mongodb+srv://ahmad123:ahmad123@pos.ta9zg.mongodb.net/POS?retryWrites=true&w=majority';

mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('connected to mongodb ...'))
	.catch((err) => console.error('could not connect to mongodb ' + err));

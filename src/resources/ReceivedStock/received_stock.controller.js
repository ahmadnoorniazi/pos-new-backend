import ReceivedStock from './received_stock.model';
import { crudControllers } from '../../utils/crud';
import AvailabStocModel from '../availableStock/availableStock.model';
import BrandModel from '../brand/brand.model';
import ProductsModel from '../product/product.model';

export default crudControllers(ReceivedStock, AvailabStocModel, BrandModel, ProductsModel);

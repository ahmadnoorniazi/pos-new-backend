import { Router } from 'express';
import controller from './received_stock.controller';

const router = Router();

router.route('/create').post(controller.createStock);
router.route('/all').get(controller.getReceivedStock);
router.route('/update/:id').put(controller.update);
router.route('/remove/:id').delete(controller.deleteStock);

export default router;

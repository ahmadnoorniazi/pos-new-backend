import { Router } from 'express';
import controller from './availableStock.controller';

const router = Router();

router.route('/create').post(controller.create);

router.route('/all').get(controller.getAll);

// router.route("/filter/:search").get(controller.filter);

router.route('/remove/:id').delete(controller.remove);

export default router;

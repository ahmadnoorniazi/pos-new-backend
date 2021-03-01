import { Router } from "express";
import controller from "./billing.controller";
const router = Router();

router.route("/create").post(controller.createBill);

router.route("/all").get(controller.getAll);
router.route("/filter/:startDate/:endDate").get(controller.filterBillByDate);
router.route("/update/:id").put(controller.update);
router.route("/remove/:id").delete(controller.remove);
router.route("/getAllSale").get(controller.getSalesData);
router.route("/getWeeklySale").get(controller.filterWeekly);
router.route("/getMonthly").get(controller.filterMonthly);
router.route("/getUnpaidBills").get(controller.getUnpaidBills);
router.route("/testingFilter").get(controller.testingFilter);

export default router;

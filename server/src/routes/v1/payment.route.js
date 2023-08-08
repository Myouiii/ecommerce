import { Router } from 'express';
import { getVnpayResult, createByMomo, getMomoResult, createByVnpay } from '../../controllers/payment.controller.js';

const router = Router();
router.route('/vnpay')
  .post(createByVnpay);
router.route('/vnpay/callback')
  .get(getVnpayResult);
router.route('/momo')
  .post(createByMomo)
  .get(getMomoResult);

export default router;

import { Router } from 'express';
import { isAdminOrStaff, isGuestOrAuthorized } from '../../middlewares/jwt-auth.js';
import {
  getOne,
  getList,
  createByUser,
  getAllOrders,
  createOrderByAdminOrStaff,
  updateOrderByAdminOrStaff,
  cancelOrder,
  rePayOrder,
  getTotal,
} from '../../controllers/orders.controller.js';

const router = Router();

/**
 * Authorization
 * Get all              : admin or staff
 * Create, update       : admin or staff
 * Delete               : not allowed
 */

router.route('/manager')
  .get(isAdminOrStaff, getAllOrders)
  .post(isAdminOrStaff, createOrderByAdminOrStaff);

router.route('/manager/:orderId')
  .patch(isAdminOrStaff, updateOrderByAdminOrStaff);

router.route('/getTotal')
  .get(isAdminOrStaff, getTotal)
/**
 * No Authorization
 */

router.route('/')
  .get(isGuestOrAuthorized, getList)
  .post(isGuestOrAuthorized, createByUser);

router.get('/:orderId', isGuestOrAuthorized, getOne);
router.get('/re-pay/:orderId', isGuestOrAuthorized, rePayOrder);
router.patch('/cancel/:orderId', isGuestOrAuthorized, cancelOrder);

export default router;

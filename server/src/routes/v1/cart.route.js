import { Router } from 'express';
import {
  getCartItems,
  addItem,
  updateItemQty,
  deleteItem,
  cleanCart,
} from '../../controllers/cart.controller.js';
import { isAuthorized, isGuestOrAuthorized } from '../../middlewares/jwt-auth.js';

const router = Router();

/**
 * Authorization
 * all routes : any user
 */

router.route('/').post(isGuestOrAuthorized, getCartItems)
  //.post(isAuthorized, addItem)
  .patch(isGuestOrAuthorized, updateItemQty)

router.route('/add').post(isGuestOrAuthorized, addItem);

router.route('/:productId/:sku').delete(isGuestOrAuthorized, deleteItem);
router.route('/clean').delete(isGuestOrAuthorized, cleanCart);

export default router;

import { Router } from 'express';
import { getBestSellerProducts, getFullAllProducts, getStaMonthlyRevenue } from '../../controllers/statistic.controller.js';
import { isAdmin, isAdminOrStaff } from '../../middlewares/jwt-auth.js';
const router = Router();

// api: thống kê tổng sản phẩm
router.get('/products', isAdminOrStaff, getFullAllProducts);
router.get('/products/best-seller', isAdminOrStaff, getBestSellerProducts);
// api: thống kê doanh thu theo tháng
router.get('/monthly-revenue', isAdminOrStaff, getStaMonthlyRevenue);





export default router;

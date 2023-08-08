import { Router } from 'express';

// import all the routes here
import authRoutes from './auth.route.js';
import accountRoutes from './account.route.js';
import userRoutes from './users.route.js';

import categoryRoutes from './categories.route.js';
import brandRoutes from './brands.route.js';
import productRoutes from './products.route.js';
import discountRoutes from './discounts.route.js';
import cartRoutes from './cart.route.js';


const router = Router();

/**
 * GET v2/status
 */
router.get('/status', (req, res) => {
	res.json({
		success: true,
		timestamp: new Date().toISOString(),
		ip: req.ipv4,
		url: req.originalUrl,
	});
});

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);
router.use('/discounts', discountRoutes);


export default router;

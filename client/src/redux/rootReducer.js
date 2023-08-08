import { combineReducers } from 'redux';
import authSlice from './slices/authSlice';
import categorySlice from './slices/categorySlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import accountSlice from './slices/accountSlice';
import productsReducer from './slices/productSlice';
import searchProductsReducer from './slices/searchProductSlice';
import userBehaviorSlice from './slices/userBehaviorSlice';
import brandSlice from './slices/brandSlice';
import userSlice from './slices/userSlice';

// import brandsReducer from './reducers/brands';
import discountsReducer from './reducers/discounts';
// import usersReducer from './reducers/users';
// import accountReducer from './reducers/account';
import ordersReducer from './reducers/orders';
import commentsReduces from './reducers/comments';

const rootReducer = combineReducers({
  auth: authSlice,
  category: categorySlice,
  cart: cartSlice,
  order: orderSlice,
  account: accountSlice,
  user: userSlice,

  brand: brandSlice,
  discount: discountsReducer,
  product: productsReducer,
  searchProduct: searchProductsReducer,
  // account: accountReducer,
  orderManager: ordersReducer,
  comment: commentsReduces,

  userBehavior: userBehaviorSlice
});

export default rootReducer;

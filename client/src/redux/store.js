import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './rootReducer';

const middleware = (getDefaultMiddleware) => {
  let middlewares = getDefaultMiddleware({
    serializableCheck: false
  });

  if (process.env.NODE_ENV === `development`) {
    middlewares = middlewares.concat(logger);
  }
  return middlewares;
};

const store = configureStore({
  middleware,
  reducer: rootReducer
});

export default store;

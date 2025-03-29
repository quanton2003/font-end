import { configureStore } from '@reduxjs/toolkit';
import productReducer from './sides/ProductSlide';
import userReducer from './sides/userSlide';

export const store = configureStore({
  reducer: {
    product: productReducer,  
    user:userReducer
  },
});

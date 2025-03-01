import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './sides/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,  // Đúng: đặt counterReducer bên trong object `reducer`
  },
});

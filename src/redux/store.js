import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './sides/counterSlice';
import userReducer from './sides/userSlide';

export const store = configureStore({
  reducer: {
    counter: counterReducer,  
    user:userReducer
  },
});

// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // 'auth' is the key under which the reducer is registered
  },
});

export default store;

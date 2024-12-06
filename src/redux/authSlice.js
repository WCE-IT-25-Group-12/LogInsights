// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  signedIn: false,
  msg: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignedIn: (state, action) => {
      console.log('setSignedIn called with:', action.payload);
      state.signedIn = action.payload;
    },
    setMsg: (state, action) => {
      state.msg = action.payload;
    },
  },
});

export const { setSignedIn, setMsg } = authSlice.actions;
export default authSlice.reducer;

// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  signedIn: false,
  msg: 'akksdfma',
  para1: 0,
  para2: 0,
  para3: 0,
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
    setPara1: (state, action) => {
      state.para1 = action.payload;
    },
    setPara2: (state, action) => {
      state.para2 = action.payload;
    },
    setPara3: (state, action) => {
      state.para3 = action.payload;
    },
  },
});

export const { setSignedIn, setMsg, setPara1, setPara2, setPara3 } =
  authSlice.actions;
export default authSlice.reducer;

// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  signedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignedIn: (state, action) => {
      console.log('setSignedIn called with:', action.payload);
      state.signedIn = action.payload;
    },
  },
});

export const { setSignedIn } = authSlice.actions;
export default authSlice.reducer;

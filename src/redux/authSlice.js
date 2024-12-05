// src/redux/authSlice.js
const initialState = {
  signedIn: false,
};

// Action Types
const TOGGLE_SIGN_IN = 'auth/toggleSignIn';

// Action Creators
export const toggleSignIn = () => ({
  type: TOGGLE_SIGN_IN,
});

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIGN_IN:
      return {
        ...state,
        signedIn: !state.signedIn,
      };
    default:
      return state;
  }
};

export default authReducer;

// src/redux/store.js
import { createStore } from 'redux';

const initialState = {
  signedIn: false,
};

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SIGN_IN':
      return {
        signedIn: !state.signedIn,
      };
    default:
      return state;
  }
};

// Action Creators
export const toggleSignIn = () => ({
  type: 'TOGGLE_SIGN_IN',
});

// Create Store
const store = createStore(authReducer);

export default store;

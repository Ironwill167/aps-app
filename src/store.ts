// filepath: /c:/Users/ewill/Documents/APS App v0.4.2/aps-app/src/store.ts
import { configureStore } from '@reduxjs/toolkit';

// Define action types
const SET_VIEW = 'SET_VIEW';

// Define action creators
export const setView = (view: string) => ({
  type: SET_VIEW,
  payload: view,
});

// Define the initial state
const initialState = {
  currentView: 'Home',
};

// Create reducer
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_VIEW:
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
};

// Create store
const store = configureStore({
  reducer: reducer,
});

export default store;
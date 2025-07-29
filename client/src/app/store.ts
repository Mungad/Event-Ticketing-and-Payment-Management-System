import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { usersAPI } from '../features/users/usersAPI';
import { loginAPI } from '../features/login/loginAPI';
import userSlice from '../features/login/userSlice';
import eventsSlice from '../features/events/eventsSlice';
import cartReducer from '../components/events/cart/cartSlice'; 
import { eventsAPI } from '../features/events/eventsAPI';
import { venuesAPI } from '../features/venue/venueAPI';
import { supportAPI } from "../features/support/supportAPI";

// Redux Persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user', 'cart'], 
};

// Combine all reducers
const rootReducer = combineReducers({
  [usersAPI.reducerPath]: usersAPI.reducer,
  [loginAPI.reducerPath]: loginAPI.reducer,
  [eventsAPI.reducerPath]: eventsAPI.reducer,
  [venuesAPI.reducerPath]: venuesAPI.reducer,
  [supportAPI.reducerPath]: supportAPI.reducer,
  user: userSlice,
  events: eventsSlice,
  cart: cartReducer,
  venue: venuesAPI.reducer, 
});

// Apply persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(usersAPI.middleware)
      .concat(loginAPI.middleware)
      .concat(eventsAPI.middleware)
      .concat(venuesAPI.middleware)
      .concat(supportAPI.middleware),
});

// Persistor for React-Persist Gate
export const persistedStore = persistStore(store);

//  These are the types you'll use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userReducer from '../slices/userSlice';
import { ingredientReducer } from 'src/slices/ingredientSlice';
import { burgerConstructorReducer } from 'src/slices/constructorSlice';
import { orderReducer } from 'src/slices/orderSlice';
import { feedsReducer } from 'src/slices/feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: orderReducer,
  user: userReducer,
  feeds: feedsReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
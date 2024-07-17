import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface TOrdersState {
  orders: Array<TOrder>;
  isLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error?: string | null;
  totalToday: number;
}

export const initialState: TOrdersState = {
  orders: [],
  isLoading: true,
  orderRequest: false,
  orderModalData: null,
  totalToday: 0
};

export const fetchOrders = createAsyncThunk('fetchOrders', getOrdersApi);
export const orderBurger = createAsyncThunk('orderBurger', orderBurgerApi);
export const getOrderId = createAsyncThunk('getOrder', getOrderByNumberApi);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      });
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(getOrderId.pending, (state) => {
        state.orderModalData = null;
        state.error = null;
      })
      .addCase(getOrderId.rejected, (state, action) => {
        state.error = action.error?.message;
      })
      .addCase(getOrderId.fulfilled, (state, action) => {
        state.orderModalData = action.payload.orders[0];
      });
  }
});
export const { selectOrderRequest, selectOrderModalData, selectOrders } =
  orderSlice.selectors;
export const orderReducer = orderSlice.reducer;

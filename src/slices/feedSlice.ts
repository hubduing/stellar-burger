import { getFeedsApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";


export interface TFeedsState {
  orders: Array<TOrder>;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error?: string | null;
}

export const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

export const fetchFeeds = createAsyncThunk('fetchFeeds', getFeedsApi);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectOrdersFeeds: (stateFeeds) => stateFeeds.orders,
    selectTotalFeeds: (stateFeeds) => stateFeeds.total,
    selectTotalTodayFeeds: (stateFeeds) => stateFeeds.totalToday,
    selectIsLoadingFeeds: (stateFeeds) => stateFeeds.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      });
  }
});

export const {
  selectOrdersFeeds,
  selectIsLoadingFeeds,
  selectTotalFeeds,
  selectTotalTodayFeeds
} = feedsSlice.selectors;

export const feedsReducer = feedsSlice.reducer;

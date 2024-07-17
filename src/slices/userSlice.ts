import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

export const getUser = createAsyncThunk('getUser', getUserApi);
export const registerUser = createAsyncThunk('registerUser', registerUserApi);
export const updateUser = createAsyncThunk('updateUser', updateUserApi);
export const loginUser = createAsyncThunk('loginUser', loginUserApi);
export const logoutUser = createAsyncThunk('logoutUser', logoutApi);

interface UserState {
  loading: boolean | null;
  user: TUser | null;
  error: string | undefined;
  isAuth: boolean;
}

const initialState: UserState = {
  loading: false,
  user: null,
  error: '',
  isAuth: false
};

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (stateUser) => stateUser.user,
    selectError: (stateUser) => stateUser.error,
    selectIsUserLoading: (stateUser) => stateUser.loading,
    selectIsAuth: (stateUser) => stateUser.isAuth
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
        state.isAuth = true;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.user = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        // state.isAuth = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state, _) => {
        state.loading = false;
        state.user = null;
        localStorage.removeItem('refreshToken');
        setCookie('accessToken', '');
        state.isAuth = false;
      });
  }
});

export const { selectError, selectUser, selectIsUserLoading, selectIsAuth } =
  userSlice.selectors;
export default userSlice.reducer;

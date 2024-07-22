import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  getUser,
  registerUser,
  updateUser,
  loginUser,
  logoutUser
} from '../slices/userSlice';
import {
  getUserApi,
  registerUserApi,
  updateUserApi,
  loginUserApi,
  logoutApi
} from '../utils/burger-api';
import { TUser } from '../utils/types';
import { setCookie } from '../utils/cookie';

jest.mock('../utils/burger-api', () => ({
  getUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn()
}));
jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn()
}));

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'any user'
};

const initialState = {
  loading: false,
  user: null,
  error: '',
  isAuth: false
};

describe('userSlice actions', () => {
  beforeEach(() => {
    global.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    };
  });
  const createTestStore = () =>
    configureStore({
      reducer: {
        user: userReducer
      }
    });

  test('должен обработать getUser.fulfilled', async () => {
    (getUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    const store = createTestStore();
    await store.dispatch(getUser() as any);
    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
  });

  test('должен обработать registerUser.fulfilled', async () => {
    (registerUserApi as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });

    const store = createTestStore();
    await store.dispatch(
      registerUser({
        email: 'test@example.com',
        password: 'password',
        name: 'any user'
      }) as any
    );
    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(setCookie).toHaveBeenCalledWith('accessToken', 'access-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh-token'
    );
  });

  test('должен обработать updateUser.fulfilled', async () => {
    (updateUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    const store = createTestStore();
    await store.dispatch(updateUser(mockUser) as any);
    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.isAuth).toBe(true);
  });

  test('должен обработать loginUser.fulfilled', async () => {
    (loginUserApi as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });

    const store = createTestStore();
    await store.dispatch(
      loginUser({ email: 'test@example.com', password: 'password' }) as any
    );
    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.isAuth).toBe(true);
    expect(setCookie).toHaveBeenCalledWith('accessToken', 'access-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh-token'
    );
  });

  test('должен обработать logoutUser.fulfilled', async () => {
    (logoutApi as jest.Mock).mockResolvedValueOnce({});

    const store = createTestStore();
    await store.dispatch(logoutUser() as any);
    const state = store.getState().user;
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.isAuth).toBe(false);
    expect(setCookie).toHaveBeenCalledWith('accessToken', '');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
  });
});

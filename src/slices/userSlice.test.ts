import userReducer, {
  getUser,
  registerUser,
  updateUser,
  loginUser,
  logoutUser,
  selectError,
  selectUser,
  selectIsUserLoading,
  selectIsAuth
} from './userSlice';
import { configureStore } from '@reduxjs/toolkit';

// Создаем моковый стор для тестирования
const store = configureStore({ reducer: { userReducer } });
describe('userReducer', () => {
  const mockRegisterUserApi = jest.fn().mockResolvedValue({
    user: {
      email: 'newuser@example.com',
      name: 'New User'
    },
    refreshToken: 'mockRefreshToken',
    accessToken: 'mockAccessToken'
  });

  const mockLoginUserApi = jest.fn().mockResolvedValue({
    user: {
      email: 'user@example.com',
      name: 'Logged In User'
    },
    refreshToken: 'mockRefreshToken',
    accessToken: 'mockAccessToken'
  });

  const getUserApi = jest.fn().mockResolvedValue({
    user: {
      email: 'test@example.com',
      name: 'Test User'
    }
  });
  const logoutApi = jest.fn().mockResolvedValue({});

  it('selectUser должен возвращать текущего пользователя', () => {
    const user = { email: 'test@example.com', name: 'Test User' };
    store.dispatch({ type: 'userReducer/userLoggedIn', payload: { user } });
    const selectedUser = selectUser(store.getState());
    expect(selectedUser).toEqual(user);
  });

  it('selectError должен возвращать текущую ошибку', () => {
    const error = 'Ошибка авторизации';
    store.dispatch({ type: 'userReducer/loginFailed', payload: { error } });
    const selectedError = selectError(store.getState());
    expect(selectedError).toEqual(error);
  });

  it('selectIsUserLoading должен возвращать статус загрузки', () => {
    store.dispatch({ type: 'userReducer/getUserPending' });
    const isLoading = selectIsUserLoading(store.getState());
    expect(isLoading).toBeTruthy();
  });

  it('selectIsAuth должен возвращать статус аутентификации', () => {
    store.dispatch({ type: 'userReducer/userLoggedIn', payload: { user: {} } });
    const isAuth = selectIsAuth(store.getState());
    expect(isAuth).toBeTruthy();
  });

  // Тесты для асинхронных экшенов
  it('getUser должен устанавливать пользователя при успешном выполнении', async () => {
    const user = { email: 'test@example.com', name: 'Test User' };
    // const getUserApi = jest.fn().mockResolvedValue({ user });
    const action = await store.dispatch(getUser());
    const state = store.getState();
    expect(action.type).toBe('getUser/fulfilled');
    expect(selectUser(state)).toEqual(user);
  });

  it('registerUser должен регистрировать пользователя при успешном выполнении', async () => {
    const action = await store.dispatch(
      registerUser({
        email: 'newuser@example.com',
        password: 'password123',
        name: ''
      })
    );
    const state = store.getState();
    expect(action.type).toBe('registerUser/fulfilled');
    expect(selectUser(state)).toEqual(
      mockRegisterUserApi.mock.results[0].value.user
    );
  });

  it('loginUser должен аутентифицировать пользователя при успешном выполнении', async () => {
    const action = await store.dispatch(
      loginUser({
        email: 'user@example.com',
        password: 'password123'
      })
    );
    const state = store.getState();
    expect(action.type).toBe('loginUser/fulfilled');
    expect(selectIsAuth(state)).toBeTruthy();
  });

  it('updateUser должен обновлять данные пользователя при успешном выполнении', async () => {
    const user = { email: 'existinguser@example.com', name: 'Updated User' };
    const updateUserApi = jest.fn().mockResolvedValue({ user });
    const action = await store.dispatch(updateUser(updateUserApi));
    const state = store.getState();
    expect(action.type).toBe('updateUser/fulfilled');
    expect(selectUser(state)).toEqual(user);
  });

  it('logoutUser должен выходить пользователя из системы при успешном выполнении', async () => {
    // Предполагаем, что пользователь был аутентифицирован до этого
    store.dispatch({ type: 'userReducer/userLoggedIn', payload: { user: {} } });
    // const logoutApi = jest.fn().mockResolvedValue({});
    const action = await store.dispatch(logoutUser());
    const state = store.getState();
    expect(action.type).toBe('logoutUser/fulfilled');
    expect(selectIsAuth(state)).toBeFalsy();
  });
});

import { RootState } from '../services/store';
import {
  selectUser,
  selectError,
  selectIsUserLoading,
  selectIsAuth
} from '../slices/userSlice';

const mockState: RootState = {
  userReducer: {
    loading: false,
    user: {
      email: 'test@example.com',
      name: 'any user'
    },
    error: '',
    isAuth: true
  },
  burgerReducer: {
    ingredients: [],
    buns: [],
    mains: [],
    sauces: [],
    feeds: [],
    orderUser: [],
    isLoading: false,
    currentOrder: null,
    error: null,
    burgerConstructor: {
      bun: null,
      ingredients: [],
      orderModal: null
    }
  }
};

describe('userSlice selectors', () => {
  test('selectUser должен возвращать пользователя', () => {
    const user = selectUser(mockState);
    expect(user).toEqual(mockState.userReducer.user);
  });

  test('selectError должен возвращать ошибку', () => {
    const error = selectError(mockState);
    expect(error).toBe(mockState.userReducer.error);
  });

  test('selectIsUserLoading должен возвращать статус загрузки', () => {
    const loading = selectIsUserLoading(mockState);
    expect(loading).toBe(mockState.userReducer.loading);
  });

  test('selectIsAuth должен возвращать статус аутентификации', () => {
    const isAuth = selectIsAuth(mockState);
    expect(isAuth).toBe(mockState.userReducer.isAuth);
  });
});

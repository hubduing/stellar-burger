import { configureStore } from '@reduxjs/toolkit';
import store, { rootReducer } from './store';

describe('Redux Store', () => {
  it('должен вернуть начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    // Получение начального состояния хранилища
    const initialState = store.getState();

    // Вызов rootReducer с undefined состоянием и неизвестным экшеном
    store.dispatch({ type: 'UNKNOWN_ACTION' });

    // Получение нового состояния хранилища после выполнения действия
    const newState = store.getState();

    // Проверка, что новое состояние равно начальному состоянию
    expect(newState).toEqual(initialState);
  });

  it('в rootReducer должны быть правильные редьюсеры', () => {
    expect(rootReducer).toHaveProperty('burgerReducer');
    expect(rootReducer).toHaveProperty('userReducer');
  });

  it('настроить стор с помощью rootReducer', () => {
    const testStore = configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production'
    });

    expect(testStore.getState()).toHaveProperty('burgerReducer');
    expect(testStore.getState()).toHaveProperty('userReducer');
  });

  it('должен корректно возвращать исходное состояние', () => {
    const state = store.getState();

    expect(state).toHaveProperty('burgerReducer');
    expect(state).toHaveProperty('userReducer');
  });
});

import { configureStore } from '@reduxjs/toolkit';

import store, { rootReducer } from './store';

describe('Redux Store', () => {
  test('в rootReducer должны быть правильные редьюсеры', () => {
    expect(rootReducer).toHaveProperty('burgerReducer');
    expect(rootReducer).toHaveProperty('userReducer');
  });

  test('настроить стор с помощью rootReducer', () => {
    const testStore = configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production'
    });

    expect(testStore.getState()).toHaveProperty('burgerReducer');
    expect(testStore.getState()).toHaveProperty('userReducer');
  });

  test('должен корректно возвращать исходное состояние', () => {
    const state = store.getState();

    expect(state).toHaveProperty('burgerReducer');
    expect(state).toHaveProperty('userReducer');
  });
});

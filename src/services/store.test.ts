import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';

describe('корневой редьюсер', () => {
  const store = configureStore({
    reducer: rootReducer
  });
  test('работа корневого редьюсера', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    store.dispatch(action);
    expect(store.getState()).toEqual(rootReducer(undefined, action));
  });
});
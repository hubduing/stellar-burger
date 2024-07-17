import { configureStore } from '@reduxjs/toolkit';
import {
  getOrder,
  fetchIngredients,
  fetchFeeds,
  fetchOrders,
  orderBurger,
  addBun,
  addIngredient,
  removeIngredient,
  setOrderModal,
  down,
  up,
  initialState
} from '../slices/burgerSlice';
import burgerReducer from '../slices/burgerSlice';
import { TIngredient, TConstructorIngredient, TOrder } from '../utils/types';
import {
  getOrderByNumberApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getIngredientsApi
} from '../utils/burger-api';
import { v4 as randomId } from 'uuid';

jest.mock('../utils/burger-api');
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid')
}));

const mockBun: TIngredient = {
  _id: '1',
  name: 'Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  price: 50,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile'
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'Main',
  type: 'main',
  proteins: 30,
  fat: 20,
  carbohydrates: 10,
  calories: 300,
  price: 100,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile'
};

const mockOrder: TOrder = {
  _id: 'order1',
  ingredients: ['1', '2'],
  status: 'done',
  name: 'Order 1',
  createdAt: '2023-07-17T00:00:00.000Z',
  updatedAt: '2023-07-17T00:00:00.000Z',
  number: 1
};

describe('burgerSlice extraReducers', () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        burger: burgerReducer
      }
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен вернуть начальное состояние', () => {
    const store = createTestStore();
    const state = store.getState().burger;
    expect(state).toEqual(initialState);
  });

  test('должен обработать fetchIngredients.fulfilled', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValueOnce([
      mockBun,
      mockIngredient
    ]);
    const store = createTestStore();
    await store.dispatch(fetchIngredients() as any);
    const state = store.getState().burger;
    expect(state.ingredients).toEqual([mockBun, mockIngredient]);
    expect(state.buns).toEqual([mockBun]);
    expect(state.mains).toEqual([mockIngredient]);
    expect(state.sauces).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  test('должен обработать fetchFeeds.fulfilled', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValueOnce({ orders: [mockOrder] });
    const store = createTestStore();
    await store.dispatch(fetchFeeds() as any);
    const state = store.getState().burger;
    expect(state.feeds).toEqual([mockOrder]);
    expect(state.isLoading).toBe(false);
  });

  test('должен обработать fetchOrders.fulfilled', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValueOnce([mockOrder]);
    const store = createTestStore();
    await store.dispatch(fetchOrders() as any);
    const state = store.getState().burger;
    expect(state.orderUser).toEqual([mockOrder]);
    expect(state.isLoading).toBe(false);
  });

  test('должен обработать orderBurger.fulfilled', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValueOnce({ order: mockOrder });
    const store = createTestStore();
    await store.dispatch(orderBurger(['1', '2']) as any);
    const state = store.getState().burger;
    expect(state.burgerConstructor.orderModal).toEqual(mockOrder);
    expect(state.isLoading).toBe(false);
  });

  test('должен обработать getOrder.fulfilled', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValueOnce({
      orders: [mockOrder]
    });
    const store = createTestStore();
    await store.dispatch(getOrder(1) as any);
    const state = store.getState().burger;
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.isLoading).toBe(false);
  });
});

describe('burgerSlice reducers', () => {
  test('должен обработать addBun', () => {
    const state = burgerReducer(initialState, addBun(mockBun));
    expect(state.burgerConstructor.bun).toEqual(mockBun);
  });

  test('должен обработать addIngredient', () => {
    const state = burgerReducer(initialState, addIngredient(mockIngredient));
    expect(state.burgerConstructor.ingredients).toEqual([
      { ...mockIngredient, id: 'test-uuid' }
    ]);
  });

  test('должен обработать removeIngredient', () => {
    const initialStateWithIngredient = {
      ...initialState,
      burgerConstructor: {
        ...initialState.burgerConstructor,
        ingredients: [{ ...mockIngredient, id: 'random-id' }]
      }
    };
    const state = burgerReducer(
      initialStateWithIngredient,
      removeIngredient('random-id')
    );
    expect(state.burgerConstructor.ingredients).toEqual([]);
  });

  test('должен обработать setOrderModal', () => {
    const state = burgerReducer(initialState, setOrderModal(mockOrder));
    expect(state.burgerConstructor.orderModal).toEqual(mockOrder);
  });

  test('должен обработать up', () => {
    const initialStateWithIngredients = {
      ...initialState,
      burgerConstructor: {
        ...initialState.burgerConstructor,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      }
    };
    const state = burgerReducer(initialStateWithIngredients, up('2'));
    expect(state.burgerConstructor.ingredients).toEqual([
      { ...mockIngredient, id: '2' },
      { ...mockIngredient, id: '1' }
    ]);
  });

  test('должен обработать down', () => {
    const initialStateWithIngredients = {
      ...initialState,
      burgerConstructor: {
        ...initialState.burgerConstructor,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      }
    };
    const state = burgerReducer(initialStateWithIngredients, down('1'));
    expect(state.burgerConstructor.ingredients).toEqual([
      { ...mockIngredient, id: '2' },
      { ...mockIngredient, id: '1' }
    ]);
  });
});

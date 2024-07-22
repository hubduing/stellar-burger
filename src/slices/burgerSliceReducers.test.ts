import { configureStore } from '@reduxjs/toolkit';
import burgerSlice, {
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

  it('Тест fetchIngredients.pending запроса на серверу', () => {
    const state = burgerSlice(initialState, fetchIngredients.pending(''));
    expect(state.isLoading).toBe(true);
  });

  it('Проверка fetchIngredients.rejected запроса на сервер', async () => {
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    const store = createTestStore();
    await store.dispatch(fetchIngredients() as any);
    const state = store.getState().burger;

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBe('Error');
  });

  it('Должен обработать fetchIngredients.fulfilled', async () => {
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

  it('Проверка fetchFeeds.pending запроса на серверу', () => {
    const state = burgerSlice(initialState, fetchFeeds.pending(''));
    expect(state.isLoading).toBe(true);
  });

  it('Проверка fetchFeeds.rejected запроса на сервер', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    const store = createTestStore();
    await store.dispatch(fetchFeeds() as any);
    const state = store.getState().burger;

    expect(state.isLoading).toBe(false);
    expect(state.feeds).toEqual([]);
    expect(state.error).toBe('Error');
  });

  it('Проверка fetchFeeds.fulfilled', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValueOnce({ orders: [mockOrder] });
    const store = createTestStore();
    await store.dispatch(fetchFeeds() as any);
    const state = store.getState().burger;
    expect(state.feeds).toEqual([mockOrder]);
    expect(state.isLoading).toBe(false);
  });

  it('Проверка fetchOrders.pending запроса на серверу', () => {
    const state = burgerSlice(initialState, fetchOrders.pending(''));
    expect(state.isLoading).toBe(true);
  });

  it('Проверка fetchOrders.rejected запроса на сервер', async () => {
    (getOrdersApi as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    const store = createTestStore();
    await store.dispatch(fetchOrders() as any);
    const state = store.getState().burger;

    expect(state.isLoading).toBe(false);
    expect(state.orderUser).toEqual([]);
    expect(state.error).toBe('Error');
  });

  it('Проверка fetchOrders.fulfilled', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValueOnce([mockOrder]);
    const store = createTestStore();
    await store.dispatch(fetchOrders() as any);
    const state = store.getState().burger;
    expect(state.orderUser).toEqual([mockOrder]);
    expect(state.isLoading).toBe(false);
  });

  it('Проверка orderBurger.pending запроса на серверу', () => {
    const state = burgerReducer(initialState, orderBurger.pending('', []));
    expect(state.isLoading).toBe(true);
  });

  it('Проверка orderBurger.rejected запроса на сервер', async () => {
    (orderBurgerApi as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    const store = createTestStore();
    await store.dispatch(orderBurger(['1', '2']) as any);
    const state = store.getState().burger;

    expect(state.isLoading).toBe(false);
    expect(state.burgerConstructor.orderModal).toBeNull();
    expect(state.error).toBe('Error');
  });

  it('Проверка orderBurger.fulfilled', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValueOnce({ order: mockOrder });
    const store = createTestStore();
    await store.dispatch(orderBurger(['1', '2']) as any);
    const state = store.getState().burger;
    expect(state.burgerConstructor.orderModal).toEqual(mockOrder);
    expect(state.isLoading).toBe(false);
  });

  it('Проверка getOrder.rejected запроса на сервер', async () => {
    (getOrderByNumberApi as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    const store = createTestStore();
    await store.dispatch(getOrder(1) as any);
    const state = store.getState().burger;

    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toBeNull();
    expect(state.error).toBe('Error');
  });

  it('Проверка getOrder.fulfilled', async () => {
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
  it('Проверка addBun', () => {
    const state = burgerReducer(initialState, addBun(mockBun));
    expect(state.burgerConstructor.bun).toEqual(mockBun);
  });

  it('Проверка addIngredient', () => {
    const state = burgerReducer(initialState, addIngredient(mockIngredient));
    expect(state.burgerConstructor.ingredients).toEqual([
      { ...mockIngredient, id: 'test-uuid' }
    ]);
  });

  it('Проверка removeIngredient', () => {
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

  it('Проверка setOrderModal', () => {
    const state = burgerReducer(initialState, setOrderModal(mockOrder));
    expect(state.burgerConstructor.orderModal).toEqual(mockOrder);
  });

  it('Проверка up', () => {
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

  it('Проверка down', () => {
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

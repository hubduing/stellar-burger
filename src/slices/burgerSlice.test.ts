import {
  addBun,
  addIngredient,
  removeIngredient,
  setOrderModal,
  fetchIngredients,
  fetchFeeds,
  fetchOrders,
  getOrder,
  orderBurger,
  initialState,
  selectBuns,
  selectIngredients,
  selectMains,
  selectSauces,
  selectFeeds,
  selectOrders,
  selectCurrentOrder,
  selectIsLoading,
  selectBurgerConstructor,
  selectOrderModal
} from './burgerSlice';
import { TIngredient, TOrder, TOrdersData } from '../utils/types';
import fetchMock from 'fetch-mock';
import reducer from './burgerSlice';

describe('burgerSlice reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addBun', () => {
    const previousState = initialState;
    const bun: TIngredient = {
      _id: 'bun-id',
      name: 'Bun',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 5,
      image: 'image-url',
      image_large: 'image-large-url',
      image_mobile: 'image-mobile-url'
    };
    expect(reducer(previousState, addBun(bun))).toEqual({
      ...previousState,
      burgerConstructor: {
        ...previousState.burgerConstructor,
        bun: bun
      }
    });
  });

  it('should handle addIngredient', () => {
    const previousState = {
      ...initialState,
      burgerConstructor: {
        ...initialState.burgerConstructor,
        ingredients: []
      }
    };
    const ingredient: TIngredient = {
      _id: 'ingredient-id',
      name: 'Ingredient',
      type: 'main',
      proteins: 20,
      fat: 20,
      carbohydrates: 20,
      calories: 200,
      price: 10,
      image: 'image-url',
      image_large: 'image-large-url',
      image_mobile: 'image-mobile-url'
    };
    const constructorIngredient = {
      ...ingredient,
      id: 'constructor-ingredient-id'
    };
    const newState = reducer(previousState, addIngredient(ingredient));
    expect(newState.burgerConstructor.ingredients).toContainEqual(
      expect.objectContaining({
        _id: 'ingredient-id',
        name: 'Ingredient'
      })
    );
  });

  it('should handle removeIngredient', () => {
    const ingredientId = 'constructor-ingredient-id';
    const testIngredient = {
      _id: 'test-id',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 0,
      image: 'test-image.png',
      image_large: 'test-image-large.png',
      image_mobile: 'test-image-mobile.png'
    };

    const previousState = {
      ...initialState,
      burgerConstructor: {
        ...initialState.burgerConstructor,
        ingredients: [{ id: ingredientId, ...testIngredient }]
      }
    };
    expect(reducer(previousState, removeIngredient(ingredientId))).toEqual({
      ...previousState,
      burgerConstructor: {
        ...previousState.burgerConstructor,
        ingredients: []
      }
    });
  });

  it('should handle setOrderModal', () => {
    const previousState = initialState;
    const order: TOrder = {
      _id: 'order-id',
      status: 'created',
      name: 'Order Name',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
      number: 123,
      ingredients: ['ingredient-id']
    };
    expect(reducer(previousState, setOrderModal(order))).toEqual({
      ...previousState,
      burgerConstructor: {
        ...previousState.burgerConstructor,
        orderModal: order
      }
    });
  });
});

const state = {
  burgerReducer: {
    ingredients: [
      {
        _id: '1',
        type: 'bun',
        name: 'Bun 1',
        price: 100,
        proteins: 10,
        fat: 5,
        carbohydrates: 15,
        calories: 250,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '2',
        type: 'sauce',
        name: 'Sauce 1',
        price: 50,
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 100,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '3',
        type: 'main',
        name: 'Main 1',
        price: 150,
        proteins: 20,
        fat: 10,
        carbohydrates: 20,
        calories: 300,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ],
    buns: [
      {
        _id: '1',
        type: 'bun',
        name: 'Bun 1',
        price: 100,
        proteins: 10,
        fat: 5,
        carbohydrates: 15,
        calories: 250,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ],
    mains: [
      {
        _id: '3',
        type: 'main',
        name: 'Main 1',
        price: 150,
        proteins: 20,
        fat: 10,
        carbohydrates: 20,
        calories: 300,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ],
    sauces: [
      {
        _id: '2',
        type: 'sauce',
        name: 'Sauce 1',
        price: 50,
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 100,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ],
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

describe('burgerSlice selectors', () => {
  it('selectBuns returns only buns from ingredients', () => {
    const selectedBuns = selectBuns(state);
    expect(selectedBuns).toEqual(
      state.burgerReducer.ingredients.filter(
        (ingredient) => ingredient.type === 'bun'
      )
    );
  });

  it('selectMains returns only mains from ingredients', () => {
    const selectedMains = selectMains(state);
    expect(selectedMains).toEqual(
      state.burgerReducer.ingredients.filter(
        (ingredient) => ingredient.type === 'main'
      )
    );
  });

  it('selectSauces returns only sauces from ingredients', () => {
    const selectedSauces = selectSauces(state);
    expect(selectedSauces).toEqual(
      state.burgerReducer.ingredients.filter(
        (ingredient) => ingredient.type === 'sauce'
      )
    );
  });

  it('selectIngredients returns all ingredients', () => {
    const selectedIngredients = selectIngredients(state);
    expect(selectedIngredients).toEqual(state.burgerReducer.ingredients);
  });

  it('selectFeeds returns all feeds', () => {
    const selectedFeeds = selectFeeds(state);
    expect(selectedFeeds).toEqual(state.burgerReducer.feeds);
  });

  it('selectOrders returns all user orders', () => {
    const selectedOrders = selectOrders(state);
    expect(selectedOrders).toEqual(state.burgerReducer.orderUser);
  });

  it('selectCurrentOrder returns the current order', () => {
    const selectedCurrentOrder = selectCurrentOrder(state);
    expect(selectedCurrentOrder).toEqual(state.burgerReducer.currentOrder);
  });

  it('selectIsLoading returns the loading state', () => {
    const selectedIsLoading = selectIsLoading(state);
    expect(selectedIsLoading).toBe(state.burgerReducer.isLoading);
  });

  it('selectBurgerConstructor returns the burger constructor state', () => {
    const selectedBurgerConstructor = selectBurgerConstructor(state);
    expect(selectedBurgerConstructor).toEqual(
      state.burgerReducer.burgerConstructor
    );
  });

  it('selectOrderModal returns the order modal state', () => {
    const selectedOrderModal = selectOrderModal(state);
    expect(selectedOrderModal).toEqual(
      state.burgerReducer.burgerConstructor.orderModal
    );
  });
});

describe('burgerSlice async actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should handle fetchIngredients', async () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        type: 'bun',
        name: 'Bun 1',
        proteins: 10,
        fat: 5,
        carbohydrates: 15,
        calories: 250,
        price: 100,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '2',
        type: 'sauce',
        name: 'Sauce 1',
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 100,
        price: 50,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '3',
        type: 'main',
        name: 'Main 1',
        proteins: 20,
        fat: 10,
        carbohydrates: 20,
        calories: 300,
        price: 150,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    fetchMock.getOnce('/ingredients', {
      body: ingredients,
      headers: { 'content-type': 'application/json' }
    });

    const previousState = initialState;
    const newState = await reducer(
      previousState,
      fetchIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(newState.ingredients).toEqual(ingredients);
    expect(newState.buns).toEqual([ingredients[0]]);
    expect(newState.sauces).toEqual([ingredients[1]]);
    expect(newState.mains).toEqual([ingredients[2]]);
  });

  it('should handle fetchFeeds', async () => {
    // const feeds = { orders: [{ _id: 'order1' }, { _id: 'order2' }] };
    const feeds: TOrdersData = {
      orders: [
        {
          _id: 'order1',
          status: 'created',
          name: 'Order 1',
          createdAt: '2020-01-01T00:00:00.000Z',
          updatedAt: '2020-01-01T00:00:00.000Z',
          number: 123,
          ingredients: ['ingredient-id']
        },
        {
          _id: 'order2',
          status: 'created',
          name: 'Order 2',
          createdAt: '2020-01-01T00:00:00.000Z',
          updatedAt: '2020-01-01T00:00:00.000Z',
          number: 124,
          ingredients: ['ingredient-id']
        }
      ],
      total: 2,
      totalToday: 1
    };

    fetchMock.getOnce('/feeds', {
      body: feeds,
      headers: { 'content-type': 'application/json' }
    });

    const previousState = initialState;
    const newState = await reducer(
      previousState,
      fetchFeeds.fulfilled(feeds, '', undefined)
    );

    expect(newState.feeds).toEqual(feeds.orders);
  });

  it('should handle fetchOrders', async () => {
    const orders: TOrder[] = [
      {
        _id: 'order1',
        status: 'created',
        name: 'Order 1',
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
        number: 123,
        ingredients: ['ingredient-id']
      },
      {
        _id: 'order2',
        status: 'created',
        name: 'Order 2',
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
        number: 124,
        ingredients: ['ingredient-id']
      }
    ];

    fetchMock.getOnce('/orders', {
      body: orders,
      headers: { 'content-type': 'application/json' }
    });

    const previousState = initialState;
    const newState = await reducer(
      previousState,
      fetchOrders.fulfilled(orders, '', undefined)
    );

    expect(newState.orderUser).toEqual(orders);
  });

  it('should handle getOrder', async () => {
    const order: TOrdersData = {
      orders: [
        {
          _id: 'order1',
          status: 'created',
          name: 'Order 1',
          createdAt: '2020-01-01T00:00:00.000Z',
          updatedAt: '2020-01-01T00:00:00.000Z',
          number: 123,
          ingredients: ['ingredient-id']
        }
      ],
      total: 1,
      totalToday: 1
    };

    fetchMock.getOnce('/order/1', {
      body: order,
      headers: { 'content-type': 'application/json' }
    });

    const previousState = initialState;
    const newState = await reducer(
      previousState,
      getOrder.fulfilled(order, '', '1')
    );

    expect(newState.currentOrder).toEqual(order.orders[0]);
  });

  it('should handle orderBurger', async () => {
    const newOrderResponse: TOrdersData = {
      orders: [
        {
          _id: 'order1',
          status: 'created',
          name: 'Order 1',
          createdAt: '2020-01-01T00:00:00.000Z',
          updatedAt: '2020-01-01T00:00:00.000Z',
          number: 123,
          ingredients: ['ingredient-id']
        }
      ],
      total: 1,
      totalToday: 1
    };

    fetchMock.postOnce('/order', {
      body: newOrderResponse,
      headers: { 'content-type': 'application/json' }
    });

    const previousState = initialState;
    const newState = await reducer(
      previousState,
      orderBurger.fulfilled(newOrderResponse, '', undefined)
    );

    expect(newState.burgerConstructor.orderModal).toEqual(
      newOrderResponse.order
    );
  });
});

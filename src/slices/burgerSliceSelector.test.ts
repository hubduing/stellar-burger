import {
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
import { BurgerState } from './burgerSlice';

const mockState: { burgerReducer: BurgerState } = {
  burgerReducer: {
    ingredients: [],
    buns: [],
    mains: [],
    sauces: [],
    feeds: [],
    orderUser: [],
    isLoading: true,
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
  test('должен вернуть булочки', () => {
    const buns = selectBuns(mockState);
    expect(buns).toEqual(mockState.burgerReducer.buns);
  });

  test('должен вернуть ингредиенты', () => {
    const ingredients = selectIngredients(mockState);
    expect(ingredients).toEqual(mockState.burgerReducer.ingredients);
  });

  test('должен вернуть основные ингредиенты', () => {
    const mains = selectMains(mockState);
    expect(mains).toEqual(mockState.burgerReducer.mains);
  });

  test('должен вернуть соусы', () => {
    const sauces = selectSauces(mockState);
    expect(sauces).toEqual(mockState.burgerReducer.sauces);
  });

  test('должен вернуть фиды', () => {
    const feeds = selectFeeds(mockState);
    expect(feeds).toEqual(mockState.burgerReducer.feeds);
  });

  test('должен вернуть заказы пользователя', () => {
    const orders = selectOrders(mockState);
    expect(orders).toEqual(mockState.burgerReducer.orderUser);
  });

  test('должен вернуть текущий заказ', () => {
    const currentOrder = selectCurrentOrder(mockState);
    expect(currentOrder).toEqual(mockState.burgerReducer.currentOrder);
  });

  test('должен вернуть статус загрузки', () => {
    const isLoading = selectIsLoading(mockState);
    expect(isLoading).toEqual(mockState.burgerReducer.isLoading);
  });

  test('должен вернуть конструктор бургера', () => {
    const burgerConstructor = selectBurgerConstructor(mockState);
    expect(burgerConstructor).toEqual(
      mockState.burgerReducer.burgerConstructor
    );
  });

  test('должен вернуть модальное окно заказа', () => {
    const orderModal = selectOrderModal(mockState);
    expect(orderModal).toEqual(
      mockState.burgerReducer.burgerConstructor.orderModal
    );
  });
});

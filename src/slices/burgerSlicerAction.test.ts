import burgerReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  setOrderModal,
  down,
  up,
  initialState
} from './burgerSlice';
import { TIngredient, TConstructorIngredient, TOrder } from '../utils/types';

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

describe('burgerReducer', () => {
  test('должен вернуть начальное состояние', () => {
    const state = burgerReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  test('должен обработать addBun', () => {
    const state = burgerReducer(initialState, addBun(mockBun));
    expect(state.burgerConstructor.bun).toEqual(mockBun);
  });

  test('должен обработать addIngredient', () => {
    const state = burgerReducer(initialState, addIngredient(mockIngredient));
    expect(state.burgerConstructor.ingredients).toEqual([
      { ...mockIngredient, id: expect.any(String) }
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

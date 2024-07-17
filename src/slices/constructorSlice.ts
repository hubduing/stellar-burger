import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../utils/types';
import { v4 as randomId } from 'uuid';

interface IBurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderModal: TOrder | null;
}

export const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderModal: null
};

const findIndexById = (array: { id: string }[], id: string) =>
  array.findIndex((el) => el.id === id);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // выбрать булочку
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    // добавить ингредиент
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') state.bun = action.payload;
        else state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: randomId() }
      })
    },
    // удалить ингредиент
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    up: (state, action: PayloadAction<string>) => {
      const index = findIndexById(state.ingredients, action.payload);
      // console.log('UP', state.ingredients[index]);
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },
    down: (state, action: PayloadAction<string>) => {
      const index = findIndexById(state.ingredients, action.payload);
      // console.log('DOWN', state.burgerConstructor.ingredients[index]);
      if (index !== -1 && index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    //  данные для модального окна
    setOrderModal: (state, action: PayloadAction<TOrder | null>) => {
      if (!action.payload) {
        state.bun = null;
        state.ingredients = [];
      }
      state.orderModal = action.payload;
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients
  }
});

export const {
  addBun,
  up,
  addIngredient,
  down,
  removeIngredient,
  setOrderModal
} = burgerConstructorSlice.actions;

export const { selectIngredients } = burgerConstructorSlice.selectors;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

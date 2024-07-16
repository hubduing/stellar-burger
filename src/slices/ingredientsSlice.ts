// import {
//   createAsyncThunk,
//   createSlice,
//   PayloadAction,
//   SerializedError
// } from '@reduxjs/toolkit';
// import { TIngredient } from '../utils/types';
// import { getIngredientsApi } from '@api';
// import { v4 as uuidv4 } from 'uuid';

// interface IngredientsState {
//   ingredients: TIngredient[];
//   buns: TIngredient[];
//   mains: TIngredient[];
//   sauces: TIngredient[];
//   isLoading: boolean;
//   error: SerializedError | null;
// }

// const initialState: IngredientsState = {
//   ingredients: [],
//   buns: [],
//   mains: [],
//   sauces: [],
//   isLoading: false,
//   error: null
// };

// export const fetchIngredients = createAsyncThunk(
//   'ingredients/fetchIngredients',
//   async () => {
//     const response = await getIngredientsApi();
//     // Предполагается, что getIngredientsApi возвращает Promise<TIngredient[]>
//     return response;
//   }
// );

// const ingredientsSlice = createSlice({
//   name: 'ingredients',
//   initialState,
//   reducers: {
//     // Редьюсеры для работы с ингредиентами
//     addIngredient: {
//       reducer: (
//         state,
//         action: PayloadAction<{ ingredient: TIngredient; tempId: string }>
//       ) => {
//         state.ingredients.push({
//           ...action.payload.ingredient,
//           id: action.payload.tempId
//         });
//       },
//       prepare: (ingredient: TIngredient) => ({
//         payload: { ingredient, tempId: uuidv4() }
//       })
//     },
//     removeIngredient: (state, action: PayloadAction<string>) => {
//       state.ingredients = state.ingredients.filter(
//         (ingredient) => ingredient.id !== action.payload
//       );
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchIngredients.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchIngredients.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error; // Убедитесь, что error имеет тип SerializedError
//       })
//       .addCase(
//         fetchIngredients.fulfilled,
//         (state, action: PayloadAction<TIngredient[]>) => {
//           state.isLoading = false;
//           state.ingredients = action.payload;
//           state.buns = action.payload.filter(
//             (ingredient) => ingredient.type === 'bun'
//           );
//           state.mains = action.payload.filter(
//             (ingredient) => ingredient.type === 'main'
//           );
//           state.sauces = action.payload.filter(
//             (ingredient) => ingredient.type === 'sauce'
//           );
//         }
//       );
//   }
// });

// export const { addIngredient, removeIngredient } = ingredientsSlice.actions;
// export default ingredientsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { getProducts, getProductsDetail } from './thunk';

type ProductState = {
  [k: string]: any;
};
const initProducts: ProductState = {};

const products = createSlice({
  name: 'products',
  initialState: initProducts,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => ({
        ...state,
        ...action.payload.entities.products,
      }))
      .addCase(getProductsDetail.fulfilled, (state, action) => {
        state[action.payload.prefix] = action.payload;
      });
  },
});

type Paginaion = {
  maxPage: number;
  productCount: number;
};
const initPagination: Paginaion = {
  maxPage: 0,
  productCount: 0,
};

const paginaion = createSlice({
  name: 'paginaion',
  initialState: initPagination,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProducts.fulfilled, (state, action) => ({
      maxPage: action.payload.result.maxPage,
      productCount: action.payload.result.productCount,
    }));
  },
});

type PrefixState = string[];
const initIds: PrefixState = [];

const productIds = createSlice({
  name: 'productIds',
  initialState: initIds,
  reducers: {
    resetProductIds: () => [],
  },
  extraReducers: builder => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      action.payload.result.products.forEach((prefix: string) => {
        if (!state.includes(prefix)) {
          state.push(prefix);
        }
      });
    });
  },
});

const cart = createSlice({
  name: 'cart',
  initialState: initIds,
  reducers: {
    addToCart: (state, action) => {
      state.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.splice(action.payload, 1);
    },
  },
});

export const { resetProductIds } = productIds.actions;
export const { addToCart, removeFromCart } = cart.actions;

export const rootReducer = combineReducers({
  products: products.reducer,
  pagination: paginaion.reducer,
  productIds: productIds.reducer,
  cart: cart.reducer,
});

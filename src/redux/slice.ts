import { createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { getProducts } from './thunk';

type ProductState = {
  [k: string]: any;
};
const initProducts: ProductState = {};

const products = createSlice({
  name: 'products',
  initialState: initProducts,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProducts.fulfilled, (state, action) => ({
      ...state,
      ...action.payload.entities.products,
    }));
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

type ProductIdsState = string[];
const initProductIds: ProductIdsState = [];

const productIds = createSlice({
  name: 'productIds',
  initialState: initProductIds,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      action.payload.result.products.forEach((prefix: string) =>
        state.push(prefix)
      );
    });
  },
});

export const rootReducer = combineReducers({
  products: products.reducer,
  pagination: paginaion.reducer,
  productIds: productIds.reducer,
});

import { createAsyncThunk } from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { normalize } from 'normalizr';

import { productEntity } from './schemas';

const baseUrl = Config.API_URL;

export const getProducts = createAsyncThunk(
  'products/all',
  async (arg: { page: number; order: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseUrl}/products/all/${arg.page}?order=${arg.order}`
      );
      const productsData = await res.json();

      const productsSchema = { products: [productEntity] };
      const products = normalize(productsData, productsSchema);

      if (!productsData.products) {
        throw 'getProducts: error';
      }

      return { ...products };
    } catch (error) {
      return rejectWithValue({});
    }
  }
);

export const getProductsDetail = createAsyncThunk(
  'products/detail',
  async (prefix: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/products/${prefix}`);
      const detailData = await res.json();

      if (!detailData.prefix) {
        throw 'getProductsDetail: error';
      }

      return { ...detailData };
    } catch {
      return rejectWithValue({});
    }
  }
);

export const purchaseProduct = createAsyncThunk(
  'products/purchase',
  async (prefix: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/products/${prefix}`, {
        method: 'POST',
      });
      const result = await res.json();

      if (!result.success) {
        throw 'purchaseProduct: error';
      }

      return prefix;
    } catch {
      return rejectWithValue({});
    }
  }
);

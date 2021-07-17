import { createAsyncThunk } from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { normalize } from 'normalizr';

import { productEntity } from './schemas';

const baseUrl = Config.API_URL;

export const getProducts = createAsyncThunk(
  'products/all',
  async (page: number, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseUrl}/products/all/${page}?order=date-desc`
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

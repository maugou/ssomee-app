import { createAsyncThunk } from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { normalize } from 'normalizr';

import { productEntity } from './schemas';

const baseUrl = Config.API_URL;

export const getProducts = createAsyncThunk(
  'products/all',
  async (page: number) => {
    const res = await fetch(`${baseUrl}/products/all/${page}?order=date-desc`);
    const productsData = await res.json();

    const productsSchema = { products: [productEntity] };
    const products = normalize(productsData, productsSchema);

    return { ...products };
  }
);

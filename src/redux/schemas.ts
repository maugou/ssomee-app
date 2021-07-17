import { schema } from 'normalizr';

export const productEntity = new schema.Entity(
  'products',
  {},
  {
    idAttribute: 'prefix',
  }
);

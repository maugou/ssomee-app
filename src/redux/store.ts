import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import { rootReducer } from './slice';

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;

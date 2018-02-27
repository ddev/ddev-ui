import { createAction, createReducer } from 'redux-act';

const initialState = {
  text: 'DDEV Router Status Unknown',
};

export const updateStatus = createAction('update status');

export default createReducer({
  [updateStatus]: (state, text) => ({
    text,
  }),
}, initialState);

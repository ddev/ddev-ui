import { createAction, createReducer } from 'redux-act';

const initialState = {
  text: 'DDEV Router Status Unknown',
  shown: true,
};

export const updateStatus = createAction('update status');
export const showStatus = createAction('show status');

export default createReducer({
  [updateStatus]: (state, text) => (
    Object.assign({}, state, { text })
  ),

  [showStatus]: (state, shown) => (
    Object.assign({}, state, { shown })
  ),
}, initialState);

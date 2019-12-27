/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { LOADING, UPDATE_LOGIN, UPDATE_TOKEN } from './constants';

// The initial state of the App
export const initialState = {
  loginInfo: {},
  loading: false,
  tokenInfo: {},
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOADING:
        // Delete prefixed '@' from the github username
        draft.loading = action.loading;
        break;
      case UPDATE_LOGIN:
        // Delete prefixed '@' from the github username
        draft.loginInfo = action.loginInfo;
        break;
      case UPDATE_TOKEN:
        // Delete prefixed '@' from the github username
        draft.tokenInfo = action.tokenInfo;
        break;
    }
  });

export default loginReducer;

/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { UPDATE_LOGIN, LOADING } from './constants';

// The initial state of the App
export const initialState = {
  loginInfo: {},
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_LOGIN:
        // Delete prefixed '@' from the github username
        draft.loginInfo = action.loginInfo;
        break;
      case LOADING:
        // Delete prefixed '@' from the github username
        draft.loading = action.loading;
        break;
    }
  });

export default loginReducer;

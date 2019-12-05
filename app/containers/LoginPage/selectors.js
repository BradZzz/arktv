/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectLogin = state => state.login || initialState;

const makeSelectLoginInfo = () =>
  createSelector(
    selectLogin,
    loginState => loginState.loginInfo,
  );

const makeSelectLoadingInfo = () =>
  createSelector(
    selectLogin,
    loginState => loginState.loading,
  );

export { selectLogin, makeSelectLoginInfo, makeSelectLoadingInfo };

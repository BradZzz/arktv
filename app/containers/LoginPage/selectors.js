/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectLogin = state => state.login || initialState;

const makeSelectLoadingInfo = () =>
  createSelector(
    selectLogin,
    loginState => loginState.loading,
  );

const makeSelectLoginInfo = () =>
  createSelector(
    selectLogin,
    loginState => loginState.loginInfo,
  );

const makeSelectTokenInfo = () =>
  createSelector(
    selectLogin,
    loginState => loginState.tokenInfo,
  );

export {
  selectLogin,
  makeSelectLoadingInfo,
  makeSelectLoginInfo,
  makeSelectTokenInfo,
};

import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the language domain
 */

const selectMedia = state => state.media || initialState;

/**
 * Select the language locale
 */

const makeSelectMedia = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.media,
  );

export { selectMedia, makeSelectMedia };

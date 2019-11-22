import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the language domain
 */

const selectMedia = state => state.media || initialState;

/**
 * Select the language locale
 */

const makeSelectPlayerAvailable = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.playerAvailable,
  );


const makeSelectMedia = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.media,
  );

const makeSelectCurrentMedia = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.currentMedia,
  );

const makeSelectSignedUrl = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.signedURL,
  );

const makeSelectLoading = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.loading,
  );


export { selectMedia, makeSelectMedia, makeSelectCurrentMedia, makeSelectSignedUrl, makeSelectLoading, makeSelectPlayerAvailable };

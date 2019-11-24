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

const makeSelectPlayer = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.player,
  );

const makeSelectMedia = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.media,
  );

const makeSelectChannels = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.channels,
  );

const makeSelectCurrentMedia = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.currentMedia,
  );

const makeSelectCurrentChannel = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.currentChannel,
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


export { selectMedia, makeSelectMedia, makeSelectCurrentMedia, makeSelectChannels, makeSelectCurrentChannel, makeSelectSignedUrl, makeSelectLoading, makeSelectPlayerAvailable, makeSelectPlayer };

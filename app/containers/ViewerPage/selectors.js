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

const makeSelectLoadingSigned = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.loadingSigned,
  );

const makeSelectLoadingMedia = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.loadingMedia,
  );

const makeSelectEpisode = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.episode,
  );

const makeSelectOptionsPin = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.options.pin,
  );


const makeSelectOptionsStar = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.options.star,
  );

const makeSelectOptionsOrder = () =>
  createSelector(
    selectMedia,
    mediaState => mediaState.options.order,
  );

export { makeSelectOptionsPin, makeSelectOptionsStar, makeSelectOptionsOrder, makeSelectEpisode, selectMedia, makeSelectMedia, makeSelectCurrentMedia, makeSelectChannels, makeSelectCurrentChannel, makeSelectSignedUrl, makeSelectLoadingSigned, makeSelectLoadingMedia, makeSelectPlayerAvailable, makeSelectPlayer };

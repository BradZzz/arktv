/*
 *
 * LanguageProvider reducer
 *
 */

import produce from 'immer';

import {
  SET_MEDIA_PIN,
  SET_MEDIA_STAR,
  SET_MEDIA_ORDER,
  PLAYER_AVAILABLE,
  PLAYER_SET,
  UPDATE_MEDIA,
  UPDATE_CHANNELS,
  SET_SELECTED_MEDIA,
  SET_SELECTED_CHANNEL,
  SET_MEDIA_SIGNED_URL,
  LOADING_SIGNED_URL,
  LOADING_MEDIA,
  SET_CURRENT_EPISODE,
  FLUSH_MEDIA,
} from './constants';

export const initialState = {
  media: [],
  channels: [],
  currentMedia: {
    Title: '',
    Plot: '',
    Poster: '',
  },
  currentChannel: {},
  player: {},
  options: {
    star: false,
    pin: false,
    order: false,
  },
  signedURL: '',
  currentEpisode: '',
  loadingSigned: false,
  loadingMedia: false,
};

/* eslint-disable default-case, no-param-reassign */
const MediaReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case PLAYER_AVAILABLE:
        draft.playerAvailable = action.playerAvailable;
        break;
      case PLAYER_SET:
        draft.player = action.player;
        draft.playerAvailable = true;
        break;
      case UPDATE_MEDIA:
        draft.media = action.media;
        break;
      case UPDATE_CHANNELS:
        draft.channels = action.channels;
        break;
      case SET_SELECTED_MEDIA:
        draft.currentMedia = action.currentMedia;
        break;
      case SET_SELECTED_CHANNEL:
        draft.currentChannel = action.currentChannel;
        break;
      case SET_MEDIA_SIGNED_URL:
        draft.signedURL = action.signedURL;
        break;
      case LOADING_SIGNED_URL:
        draft.loadingSigned = action.loadingSigned;
        break;
      case LOADING_MEDIA:
        draft.loadingMedia = action.loadingMedia;
        break;
      case SET_CURRENT_EPISODE:
        draft.episode = action.episode;
        break;
      case SET_MEDIA_PIN:
        draft.options.pin = action.pin;
        break;
      case SET_MEDIA_STAR:
        draft.options.star = action.star;
        break;
      case SET_MEDIA_ORDER:
        draft.options.order = action.order;
        break;
      case FLUSH_MEDIA:
        draft.media = [];
        break;
    }
  });

export default MediaReducer;

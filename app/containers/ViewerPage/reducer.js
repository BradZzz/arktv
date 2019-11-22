/*
 *
 * LanguageProvider reducer
 *
 */

import produce from 'immer';

import { PLAYER_AVAILABLE, PLAYER_SET, UPDATE_MEDIA, SET_SELECTED_MEDIA, SET_MEDIA_SIGNED_URL, LOADING_SIGNED_URL } from './constants';

export const initialState = {
  media: [],
  currentMedia: {
    Title: "Malcolm in the middle",
    Plot: "Description",
    Poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BODQ0NTE3Mjg3N15BMl5BanBnXkFtZTcwNDY2MDMwNw@@._V1_SX300.jpg"
  },
  player: {},
  signedURL: 'https://storage.googleapis.com/misc_meta/index.mp4',
  loading: false,
  playerAvailable: false,
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
        break;
      case UPDATE_MEDIA:
        draft.media = action.media;
        break;
      case SET_SELECTED_MEDIA:
        draft.currentMedia = action.currentMedia;
        break;
      case SET_MEDIA_SIGNED_URL:
        draft.signedURL = action.signedURL;
        break;
      case LOADING_SIGNED_URL:
        draft.loading = action.loading;
        break;
      case LOADING_SIGNED_URL:
        draft.loading = action.loading;
        break;
    }
  });

export default MediaReducer;

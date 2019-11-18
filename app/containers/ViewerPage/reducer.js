/*
 *
 * LanguageProvider reducer
 *
 */

import produce from 'immer';

import { UPDATE_MEDIA } from './constants';

export const initialState = {
  media: [],
};

/* eslint-disable default-case, no-param-reassign */
const MediaReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_MEDIA:
        draft.media = action.media;
        break;
    }
  });

export default MediaReducer;

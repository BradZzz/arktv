/*
 *
 * LanguageProvider actions
 *
 */

import { CHECK_MEDIA, UPDATE_MEDIA } from './constants';

export function checkMedia() {
  return {
    type: CHECK_MEDIA,
  };
}

export function updateMedia(media) {
  return {
    type: UPDATE_MEDIA,
    media,
  };
}

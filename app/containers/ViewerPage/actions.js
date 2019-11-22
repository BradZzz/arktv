/*
 *
 * LanguageProvider actions
 *
 */

import { PLAYER_AVAILABLE, PLAYER_SET, CHECK_MEDIA, UPDATE_MEDIA, SET_SELECTED_MEDIA, SET_MEDIA_SIGNED_URL, LOADING_SIGNED_URL } from './constants';

export function setMediaPlayerAvailable(playerAvailable) {
  return {
    type: PLAYER_AVAILABLE,
    playerAvailable
  };
}

export function setMediaPlayerObject(player) {
  return {
    type: PLAYER_SET,
    player
  };
}

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

export function setMedia(currentMedia) {
  return {
    type: SET_SELECTED_MEDIA,
    currentMedia
  };
}

export function setMediaSignedUrl(signedURL) {
  return {
    type: SET_MEDIA_SIGNED_URL,
    signedURL
  };
}

export function loadSignedUrl(loading) {
  return {
    type: LOADING_SIGNED_URL,
    loading
  };
}

/*
 *
 * LanguageProvider actions
 *
 */

import {
  SET_SHOW,
  SET_SKIP_REWIND,
  SET_SKIP_FORWARD,
  CHECK_NEXT_MEDIA,
  SET_MEDIA_PIN,
  SET_MEDIA_STAR,
  SET_MEDIA_ORDER,
  PLAYER_AVAILABLE,
  PLAYER_SET,
  CHECK_MEDIA,
  UPDATE_MEDIA,
  UPDATE_CHANNELS,
  SET_SELECTED_MEDIA,
  SET_SELECTED_CHANNEL,
  SET_MEDIA_SIGNED_URL,
  LOADING_SIGNED_URL,
  LOADING_MEDIA,
  SET_CURRENT_EPISODE,
  SYNC_UPDATE,
  FLUSH_MEDIA,
} from './constants';

export function setMediaPlayerAvailable(playerAvailable) {
  return {
    type: PLAYER_AVAILABLE,
    playerAvailable,
  };
}

export function setMediaPlayerObject(player) {
  return {
    type: PLAYER_SET,
    player,
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

export function updateChannels(channels) {
  return {
    type: UPDATE_CHANNELS,
    channels,
  };
}

export function checkNextMedia() {
  return {
    type: CHECK_NEXT_MEDIA,
  };
}

export function setMedia(currentMedia) {
  return {
    type: SET_SELECTED_MEDIA,
    currentMedia,
  };
}

export function setChannel(currentChannel) {
  return {
    type: SET_SELECTED_CHANNEL,
    currentChannel,
  };
}

export function setMediaSignedUrl(signedURL) {
  return {
    type: SET_MEDIA_SIGNED_URL,
    signedURL,
  };
}

export function setLoadSignedUrl(loadingSigned) {
  return {
    type: LOADING_SIGNED_URL,
    loadingSigned,
  };
}

export function setLoadingMedia(loadingMedia) {
  return {
    type: LOADING_MEDIA,
    loadingMedia,
  };
}

export function setCurrentEpisode(episode) {
  return {
    type: SET_CURRENT_EPISODE,
    episode,
  };
}

export function setMediaPin(pin) {
  return {
    type: SET_MEDIA_PIN,
    pin,
  };
}

export function setMediaStar(star) {
  return {
    type: SET_MEDIA_STAR,
    star,
  };
}

export function setMediaOrder(order) {
  return {
    type: SET_MEDIA_ORDER,
    order,
  };
}

export function setSkipRewind() {
  return {
    type: SET_SKIP_REWIND,
  };
}

export function setSkipForward() {
  return {
    type: SET_SKIP_FORWARD,
  };
}

export function setShow(media) {
  return {
    type: SET_SHOW,
    media,
  };
}

export function syncUpdate() {
  return {
    type: SYNC_UPDATE,
  };
}

export function flushMedia() {
  return {
    type: FLUSH_MEDIA,
  };
}


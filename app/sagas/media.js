/* eslint no-console: ["error", { allow: ["info","warn", "error"] }] */

import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  setMedia,
  updateMedia,
  setMediaSignedUrl,
  updateChannels,
  setChannel,
  setCurrentEpisode,
  setLoadingMedia,
  checkMedia,
  flushMedia,
} from '../containers/ViewerPage/actions';
import {
  CHECK_MEDIA,
  CHECK_NEXT_MEDIA,
  SET_SKIP_FORWARD,
  SET_SKIP_REWIND,
  SET_SHOW,
  SET_SELECTED_CHANNEL,
  SYNC_UPDATE,
} from '../containers/ViewerPage/constants';
import {
  makeSelectMedia,
  makeSelectChannels,
  makeSelectCurrentMedia,
  makeSelectEpisode,
  makeSelectOptionsOrder,
  makeSelectOptionsStar,
  makeSelectOptionsPin,
  makeSelectCurrentChannel,
  makeSelectLoadingMedia,
  makeSelectSignedUrl
} from '../containers/ViewerPage/selectors';
import { makeSelectTokenInfo } from '../containers/LoginPage/selectors';

import { createChannels } from '../utils/mediaUtils';

import mediaApi from '../utils/mediaApi';
import _ from 'underscore';

// Utils
function* createHeader() {
  const idToken = yield select(makeSelectTokenInfo());
  const options = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  };
  return options;
}

export function* requestMedia() {
  try {
    const options = yield call(createHeader);
    //    const channels = yield call(makeSelectChannels());
    //    const reqSuf = `get_media`;
    //    const resp = yield call(mediaApi.get, reqSuf, options);
    const currentMedia = yield select(makeSelectMedia());
    const channels = yield select(makeSelectChannels());
    if (currentMedia.length === 0) {
      const reqSuf = `get_media`;
      const resp = yield call(mediaApi.get, reqSuf, options);
      console.log("requestMedia", resp.data)
      const media = _.map(resp.data,function(m) {
        return {
          Title: m.Title, Actors: m.Actors, Awards: m.Awards, Genre: m.Genre, Writer: m.Writer, Director: m.Director, Ratings: m.Ratings, Plot: m.Plot,
          Poster: m.Poster, Released: m.Released, Runtime: m.Runtime, created: m.created, episodes: m.episodes, imdbID: m.imdbID,
          imdbRating: m.imdbRating, imdbVotes: m.imdbVotes }
      })
      yield put(updateMedia(media));
      yield put(updateChannels(createChannels(media)));
    } else if (channels.length === 0 && currentMedia.length > 0) {
      yield put(updateChannels(createChannels(currentMedia)));
    }
  } catch (err) {
    console.error('err requestMedia', err);
  }
}

export function* requestUpdate() {
  try {
    const options = yield call(createHeader);
    const reqSuf = `update_all?load=soft`;
    yield call(mediaApi.get, reqSuf, options);
  } catch (err) {
    console.error('err', err);
  }
}

export function* requestSignedURl(nxtEpisode) {
  try {
    const options = yield call(createHeader);
    yield put(setCurrentEpisode(nxtEpisode));
    const reqSuf = `signed_url?path=${nxtEpisode}`;
    const resp = yield call(mediaApi.get, reqSuf, options);
    yield put(setMediaSignedUrl(resp.data));
    if (!window.location.href.includes('/viewer')) {
      window.location.href = '/viewer';
    }
  } catch (err) {
    console.error('err', err);
  }
}

export function* processMediaRequest(fastForward, currentMedia) {
   console.log("processMediaRequest: ",fastForward, currentMedia)
   console.log("currentMedia.episodes.length: ", currentMedia.episodes.length)

  const loadingMedia = yield select(makeSelectLoadingMedia());
  if (loadingMedia) return;

  yield put(setLoadingMedia(true));
  const order = yield select(makeSelectOptionsOrder());
  const star = yield select(makeSelectOptionsStar());

  const episode = yield select(makeSelectEpisode());

  let nxtEpisode =
    currentMedia.episodes[
      Math.floor(Math.random() * currentMedia.episodes.length)
    ];

  if (star) {
    nxtEpisode = currentMedia.episodes[currentMedia.episodes.length - 1];
  } else if (order) {
    let idx = currentMedia.episodes.indexOf(episode);
    if (idx > -1) {
      if (fastForward) {
        idx += 1;
      } else {
        idx -= 1;
      }
      if (idx > currentMedia.episodes.length - 1) {
        idx = 0;
      } else if (idx < 0) {
        idx = currentMedia.episodes.length - 1;
      }
      nxtEpisode = currentMedia.episodes[idx];
    }
  }

  console.log('processMediaRequest nxtEpisode', nxtEpisode);

  yield requestSignedURl(nxtEpisode);
}

export function* setNextShow(action) {
//  console.log("setNextShow: ", action)
  yield put(setMedia(action.media));
  /* Set the channel here */
  let channels = yield select(makeSelectChannels());
  const tv = _.find(channels,function(channel){ return channel.name.toLowerCase() === 'tv' })
  const movie = _.find(channels,function(channel){ return channel.name.toLowerCase() === 'movie' })
  if (action.media.episodes.length > 1) {
    yield put(setChannel(tv));
  } else {
    yield put(setChannel(movie));
  }
//  yield put(setMedia(action.media));
  yield processMediaRequest(true, action.media);
}

export function* rollMedia() {
  let currentMedia = yield select(makeSelectCurrentMedia());
  const pin = yield select(makeSelectOptionsPin());
  //
  //  console.log('rollMedia', pin, currentMedia);

  const channel = yield select(makeSelectCurrentChannel());

  if (!pin) {
    let chosenMedia =
      channel.media[Math.floor(Math.random() * channel.media.length)];
    while (chosenMedia === currentMedia) {
      chosenMedia =
        channel.media[Math.floor(Math.random() * channel.media.length)];
    }
    currentMedia = chosenMedia;
    yield put(setMedia(currentMedia));
  }

  //  console.log('rollMedia 2', currentMedia);

  return currentMedia;
}

export function* rewindMedia() {
  // Refresh the loading flag
  yield put(setLoadingMedia(false));
  yield processMediaRequest(false, yield rollMedia());
}

export function* findNextMedia() {
  // Refresh the loading flag
  yield put(setLoadingMedia(false));
  yield processMediaRequest(true, yield rollMedia());
}

export function* updateArkMedia() {
  // Update the media if something has just been added to storage
  yield put(setLoadingMedia(false));
  yield call(requestUpdate);
  yield call(flushMedia);
  yield call(checkMedia);
}

export default function* mediaSagas() {
  //  console.log('mediaSagas');
  yield takeLatest(CHECK_MEDIA, requestMedia);
  yield takeLatest(CHECK_NEXT_MEDIA, findNextMedia);
  yield takeLatest(SET_SKIP_REWIND, rewindMedia);
  yield takeLatest(SET_SKIP_FORWARD, findNextMedia);
  yield takeLatest(SET_SHOW, setNextShow);
  yield takeLatest(SET_SELECTED_CHANNEL, findNextMedia);
  yield takeLatest(SYNC_UPDATE, updateArkMedia);
}

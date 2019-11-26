import { push } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { setMedia, updateMedia, setMediaSignedUrl, updateChannels, setChannel, setCurrentEpisode } from '../containers/ViewerPage/actions';
import { CHECK_MEDIA, CHECK_NEXT_MEDIA, SET_SKIP_FORWARD, SET_SKIP_REWIND, SET_SHOW } from '../containers/ViewerPage/constants';
import { makeSelectMedia, makeSelectCurrentMedia, makeSelectChannels, makeSelectEpisode, makeSelectOptionsOrder, makeSelectOptionsStar, makeSelectOptionsPin, makeSelectCurrentChannel } from '../containers/ViewerPage/selectors';

import createChannels from '../utils/mediaUtils';

import mediaApi from '../utils/mediaApi';

export function* requestMedia() {
  try {
    console.log("requestMedia")
    const reqSuf = `get_media`

    const resp = yield call(mediaApi.get, reqSuf);
    console.log("resp", resp)
    const currentMedia = yield select(makeSelectMedia());
    if (currentMedia.length === 0) {
      yield put(updateMedia(resp.data));
      const channels = createChannels(resp.data)
      console.log("createdChannels", channels)
      yield put(updateChannels(channels))
      console.log("setChannel", channels[0])
      yield put(setChannel(channels[0]))
    }
  } catch (err) {
    console.log('err', err);
  }
}

export function* requestSignedURl(nxtEpisode) {
  try {
    yield put(setCurrentEpisode(nxtEpisode));
    const reqSuf = `signed_url?path=${nxtEpisode}`
    const resp = yield call(mediaApi.get, reqSuf);
    yield put(setMediaSignedUrl(resp.data));
  } catch (err) {
    console.log('err', err);
  }
}

export function* processMediaRequest(fastForward, currentMedia) {
  const order = yield select(makeSelectOptionsOrder());
  const star = yield select(makeSelectOptionsStar());

  const episode = yield select(makeSelectEpisode());

  console.log("processMediaRequest", order, star, episode)

  let nxtEpisode = currentMedia.episodes[Math.floor(Math.random() * currentMedia.episodes.length)];

  if (star) {
    nxtEpisode = currentMedia.episodes[currentMedia.episodes.length - 1]
  } else if (order) {
    let idx = currentMedia.episodes.indexOf(episode)
    if (idx > -1) {
      if (fastForward) {
        idx += 1
      } else {
        idx -= 1
      }
      if (idx > currentMedia.episodes.length - 1) {
        idx = 0
      } else if (idx < 0) {
        idx = currentMedia.episodes.length - 1
      }
      nxtEpisode = currentMedia.episodes[idx]
    }
  }

  yield requestSignedURl(nxtEpisode)
}

export function* setNextShow(action) {
  yield put(setMedia(action.media))
  yield processMediaRequest(true, action.media)
}

export function* rollMedia() {
  let currentMedia = yield select(makeSelectCurrentMedia());
  const pin = yield select(makeSelectOptionsPin());

  console.log("rollMedia", pin, currentMedia)

  const channel = yield select(makeSelectCurrentChannel());

  if (!pin) {
    currentMedia = channel.media[Math.floor(Math.random() * channel.media.length)];
    yield put(setMedia(currentMedia));
  }

  console.log("rollMedia 2", currentMedia)

  return currentMedia
}

export function* rewindMedia() {
  yield processMediaRequest(false, yield rollMedia())
}

export function* findNextMedia() {
  yield processMediaRequest(true, yield rollMedia())
}

export default function* mediaSagas() {
  console.log("mediaSagas")
  yield takeLatest(CHECK_MEDIA, requestMedia);
  yield takeLatest(CHECK_NEXT_MEDIA, findNextMedia);
  yield takeLatest(SET_SKIP_REWIND, rewindMedia);
  yield takeLatest(SET_SKIP_FORWARD, findNextMedia);
  yield takeLatest(SET_SHOW, setNextShow);
}

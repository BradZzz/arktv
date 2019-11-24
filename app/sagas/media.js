import { push } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { updateMedia, setMediaSignedUrl, updateChannels, setChannel } from '../containers/ViewerPage/actions';
import { CHECK_MEDIA, SET_SELECTED_MEDIA } from '../containers/ViewerPage/constants';
import { makeSelectMedia, makeSelectCurrentMedia, makeSelectChannels } from '../containers/ViewerPage/selectors';

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

export function* requestSignedURl() {
  try {
    console.log("requestSignedURl")
    const currentMedia = yield select(makeSelectCurrentMedia());
    console.log("currentMedia:", currentMedia)

    const episode = currentMedia.episodes[Math.floor(Math.random() * currentMedia.episodes.length)];

    const reqSuf = `signed_url?path=${episode}`

    const resp = yield call(mediaApi.get, reqSuf);
    console.log("resp", resp)
    yield put(setMediaSignedUrl(resp.data));
//    const currentMedia = yield select(makeSelectMedia());
//    if (currentMedia.length === 0) {
//      yield put(updateMedia(resp.data));
//    }
  } catch (err) {
    //    console.log('err', err);
  }
}

export default function* mediaSagas() {
  console.log("mediaSagas")
  yield takeLatest(CHECK_MEDIA, requestMedia);
  yield takeLatest(SET_SELECTED_MEDIA, requestSignedURl);
}
